import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { createStyles } from './RatingCard.style';

interface RatingCardProps {
    driverName: string;
    stars: number;
    onStarsChange: (value: number) => void;
    comment: string;
    onCommentChange: (value: string) => void;
    error?: string;
}

const RatingCard = ({
    driverName,
    stars,
    onStarsChange,
    comment,
    onCommentChange,
    error,
}: RatingCardProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.card} testID="complete-rate">
            <Text style={styles.rateTitle}>
                {t('rating-rate-driver', { name: driverName })}
            </Text>
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                    <Pressable
                        key={value}
                        onPress={() => onStarsChange(value)}
                        style={styles.star}
                        testID={`star-${value}`}
                        accessibilityRole="button"
                        accessibilityLabel={t('rating-star-label', { value })}
                    >
                        <MaterialIcons
                            name={value <= stars ? 'star' : 'star-border'}
                            size={36}
                            color={value <= stars ? '#F59E0B' : theme.colors.textSecondary}
                        />
                    </Pressable>
                ))}
            </View>
            <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={onCommentChange}
                placeholder={t('rating-comment-placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                testID="rating-comment"
            />
            {error && (
                <Text style={styles.errorText} testID="rating-error">
                    {error}
                </Text>
            )}
        </View>
    );
};

export default RatingCard;
