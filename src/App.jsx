import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HymnProvider } from './context/HymnContext';
import Layout from './components/Layout';

import Home from './pages/Home';
import Indice from './pages/Indice';
import Tematico from './pages/Tematico';
import Canto from './pages/Canto';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <ThemeProvider>
      <HymnProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="indice" element={<Indice />} />
              <Route path="tematico" element={<Tematico />} />
              <Route path="canto/:id" element={<Canto />} />
              <Route path="favoriti" element={<Favorites />} />
              <Route path="impostazioni" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HymnProvider>
    </ThemeProvider>
  );
}

export default App;
