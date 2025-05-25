import React from 'react';
import { Spinner, toast } from '@heroui/react';
import { CardStyleEditor } from './components/card-style-editor';

// Simple error boundary implementation
class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<any> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetErrorBoundary={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}
// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error; 
  resetErrorBoundary: () => void; 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-content1 p-8 rounded-lg shadow-lg max-w-md w-full mx-4 border border-divider">
        <div className="text-center">
          <div className="text-danger text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Hiba történt
          </h2>
          <p className="text-foreground-500 mb-4">
            {error.message || 'Váratlan hiba történt az alkalmazásban.'}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="bg-danger hover:bg-danger-600 text-danger-foreground px-4 py-2 rounded-md transition-colors"
          >
            Újrapróbálás
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-foreground-400">
              Technikai részletek
            </summary>
            <pre className="mt-2 text-xs text-foreground-600 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Loading component
function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" color="primary" className="mb-4" />
        <p className="text-foreground-500">Alkalmazás betöltése...</p>
      </div>
    </div>
  );
}

// Main App component
function AppContent() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-content1 shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">
                Card Style Editor
              </h1>
              <span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                v1.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme toggle, settings, etc. could go here */}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-content1 rounded-lg shadow-sm border border-divider">
          <CardStyleEditor />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-content1 border-t border-divider mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-foreground-500">
            <p>© 2024 Card Style Editor. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Root App component
export default function App() {
  return (
    <SimpleErrorBoundary fallback={ErrorFallback}>
      <React.Suspense fallback={<AppLoading />}>
        <AppContent />
      </React.Suspense>
    </SimpleErrorBoundary>
  );
}