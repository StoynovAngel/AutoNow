import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/types/navigation";
import { useRegister } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeStore } from "@/stores/themeStore";
import { ApiError } from "@/api/client";
import { createStyles } from "./RegisterScreen.styles";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const register = useRegister();
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleRegister = () => {
    setEmailError(null);
    setPasswordError(null);

    let hasError = false;
    if (!email.trim()) {
      setEmailError(t("errors.emailRequired"));
      hasError = true;
    }
    if (!password) {
      setPasswordError(t("errors.passwordRequired"));
      hasError = true;
    }
    if (hasError) return;

    register.mutate(
      { email: email.trim(), password },
      {
        onError: (error) => {
          if (error instanceof ApiError && error.fieldErrors) {
            setEmailError(error.fieldErrors.email ?? null);
            setPasswordError(error.fieldErrors.password ?? null);
          }
        },
      },
    );
  };

  const apiError =
    register.error &&
    !(register.error instanceof ApiError && register.error.fieldErrors)
      ? register.error.message
      : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t("auth.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.registerSubtitle")}</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder={t("auth.emailPlaceholder")}
            placeholderTextColor={colors.textDisabled}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {emailError && <Text style={styles.fieldError}>{emailError}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder={t("auth.passwordPlaceholder")}
            placeholderTextColor={colors.textDisabled}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setPasswordError(null);
            }}
            secureTextEntry
            autoComplete="new-password"
          />
          {passwordError && (
            <Text style={styles.fieldError}>{passwordError}</Text>
          )}
        </View>

        {apiError && <Text style={styles.apiError}>{apiError}</Text>}

        <TouchableOpacity
          style={[styles.button, register.isPending && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={register.isPending}
        >
          {register.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t("auth.registerButton")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>
            {t("auth.hasAccount")}{" "}
            <Text style={styles.linkBold}>{t("auth.loginLink")}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
