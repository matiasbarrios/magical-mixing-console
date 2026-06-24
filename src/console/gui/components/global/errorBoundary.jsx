// Requirements
import { Component } from 'react';


// Internal
class ErrorBoundaryInner extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('UI error boundary', error, info.componentStack);
    }

    render() {
        if (this.state.error) return null;
        return this.props.children;
    }
}


// Exported
export const StructureErrorBoundary = ({ children }) => (
    <ErrorBoundaryInner>
        { children }
    </ErrorBoundaryInner>
);
