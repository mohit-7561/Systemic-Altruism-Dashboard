import { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <FaExclamationTriangle className="error-icon" />
          <h2>Something went wrong with this dashboard section</h2>
          <p>Our team has been notified. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary; 