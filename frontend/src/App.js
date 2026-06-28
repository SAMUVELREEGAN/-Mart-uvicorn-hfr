import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './contexts';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './routes/ScrollToTop';
import './styles/global.css';
import './styles/mobile.css';
import './styles/desktop.css';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
