const cors = require('cors');
const app = require("./app.js");
const dotenv = require('dotenv');


dotenv.config();
// Configuro CORS
app.use(cors({
    origin: '*', // Permitir todas las solicitudes
    methods: ['GET', 'POST'], // Métodos permitidos
}));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
console.log(process.env.TWITTER_BEARER_TOKEN)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});