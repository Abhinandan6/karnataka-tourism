const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dustbinData = [];

app.post('/api/dustbins', (req, res) => {
  const { lat, lng, description } = req.body;
  dustbinData.push({ lat, lng, description });
  console.log('New dustbin:', lat, lng, description);
  res.json({ message: 'Dustbin saved successfully' });
});

app.get('/api/dustbins', (req, res) => {
  res.json(dustbinData);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
