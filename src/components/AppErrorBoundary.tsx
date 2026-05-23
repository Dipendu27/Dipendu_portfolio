import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare state: State;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Portfolio render failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-black text-white flex flex-col justify-center px-6 py-12">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Dipendu Mukherjee
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
              QA Portfolio
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-7">
              This browser had trouble loading the interactive version. You can still contact me directly.
            </p>
            <a
              href="mailto:dipendu.mukherjee.27@gmail.com"
              className="inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
            >
              Contact Candidate
            </a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
