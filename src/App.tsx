import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import GlobalAlert from './components/alert/GlobalAlert';
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <GlobalAlert />
    </ErrorBoundary>
  );
}

export default App
