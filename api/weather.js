const axios = require('axios');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { cidade = 'São Paulo' } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY; // Variável de ambiente
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key não configurada' });
    }

    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: API_KEY,
        q: cidade,
        lang: 'pt'
      }
    });

    const dados = {
      cidade: response.data.location.name,
      temperatura: response.data.current.temp_c,
      condicao: response.data.current.condition.text,
      icone: response.data.current.condition.icon
    };

    res.json(dados);
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao buscar dados do clima',
      details: error.message 
    });
  }
};
