const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simulación de almacenamiento en memoria
const tweetCategories = {};

// Ruta para obtener influencers
router.get('/', (req, res) => {
    res.send('Endpoint para buscar influencers');
});

router.get('/tweets', async (req, res) => {
    const username = req.query.username; // Obtener nombre del influencer
    if (!username) return res.status(400).send('Username es requerido');

    try {
        const response = await axios.get(
            `https://api.twitter.com/2/users/by/username/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
            }
        );

        const userId = response.data.data.id;

        // Obtener tweets recientes del usuario
        const tweetsResponse = await axios.get(
            `https://api.twitter.com/2/users/${userId}/tweets`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
            }
        );

        res.json(tweetsResponse.data);
    } catch (error) {
        if (error.response) {
            // Error de la API de Twitter
            console.error('Error en la respuesta de Twitter:', error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // No se recibió respuesta de la API
            console.error('No se recibió respuesta de Twitter:', error.request);
            res.status(500).send('No se pudo conectar con la API de Twitter.');
        } else {
            // Otros errores
            console.error('Error desconocido:', error.message);
            res.status(500).send('Error en el servidor.');
        }
    }
});

router.get('/influencer', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: 'Se requiere un nombre de usuario.' });
    }

    try {
        // Obtener el ID del usuario
        const userResponse = await axios.get(
            `https://api.twitter.com/2/users/by/username/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
            }
        );

        const userId = userResponse.data.data.id;

        // Obtener tweets recientes
        const tweetsResponse = await axios.get(
            `https://api.twitter.com/2/users/${userId}/tweets`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
                params: {
                    max_results: 5, // Número de tweets a obtener
                    "tweet.fields": "created_at,public_metrics", // Campos adicionales
                },
            }
        );

        // Procesar tweets para enviar solo los datos necesarios
        const tweets = tweetsResponse.data.data.map(tweet => ({
            id: tweet.id,
            text: tweet.text,
        }));

        res.json({ tweets, meta: tweetsResponse.data.meta });
    } catch (error) {
        console.error('Error al obtener los tweets:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Error al obtener los tweets.' });
    }
});

// Nueva ruta para guardar categorías de tweets
router.post('/tweets/:id/category', (req, res) => {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ error: 'Category is required' });
    }

    // Guardar la categoría en el almacenamiento en memoria
    if (!tweetCategories[id]) {
        tweetCategories[id] = [];
    }
    tweetCategories[id].push(category);

    res.status(200).json({ message: 'Category saved successfully', data: tweetCategories[id] });
});

module.exports = router;
