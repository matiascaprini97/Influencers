import React, { useState } from 'react';
import axios from 'axios';
const URL = "http://localhost:3000/api/influencers";

const TweetsList = () => {
    const [username, setUsername] = useState('');
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTweets = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${URL}/tweets?username=${username}`);
            setTweets(response.data.data.map(tweet => ({ ...tweet, category: '' }))); // Añadimos campo categoría
        } catch (err) {
            setError('No se pudieron obtener los tweets. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = async (id, category) => {
        try {
            // Enviar la categoría al backend
            await axios.post(`${URL}/tweets/${id}/category`, { category });

            // Actualizar la categoría en el estado local
            setTweets(prevTweets =>
                prevTweets.map(tweet =>
                    tweet.id === id ? { ...tweet, category } : tweet
                )
            );
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
            alert('No se pudo guardar la categoría. Intenta nuevamente.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Buscar Tweets</h1>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '8px', width: '200px' }}
                />
                <button onClick={fetchTweets} style={{ marginLeft: '10px', padding: '8px' }}>
                    Buscar
                </button>
            </div>
            {loading && <p>Cargando tweets...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {tweets.map((tweet) => (
                    <li key={tweet.id} style={{ marginBottom: '10px' }}>
                        <p>{tweet.text}</p>
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={tweet.category || ''}
                            onChange={(e) => handleCategoryChange(tweet.id, e.target.value)}
                            style={{ padding: '5px', width: '150px' }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TweetsList;

//const saveCategory = async (tweetId, category) => {
//   try {
//       const response = await axios.post(`${URL}/tweets/${tweetId}/category`, { category });
//       console.log('Categoría guardada:', response.data);
//   } catch (error) {
//      console.error('Error al guardar la categoría:', error);
//  }
//};

//export default TweetsList;