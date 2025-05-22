const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 🧠 Servir carpetas estáticas (esto es lo que permite ver imágenes desde React)
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));
app.use('/slides', express.static(path.join(__dirname, 'slides')));
app.use('/diffs', express.static(path.join(__dirname, 'diffs')));

// 🧩 Rutas para ejecutar scripts
app.post('/api/organizar', async (req, res) => {
  const organizar = require('./controllers/organizador');
  await organizar();
  res.send({ message: 'Archivos organizados' });
});

app.post('/api/verificar-cta', async (req, res) => {
  const verificar = require('./controllers/verificadorCTA-servidor');
  await verificar();
  res.send({ message: 'Verificación de CTA completada' });
});

app.post('/api/validar-slides', async (req, res) => {
  const validar = require('./controllers/slidesValidator');
  await validar();
  res.send({ message: 'Comparación visual completada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
