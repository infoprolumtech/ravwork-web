import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import GlobalAlert from './components/alert/GlobalAlert';
import ErrorBoundary from "./components/ErrorBoundary";
import MetaPixelInit from "./components/MetaPixelInit";


const App = () => {

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MetaPixelInit />
        <AppRoutes />
      </BrowserRouter>
      <GlobalAlert />
    </ErrorBoundary>
  );
}

export default App
