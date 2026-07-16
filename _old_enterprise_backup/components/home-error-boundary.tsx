"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class HomeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-heading text-2xl font-bold">
            Something went wrong loading this section.
          </h1>
          <p className="mt-3 text-space/60 dark:text-white/60">
            The rest of the site is unaffected. Please refresh or contact Mahira
            directly.
          </p>
        </section>
      );
    }
    return this.props.children;
  }
}
