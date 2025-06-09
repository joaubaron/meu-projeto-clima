// Sem axios - usando fetch nativo do Node.js
export default async function handler(req, res) {
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
    const API_KEY = process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key não configurada' });
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&lang=pt`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status}`);
    }
    
    const data = await response.json();

    const dados = {
      cidade: data.location.name,
      temperatura: data.current.temp_c,
      condicao: data.current.condition.text,
      icone: data.current.condition.icon
    };

    res.json(dados);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar dados do clima',
      details: error.message 
    });
  }
}
