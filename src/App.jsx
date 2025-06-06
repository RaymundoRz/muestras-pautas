// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Muestras from './pages/Muestras';
import Pautas from './pages/Pautas';
import Reportes from './pages/Reportes';
import AutomatizacionView from './Pages/AutomatizacionView';
import { BrandProvider } from './context/BrandContext';

export default function App() {
  return (
    <BrandProvider>
      <Router>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '24px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/muestras" element={<Muestras />} />
              <Route path="/pautas" element={<Pautas />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/automatizacion" element={<AutomatizacionView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BrandProvider>
  );
}
