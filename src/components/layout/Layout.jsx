import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import EventReminder from '../ui/EventReminder';
import ChatWidget from '../ui/ChatWidget';

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <EventReminder />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
