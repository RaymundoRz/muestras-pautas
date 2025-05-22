import React from 'react';
import axios from 'axios';

const procesos = [
  { ruta: 'organizar', label: '🗂️ Organizar archivos' },
  { ruta: 'verificar-cta', label: '🔗 Verificar CTA' },
  { ruta: 'validar-slides', label: '🖼️ Comparar con Slides' }
];

const AutomatizacionView = () => {
  const ejecutar = async (ruta, label) => {
    try {
      const res = await axios.post(`http://localhost:4000/api/${ruta}`);
      alert(`${label} ejecutado con éxito ✅`);
    } catch (err) {
      alert(`❌ Error en ${label}`);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🚀 Automatización de revisión de Muestras y Pautas</h2>
      <p>Haz clic en un proceso para ejecutarlo automáticamente desde el backend.</p>
      {procesos.map((proc) => (
        <button
          key={proc.ruta}
          onClick={() => ejecutar(proc.ruta, proc.label)}
          style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}
        >
          {proc.label}
        </button>
      ))}
    </div>
  );
};

export default AutomatizacionView;
