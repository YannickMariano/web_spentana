import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import ComplexePage from '../pages/ComplexePage';
import AcademyPage from '../pages/AcademyPage';
import TaninketsaPage from '../pages/TaninketsaPage';
import EventsPage from '../pages/EventsPage';
import GalleryPage from '../pages/GalleryPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/complexe" element={<ComplexePage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/taninketsa" element={<TaninketsaPage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/galerie" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
