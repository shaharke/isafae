import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MainPage } from './pages/MainPage';
import { CRUDPage } from './pages/CRUDPage';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/admin/*" element={<CRUDPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
