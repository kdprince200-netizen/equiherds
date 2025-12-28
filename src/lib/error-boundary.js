'use client';

import React from 'react';

// Global error boundary to catch and suppress Ant Design warnings
class AntdWarningBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if this is an Ant Design compatibility warning
    if (error.message && error.message.includes('antd')) {
      return { hasError: false }; // Don't show error boundary for Ant Design warnings
    }
    // Suppress Auth.js JSON parsing errors (expected when no session exists)
    if (
      error.message &&
      (error.message.includes('Unexpected end of JSON input') ||
       error.message.includes('ClientFetchError') ||
       error.message.includes('autherror'))
    ) {
      return { hasError: false }; // Don't show error boundary for Auth errors
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Suppress Ant Design warnings
    if (error.message && error.message.includes('antd')) {
      console.log('Suppressed Ant Design warning:', error.message);
      return;
    }
    
    // Suppress Auth.js JSON parsing errors (expected when no session exists)
    if (
      error.message &&
      (error.message.includes('Unexpected end of JSON input') ||
       error.message.includes('ClientFetchError') ||
       error.message.includes('autherror'))
    ) {
      // Silently handle - these are expected when no session exists
      return;
    }
    
    // Log other errors normally
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Hook to suppress warnings in functional components
export const useSuppressWarnings = () => {
  React.useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' && 
        (message.includes('[antd: compatible]') ||
         message.includes('antd v5 support React is 16 ~ 18') ||
         message.includes('see https://u.ant.design/v5-for-19'))
      ) {
        return; // Suppress
      }
      // Suppress Auth.js JSON parsing errors
      if (
        typeof message === 'string' &&
        (message.includes('Unexpected end of JSON input') ||
         message.includes('ClientFetchError') ||
         message.includes('autherror') ||
         (args[0]?.message && (
           args[0].message.includes('Unexpected end of JSON input') ||
           args[0].message.includes('ClientFetchError') ||
           args[0].message.includes('autherror')
         )))
      ) {
        return; // Suppress Auth.js errors
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' && 
        (message.includes('[antd: compatible]') ||
         message.includes('antd v5 support React is 16 ~ 18') ||
         message.includes('see https://u.ant.design/v5-for-19'))
      ) {
        return; // Suppress
      }
      originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);
};

export default AntdWarningBoundary;
