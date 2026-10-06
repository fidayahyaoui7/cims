import { lazy } from 'react';

// A simpler version that handles both default and named exports
const lazyWithRetry = (componentImport) => {
  return lazy(async () => {
    try {
      const module = await componentImport();
      // Handle both default and named exports
      const Component = module.default || module;
      return { default: Component };
    } catch (error) {
      console.error('Error loading component:', error);
      // Return a simple error component
      const ErrorComponent = () => (
        <div className="error-loading p-4 text-center">
          <h3 className="text-red-500 font-bold">Error Loading Component</h3>
          <p className="text-gray-600">Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      );
      return { default: ErrorComponent };
    }
  });
};

export default lazyWithRetry;
