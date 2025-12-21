import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                    <Card className="w-full max-w-lg p-6 border-red-200 shadow-xl">
                        <div className="text-center space-y-4">
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
                            <p className="text-gray-600">
                                An unexpected error occurred. Please try reloading the page.
                            </p>

                            {/* Developer Details - Only shows in non-production usually, but helpful here */}
                            <div className="bg-gray-900 text-red-300 p-4 rounded text-left text-xs overflow-auto max-h-48 font-mono">
                                <p className="font-bold border-b border-gray-700 pb-2 mb-2">Error Details:</p>
                                <p>{this.state.error && this.state.error.toString()}</p>
                                <br />
                                <p className="text-gray-500">{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
                            </div>

                            <div className="flex gap-4 justify-center pt-4">
                                <Button onClick={this.handleHome} variant="outline">
                                    Go Home
                                </Button>
                                <Button onClick={this.handleReload} variant="primary">
                                    Reload Page
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
