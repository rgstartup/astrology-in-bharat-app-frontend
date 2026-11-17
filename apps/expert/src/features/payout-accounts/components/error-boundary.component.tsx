"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class PayoutAccountsErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(
      "PayoutAccounts error boundary caught:",
      _error,
      errorInfo.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-8 text-center text-red-600">
            <p>Something went wrong loading your payout accounts.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
