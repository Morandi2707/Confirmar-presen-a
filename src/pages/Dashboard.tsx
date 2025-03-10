import React, { useState, useEffect } from 'react';
import { Users, Trash2, Calendar, Clock, MapPin, RefreshCcw, Lock } from 'lucide-react';
import { Guest } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export default function Dashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadGuests();
      const interval = setInterval(loadGuests, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadGuests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/guests`);
      console.log("Response data:", response.data);  // Verifique a estrutura da resposta
      setGuests(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Erro ao carregar convidados:", error);
      alert("Erro ao carregar dados!");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGuest = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/guests/${id}`);
      loadGuests(); // Recarrega a lista após deletar
    } catch (error) {
      console.error("Erro ao deletar convidado:", error);
      alert("Erro ao remover convidado!");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E4E6EF]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Lock className="w-12 h-12 mx-auto text-[#032F70]" />
          <h2 className="text-xl font-semibold mt-4 text-[#032F70]">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Digite a senha para acessar o painel</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#032F70]"
              required
            />
            <button type="submit" className="w-full py-3 bg-[#032F70] text-white rounded-lg">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalGuests = guests.reduce((total, g) => total + g.Convidado, 0);
  const averageGuestsPerRSVP = guests.length ? (totalGuests / guests.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#E4E6EF]">
      <div className="bg-[#032F70] text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Dashboard - Inauguração do Galpão de Feu Rosa</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#F7CF05]" />
              <span>20 de Março de 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#F7CF05]" />
              <span>Rua Natal 1 - S/N Portal de Jacaraípe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#F7CF05]" />
              <span>A partir das 15:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#032F70]">Estatísticas do Evento</h2>
          <button
            onClick={loadGuests}
            className="flex items-center space-x-2 text-[#032F70] hover:text-[#021d45]"
          >
            <RefreshCcw className="w-4 h-4" />
            <span className="text-sm">Última atualização: {lastUpdate}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Confirmações</p>
                <p className="text-3xl font-bold text-[#032F70]">{guests.length}</p>
              </div>
              <Users className="w-12 h-12 text-[#F7CF05]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Convidados</p>
                <p className="text-3xl font-bold text-[#032F70]">{totalGuests}</p>
              </div>
              <Users className="w-12 h-12 text-[#F7CF05]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Média de Convidados por RSVP</p>
                <p className="text-3xl font-bold text-[#032F70]">{averageGuestsPerRSVP}</p>
              </div>
              <Users className="w-12 h-12 text-[#F7CF05]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#032F70]">Lista de Confirmações</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#E4E6EF]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#032F70]">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#032F70]">Email</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-[#032F70]">Convidados</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-[#032F70]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{guest.Nome}</td>
                    <td className="px-6 py-4 text-sm">{guest.Email}</td>
                    <td className="px-6 py-4 text-sm text-center">{guest.Convidado}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => deleteGuest(guest.id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
