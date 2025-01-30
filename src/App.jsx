import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
