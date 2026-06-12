import 'expo-dev-client';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import {I18nextProvider} from 'react-i18next';
import i18n from "../frontend/src/config/i18n";
import {AuthProvider} from './src/services/AuthContext';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ErrorBoundary} from './src/components/ErrorBoundary';

export default function App() {
    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <PaperProvider>
                    <AuthProvider>
                        <NavigationContainer>
                            <I18nextProvider i18n={i18n}>
                                <Navigation/>
                            </I18nextProvider>
                        </NavigationContainer>
                    </AuthProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}
