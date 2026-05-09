import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-dvh place-items-center bg-mist p-8 text-center">
          <div>
            <h1 className="text-2xl font-extrabold text-graphite">Something went wrong</h1>
            <p className="mt-3 max-w-md text-sm text-muted">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl bg-graphite px-6 py-3 font-bold text-white"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
