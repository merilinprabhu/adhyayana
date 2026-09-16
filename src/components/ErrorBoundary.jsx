import React from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';

import { resetApplicationCache } from '../utils/storage';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearCacheAndReload = () => {
    try {
      resetApplicationCache(true);
    } catch (e) {
      localStorage.clear();
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ಪುಟವನ್ನು ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿದೆ
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                An unexpected error occurred while rendering this view.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl text-left border border-slate-800 text-xs font-mono text-red-400 max-h-40 overflow-y-auto">
              <strong>Error:</strong> {this.state.error?.toString()}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ (Refresh)</span>
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ಕ್ಯಾಶ್ ಕ್ಲಿಯರ್ ಮಾಡಿ (Reset Cache)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
