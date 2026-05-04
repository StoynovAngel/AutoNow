import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import {I18nextProvider} from 'react-i18next';
import i18n from "../frontend/src/config/i18n";
import {ThemeProvider} from './src/hooks/useTheme';
import {AuthProvider} from './src/services/AuthContext';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NavigationContainer>
                    <I18nextProvider i18n={i18n}>
                        <Navigation/>
                    </I18nextProvider>
                </NavigationContainer>
            </AuthProvider>
        </ThemeProvider>
    );
}
