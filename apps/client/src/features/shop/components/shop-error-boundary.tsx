"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ShopErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ShopErrorBoundary caught:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-8 text-center">
          <p className="text-base font-semibold text-neutral-900 mb-2">
            Something went wrong
          </p>
          <p className="text-xs text-neutral-500 mb-4">
            {this.state.error?.message || "Failed to load content"}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}