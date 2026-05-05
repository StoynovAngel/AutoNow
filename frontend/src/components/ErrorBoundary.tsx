import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.errorText}>
                            {this.state.error?.toString()}
                        </Text>
                        <Text style={styles.stackText}>
                            {this.state.errorInfo?.componentStack}
                        </Text>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
    },
    errorText: {
        fontSize: 14,
        color: '#c0392b',
        marginBottom: 10,
        fontFamily: 'monospace',
    },
    stackText: {
        fontSize: 12,
        color: '#7f8c8d',
        fontFamily: 'monospace',
    },
});
