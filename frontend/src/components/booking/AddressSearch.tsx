import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { searchAddress } from '../../services/mapboxService';
import type { AddressSuggestion, Coordinate } from '../../services/mapboxService';
import { createStyles } from './AddressSearch.style';

interface AddressSearchProps {
    proximity?: Coordinate;
    selected?: AddressSuggestion;
    onSelect: (suggestion: AddressSuggestion) => void;
    onClear: () => void;
    debounceMs?: number;
    placeholder?: string;
    testID?: string;
}

const AddressSearch = ({
    proximity,
    selected,
    onSelect,
    onClear,
    debounceMs = 400,
    placeholder,
    testID,
}: AddressSearchProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (selected) return;
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setSuggestions([]);
            setError(undefined);
            return;
        }

        const requestId = ++requestIdRef.current;
        setLoading(true);
        const handle = setTimeout(async () => {
            try {
                const results = await searchAddress(trimmed, proximity);
                if (requestIdRef.current === requestId) {
                    setSuggestions(results);
                    setError(undefined);
                }
            } catch (e) {
                if (requestIdRef.current === requestId) {
                    setError(e instanceof Error ? e.message : 'Search failed');
                    setSuggestions([]);
                }
            } finally {
                if (requestIdRef.current === requestId) setLoading(false);
            }
        }, debounceMs);

        return () => clearTimeout(handle);
    }, [query, proximity, selected, debounceMs]);

    const handleSelect = (s: AddressSuggestion) => {
        setQuery('');
        setSuggestions([]);
        onSelect(s);
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setError(undefined);
        onClear();
    };

    if (selected) {
        return (
            <View style={styles.selectedRow} testID={testID ? `${testID}-selected` : 'address-selected'}>
                <View style={styles.selectedIcon} />
                <Text style={styles.selectedText} numberOfLines={2}>
                    {selected.placeName}
                </Text>
                <Pressable
                    onPress={handleClear}
                    style={styles.clearButton}
                    testID={testID ? `${testID}-clear` : 'address-clear'}
                >
                    <Text style={styles.clearText}>×</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder ?? t('booking-where-to')}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={query}
                    onChangeText={setQuery}
                    testID={testID ? `${testID}-input` : 'address-input'}
                    autoCorrect={false}
                />
                {loading && (
                    <ActivityIndicator
                        style={styles.spinner}
                        color={theme.colors.primary}
                        testID={testID ? `${testID}-loading` : 'address-loading'}
                    />
                )}
            </View>
            {error && (
                <Text style={styles.errorText} testID={testID ? `${testID}-error` : 'address-error'}>
                    {error}
                </Text>
            )}
            {suggestions.length > 0 && (
                <ScrollView
                    style={styles.suggestions}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    testID={testID ? `${testID}-suggestions` : 'address-suggestions'}
                >
                    {suggestions.map((s) => (
                        <Pressable
                            key={s.id}
                            style={styles.suggestion}
                            onPress={() => handleSelect(s)}
                            testID={testID ? `${testID}-suggestion-${s.id}` : `address-suggestion-${s.id}`}
                        >
                            <Text style={styles.suggestionText} numberOfLines={2}>
                                {s.placeName}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default AddressSearch;
