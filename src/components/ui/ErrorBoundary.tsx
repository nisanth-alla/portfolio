"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Rendered instead of the children after a crash. Defaults to nothing. */
  fallback?: ReactNode;
  /** Used in the console message to identify which island failed. */
  name: string;
};

type ErrorBoundaryState = { failed: boolean };

/**
 * Contains a crash to one interactive island (terminal, canvas, heatmap…),
 * so the rest of the page keeps working. Error boundaries still require a
 * class component in React 19.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.name}] crashed and was replaced by its fallback`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}