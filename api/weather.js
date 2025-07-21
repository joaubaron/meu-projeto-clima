    // meu-projeto-clima/api/weather.js
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
          // Tenta ler a resposta de erro da API para detalhes
          const errorData = await response.json();
          throw new Error(`Erro da API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();

        // Retornar dados brutos ou o objeto 'current' diretamente para compatibilidade
        if (tipo === 'current') {
          res.json({ current: data.current }); // Retorna o objeto 'current' como esperado pelo frontend
        } else if (tipo === 'forecast') {
          res.json(data);
        } else if (tipo === 'astronomy') {
          res.json(data.astronomy.astro);
        }

      } catch (error) {
        console.error('Erro no backend:', error); // Log mais detalhado
        res.status(500).json({
          error: 'Erro ao buscar dados no servidor',
          details: error.message
        });
      }
    }
  
