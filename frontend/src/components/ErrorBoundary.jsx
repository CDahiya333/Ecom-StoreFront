import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render shows the fallback UI.
      return { hasError: true, error };
    }
  
    componentDidCatch(error, errorInfo) {
      // Log the error for further analysis.
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // Customize this fallback UI as desired.
        return (
            <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col justify-center items-center py-20 pb-16">
            <h2 className="text-3xl font-bold mb-4">Oh, something broke!</h2>
            <p className="text-lg mb-8">Try refreshing the page.</p>
            {/* Optional: display error details for debugging (you might remove this in production) */}
            {/* <pre className="bg-white p-4 rounded shadow-md">{error.toString()}</pre> */}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        );
      }
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;