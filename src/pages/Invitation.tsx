import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Guest } from '../types';

export default function Invitation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1'
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  
  // URL do backend
  const API_BASE_URL = "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGuest: Guest = {
      name: formData.name,
      email: formData.email,
      guests: parseInt(formData.guests)
    };

    try {
      await axios.post(`${API_BASE_URL}/guests`, newGuest);
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        setFormData({ name: '', email: '', guests: '1' });
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao confirmar presença!");
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E6EF] py-12 px-4">
      <AnimatePresence>
        {showThankYou ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
              <h2 className="text-2xl font-bold text-[#032F70] mb-2">Obrigado pela confirmação!</h2>
              <p className="text-gray-600">Sua presença é muito importante para nós.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#032F70] py-8 px-6 text-white text-center">
                <h1 className="text-3xl font-bold mb-6">Inauguração do Galpão de Feu Rosa</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5 text-[#F7CF05]" />
                    <span>15 de Junho de 2024</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#F7CF05]" />
                    <span>Salão de Festas Elegance</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5 text-[#F7CF05]" />
                    <span>19:00h</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Seu Nome Completo"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#032F70]"
                  />
                  <input
                    type="email"
                    placeholder="Seu Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#032F70]"
                  />
                  <div className="relative">
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#032F70] appearance-none"
                    >
                      <option value="1">1 pessoa</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#032F70] text-white rounded-lg font-semibold hover:bg-[#021d45]">
                    Confirmar Presença
                  </button>
                </form>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 w-full py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-900"
                >
                  Acesso Administrativo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
