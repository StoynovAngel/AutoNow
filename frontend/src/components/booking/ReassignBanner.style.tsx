import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (_theme: Theme) =>
    StyleSheet.create({
        reassignBanner: {
            backgroundColor: '#FEF3C7',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        reassignBannerText: {
            flex: 1,
            color: '#92400E',
            fontSize: 14,
            fontWeight: '600',
        },
    });
