export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { cidade, tipo = 'current', days = 2, date = 'today' } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

if (!API_KEY) {
  return res.status(500).json({ error: 'API key não configurada' });
}

    let url;
    
    // Determinar qual endpoint usar baseado no tipo
    switch (tipo) {
      case 'current':
        url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&lang=pt`;
        break;
      case 'forecast':
        url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&days=${days}&lang=pt`;
        break;
      case 'astronomy':
        url = `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&dt=${date}`;
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status}`);
    }
    
    const data = await response.json();

    // Retornar dados baseado no tipo
    if (tipo === 'current') {
      res.json({
        cidade: data.location.name,
        temperatura: data.current.temp_c,
        condicao: data.current.condition.text,
        icone: data.current.condition.icon,
        codigo: data.current.condition.code,
        is_day: data.current.is_day === 1,
        current: data.current // Manter compatibilidade
      });
    } else if (tipo === 'forecast') {
      res.json(data);
    } else if (tipo === 'astronomy') {
      res.json(data.astronomy.astro);
    }

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar dados',
      details: error.message 
    });
  }
}
