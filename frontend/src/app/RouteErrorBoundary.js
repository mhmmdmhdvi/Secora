import React from "react";
import { useTranslation } from "react-i18next";
import { ErrorState } from "../Components/UI";

function RouteErrorFallback({ onReset }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <ErrorState onAction={onReset}>
        {t("state.routeError")}
      </ErrorState>
    </div>
  );
}

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.error &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <RouteErrorFallback onReset={() => this.setState({ error: null })} />
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
