import React, { useCallback, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/Navigation';
import { VehicleType } from '../../types/vehicle';
import type { ChatbotMessage } from '../../types/chatbot';
import { sendChatbotMessage } from '../../services/chatbotService';
import { createStyles } from './Chatbot.style';

const Chatbot = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatbotMessage[]>([
        { role: 'assistant', content: t('chatbot-greeting') },
    ]);
    const [recommendedService, setRecommendedService] = useState<VehicleType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<ScrollView | null>(null);

    const close = useCallback(() => {
        setOpen(false);
        setError(null);
    }, []);

    const handleSend = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) {
            return;
        }
        setError(null);
        setRecommendedService(null);
        const nextHistory: ChatbotMessage[] = [...messages, { role: 'user', content: trimmed }];
        setMessages(nextHistory);
        setInput('');
        setLoading(true);
        try {
            const response = await sendChatbotMessage({
                message: trimmed,
                history: messages,
            });
            setMessages([...nextHistory, { role: 'assistant', content: response.reply }]);
            setRecommendedService(response.recommendedService);
        } catch (e) {
            setError(t('chatbot-error'));
        } finally {
            setLoading(false);
            requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
        }
    }, [input, loading, messages, t]);

    const goToRecommended = useCallback(() => {
        if (!recommendedService) {
            return;
        }
        close();
        navigation.navigate('companyList', { vehicleType: recommendedService });
    }, [recommendedService, close, navigation]);

    return (
        <>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('chatbot-open')}
                style={[styles.fab, { bottom: 24 + insets.bottom }]}
                onPress={() => setOpen(true)}
            >
                <MaterialIcons name="chat" size={28} color="#FFFFFF" />
            </Pressable>

            <Modal
                visible={open}
                animationType="slide"
                transparent
                statusBarTranslucent
                onRequestClose={close}
            >
                <View style={styles.modalBackdrop}>
                    <KeyboardAvoidingView
                        style={styles.sheetWrapper}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                    <View style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>{t('chatbot-title')}</Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={t('chatbot-close')}
                                style={styles.closeButton}
                                onPress={close}
                            >
                                <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
                            </Pressable>
                        </View>

                        <ScrollView
                            ref={scrollRef}
                            style={styles.messages}
                            keyboardShouldPersistTaps="handled"
                            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                        >
                            {messages.map((m, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.messageBubble,
                                        m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                                    ]}
                                >
                                    <Text style={m.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant}>
                                        {m.content}
                                    </Text>
                                </View>
                            ))}

                            {loading && (
                                <Text style={styles.typingText}>{t('chatbot-typing')}</Text>
                            )}

                            {recommendedService && !loading && (
                                <Pressable
                                    accessibilityRole="button"
                                    style={styles.ctaButton}
                                    onPress={goToRecommended}
                                >
                                    <Text style={styles.ctaButtonText}>
                                        {t('chatbot-go-to', { service: t(recommendedService.toLowerCase()) })}
                                    </Text>
                                </Pressable>
                            )}

                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </ScrollView>

                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('chatbot-placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                value={input}
                                onChangeText={setInput}
                                onSubmitEditing={handleSend}
                                returnKeyType="send"
                                editable={!loading}
                                maxLength={500}
                            />
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={t('chatbot-send')}
                                style={[
                                    styles.sendButton,
                                    (!input.trim() || loading) && styles.sendButtonDisabled,
                                ]}
                                onPress={handleSend}
                                disabled={!input.trim() || loading}
                            >
                                <MaterialIcons name="send" size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>
    );
};

export default Chatbot;
