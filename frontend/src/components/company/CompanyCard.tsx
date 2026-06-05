import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Company } from '../../types/company';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './Body.style';

interface CompanyCardProps {
    company: Company;
    onCall: (phoneNumber: string) => void;
    onBook?: (companyId: number) => void;
}

const CompanyCard = ({ company, onCall, onBook }: CompanyCardProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.companyCard}>
            <View style={styles.companyInfo}>
                <View style={styles.companyHeader}>
                    <Text style={styles.companyName}>{company.name}</Text>
                    {company.rating !== undefined && (
                        <View style={styles.ratingContainer}>
                            <MaterialIcons name="star" size={16} color="#F59E0B" />
                            <Text style={styles.ratingText}>{company.rating.toFixed(1)}</Text>
                        </View>
                    )}
                </View>

                {company.description && (
                    <Text style={styles.companyDescription} numberOfLines={2}>
                        {company.description}
                    </Text>
                )}

                <View style={styles.companyDetails}>
                    {company.address && (
                        <View style={styles.detailRow}>
                            <MaterialIcons name="location-on" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.detailText} numberOfLines={1}>{company.address}</Text>
                        </View>
                    )}
                    {company.distance !== undefined && (
                        <View style={styles.detailRow}>
                            <MaterialIcons name="directions" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.detailText}>{company.distance.toFixed(1)} km</Text>
                        </View>
                    )}
                </View>

                {onBook && (
                    <Pressable
                        style={styles.bookButton}
                        onPress={() => onBook(company.id)}
                        testID={`book-${company.id}`}
                    >
                        <Text style={styles.bookButtonText}>{t('booking-book')}</Text>
                    </Pressable>
                )}
            </View>

            <Pressable
                style={styles.callButton}
                onPress={() => onCall(company.phone)}
            >
                <MaterialIcons name="phone" size={24} color="#FFFFFF" />
            </Pressable>
        </View>
    );
};

export default CompanyCard;
