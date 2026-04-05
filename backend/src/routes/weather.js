const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org';

// Get weather for flight location
router.get('/current/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API not configured' });
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }
    );

    const weatherData = {
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      windDegree: response.data.wind.deg,
      clouds: response.data.clouds.all,
      visibility: response.data.visibility,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      timestamp: new Date(response.data.dt * 1000),
    };

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch weather: ${error.message}` });
  }
});

// Get weather forecast
router.get('/forecast/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API not configured' });
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/data/2.5/forecast`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }
    );

    const forecast = response.data.list.map((item) => ({
      timestamp: new Date(item.dt * 1000),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      windDegree: item.wind.deg,
      description: item.weather[0].description,
      precipitationChance: item.pop,
    }));

    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast,
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch forecast: ${error.message}` });
  }
});

module.exports = router;
