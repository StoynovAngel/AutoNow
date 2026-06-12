import {useState} from 'react';
import {ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View, Pressable} from 'react-native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RootStackParamList} from "../../../navigation/Navigation";
import {TextInput, Button, Text} from 'react-native-paper';
import {createStyles} from "./Body.style";
import {useAuth} from "../../../hooks/useAuth";
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import { theme } from '../../../constants/theme';
import {parseApiError} from "../../../utils/errorParser";

const loginBackground = require("../../../assets/images/background.jpg");

const Body = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    const styles = createStyles(theme)

    const {login} = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogin = async () => {
        setApiError('');

        setLoading(true);
        try {
            await login(email, password);
        } catch (err: unknown) {
            setApiError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={loginBackground} style={styles.backgroundImage}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.loginContainer}>
                        <Text style={styles.title}>
                            <Text style={styles.highlight}>{t("welcome")}</Text>
                        </Text>

                        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

                        <View style={styles.inputContainer}>
                            <TextInput
                                label={t('email')}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                mode="outlined"
                                outlineColor="transparent"
                                activeOutlineColor={theme.colors.primary}
                                theme={{ colors: { onSurfaceVariant: '#1A1A1A', onSurface: '#1A1A1A' } }}
                            />
                            <TextInput
                                label={t('password')}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                                mode="outlined"
                                outlineColor="transparent"
                                activeOutlineColor={theme.colors.primary}
                                theme={{ colors: { onSurfaceVariant: '#1A1A1A', onSurface: '#1A1A1A' } }}
                            />
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            style={styles.loginButton}
                            textColor="#FFFFFF"
                            loading={loading}
                            disabled={loading}
                            labelStyle={{fontSize: 16, fontWeight: '600'}}
                        >
                            {loading ? 'Logging in...' : t('login-button')}
                        </Button>

                        <Pressable onPress={() => navigation.navigate("register")} style={styles.registerLinkContainer}>
                            <Text style={styles.registerLinkText}>
                                Don't have an account? <Text
                                style={styles.registerLinkHighlight}>{t('register-button')}</Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default Body;