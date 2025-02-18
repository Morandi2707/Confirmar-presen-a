require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SHEET_ID;

// Endpoint GET corrigido
app.get("/guests", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Planilha1!A1", // Pega todas as colunas
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return res.json([]);
    
    const guests = rows.slice(1).map((row, index) => ({
      id: index + 1, // ID baseado na posição da linha
      Nome: row[0],
      Email: row[1],
      Convidado: parseInt(row[2]) || 0,
    }));

    res.json(guests);
  } catch (error) {
    console.error("Erro ao buscar convidados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// Endpoint DELETE corrigido
app.delete("/guests/:id", async (req, res) => {
  try {
    const rowIndex = parseInt(req.params.id); // ID já vem correto do front
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: rowIndex, // Já considera o cabeçalho
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar linha:", error);
    res.status(500).json({ error: "Erro ao deletar registro" });
  }
});

// Restante do código permanece igual...
// (Endpoints POST e login sem alterações)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));