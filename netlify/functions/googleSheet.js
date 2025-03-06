// netlify/functions/googleSheet.js

exports.handler = async (event, context) => {

const { default: fetch } = await import('node-fetch');

  const apiKey = process.env.apiKey; // Se obtiene la API key desde las variables de entorno configuradas en Netlify
  const spreadsheetId = process.env.sheetId; // Reemplaza con el ID real de tu hoja de Google Sheets
  const range = 'Resultados Finales!A1:Z100';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};