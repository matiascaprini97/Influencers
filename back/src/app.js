const express = require('express');
const dotenv = require('dotenv');
const influencerRoutes = require('./routes/influencerRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

console.log(process.env.TWITTER_BEARER_TOKEN)

// Rutas
app.use('/api/influencers', influencerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});