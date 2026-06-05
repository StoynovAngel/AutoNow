import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './Counter.style';

interface CounterProps {
    label: string;
    value?: number;
    min: number;
    max: number;
    onChange: (next: number | undefined) => void;
    testID?: string;
}

const Counter = ({ label, value, min, max, onChange, testID }: CounterProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const decrement = () => {
        if (value === undefined) return;
        if (value <= min) {
            onChange(undefined);
            return;
        }
        onChange(value - 1);
    };

    const increment = () => {
        if (value === undefined) {
            onChange(min);
            return;
        }
        if (value >= max) return;
        onChange(value + 1);
    };

    const decDisabled = value === undefined;
    const incDisabled = value !== undefined && value >= max;

    return (
        <View style={styles.container} testID={testID}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.controls}>
                <Pressable
                    style={[styles.button, decDisabled && styles.buttonDisabled]}
                    onPress={decrement}
                    disabled={decDisabled}
                    testID={testID ? `${testID}-decrement` : undefined}
                >
                    <MaterialIcons name="remove" size={20} color={theme.colors.textPrimary} />
                </Pressable>
                <Text
                    style={[styles.value, value === undefined && styles.valueUnset]}
                    testID={testID ? `${testID}-value` : undefined}
                >
                    {value === undefined ? '—' : value}
                </Text>
                <Pressable
                    style={[styles.button, incDisabled && styles.buttonDisabled]}
                    onPress={increment}
                    disabled={incDisabled}
                    testID={testID ? `${testID}-increment` : undefined}
                >
                    <MaterialIcons name="add" size={20} color={theme.colors.textPrimary} />
                </Pressable>
            </View>
        </View>
    );
};

export default Counter;
