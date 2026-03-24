import React, { ErrorInfo, ReactNode } from 'react';
import { Icons } from '../../components/Icons';
import { BrandPattern } from './BrandPattern';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col bg-green-50/30 h-screen items-center justify-center p-6 text-center relative overflow-hidden">
          <BrandPattern opacity={0.03} size={60} animate={true} className="absolute inset-0 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-md w-full">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-500 shadow-2xl shadow-red-500/20 relative border border-red-100 rotate-12">
                <Icons.Alert className="w-10 h-10 -rotate-12" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-3">Oops! Something went wrong.</h1>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-10 px-4">
              We encountered an unexpected error while processing your request. Don't worry, your funds are safe.
            </p>

            <div className="w-full space-y-3">
              <button 
                className="w-full h-14 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                onClick={() => window.location.reload()}
              >
                <Icons.Refresh className="w-4 h-4" />
                Reload Page
              </button>
              <button 
                className="w-full h-14 bg-white text-gray-600 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-sm border border-gray-100 active:scale-95 transition-all"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
