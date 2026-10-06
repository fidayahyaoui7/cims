import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (hasError) {
      if (Fallback) {
        return <Fallback error={error} errorInfo={errorInfo} />;
      }
      return <DefaultErrorFallback error={error} errorInfo={errorInfo} />;
    }

    return children;
  }
}

const DefaultErrorFallback = ({ error, errorInfo }) => {
  const { t } = useTranslation();
  
  return (
    <div className="alert alert-danger m-3" role="alert">
      <h4 className="alert-heading">{t('error.somethingWentWrong')}</h4>
      <p>{t('error.tryRefreshing')}</p>
      {process.env.NODE_ENV === 'development' && (
        <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>{t('error.details')}</summary>
          <div className="mt-2">
            <strong>{error?.toString()}</strong>
            <div className="mt-2 small">
              {errorInfo?.componentStack}
            </div>
          </div>
        </details>
      )}
      <div className="mt-3">
        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={() => window.location.reload()}
        >
          {t('common.reload')}
        </button>
      </div>
    </div>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
};

// Higher-order component for easier usage
const withErrorBoundary = (WrappedComponent, Fallback) => {
  return (props) => (
    <ErrorBoundary fallback={Fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
};

export { ErrorBoundary, withErrorBoundary };
export default ErrorBoundary;
