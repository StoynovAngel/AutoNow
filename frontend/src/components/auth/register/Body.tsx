import React, {useState} from 'react';
import {ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View, Pressable} from 'react-native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RootStackParamList} from "../../../navigation/Navigation";
import {TextInput, Button, Text} from 'react-native-paper';
import {createStyles} from "./Body.style";
import {useAuth} from "../../../hooks/useAuth";
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useTheme} from "../../../hooks/useTheme";

const loginBackground = require("../../../assets/images/background.jpg");

const Body = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    const {theme} = useTheme();
    const styles = createStyles(theme)

    const {register} = useAuth();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleRegister = async () => {
        setApiError('');

        setLoading(true);
        try {
            await register(email, password);
            navigation.navigate("home");
        } catch (err: any) {
            setApiError(err.message);
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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.registerContainer}>
                        <Text style={styles.title}>
                            <Text style={styles.highlight}>{t('create-account')}</Text>
                        </Text>

                        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

                        <View style={styles.inputContainer}>
                            <TextInput
                                label={t('email')}
                                value={email}
                                onChangeText={(text: React.SetStateAction<string>) => {
                                    setEmail(text);
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                mode="outlined"
                                outlineColor="transparent"
                                activeOutlineColor={theme.colors.primary}
                            />

                            <TextInput
                                label={t('password')}
                                value={password}
                                onChangeText={(text: React.SetStateAction<string>) => {
                                    setPassword(text);
                                }}
                                secureTextEntry
                                style={styles.input}
                                mode="outlined"
                                outlineColor="transparent"
                                activeOutlineColor={theme.colors.primary}
                            />
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            style={styles.registerButton}
                            loading={loading}
                            disabled={loading}
                            labelStyle={{fontSize: 16, fontWeight: '600'}}
                        >
                            {loading ? 'Registering...' : t('register-button')}
                        </Button>

                        <Pressable onPress={() => navigation.navigate("login")} style={styles.loginLinkContainer}>
                            <Text style={styles.loginLinkText}>
                                Already have an account? <Text
                                style={styles.loginLinkHighlight}>{t('login-button')}</Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default Body;