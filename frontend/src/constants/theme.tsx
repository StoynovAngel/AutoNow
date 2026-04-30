export const theme = {
    colors: {
        primary: '#444444',
        secondary: '#CECECC',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        textPrimary: '#333333',
        textSecondary: '#777777',
        border: '#e0e0e0',
        ripple: 'rgba(0,0,0,0.1)',
        shadow: '#000',
        transparent: 'transparent',
        textTertiary: '#555555',
        textValidationError: '#E3525E',
        error: '#F26161'
    },
    spacing: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    fontSizes: {
        body: 14,
        title: 18,
        header: 24,
        subheader: 12,
    },
    radii: {
        sm: 4,
        md: 8,
        lg: 16,
        full: 999,
    },
    sizes: {
        priceText: 16,
        cardPadding: 12,
        cardMargin: 8,
        addButtonSize: 30,

        profileImage: 40,
        tabBarHeight: 60,
        imageHeight: 240,
        icon: 24,
        addButton: 30,
        maxWidth: 400
    },
    iconSizes: {
        md: 24,
    },
    elevation: {
        sm: 2,
        md: 4,
        lg: 8,
    },
    lineHeights: {
        body: 18,
        title: 22,
    },
    components: {
        header: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            height: 64,
            imageSize: 40,
        },
        card: {
            padding: 16,
            margin: 8,
            borderRadius: 8,
            imageHeight: 240,
        },
        button: {
            sm: {
                padding: 8,
                borderRadius: 4,
            },
            md: {
                padding: 12,
                borderRadius: 8,
            }
        },
        tabBar: {
            iconSize: 24,
            labelMargin: 4,
        },
        listItem: {
            imageSize: 80,
            paddingVertical: 12,
        },
        cardImage: {
            height: 240,
            borderRadius: 8,
        },
        login: {
            containerWidth: 340,
            containerHeight: 400,
            inputWidth: 300,
            buttonWidth: 140,
            logoSize: 100,
            borderRadius: 20,
            overlay: 'rgba(142,129,129,0.4)'
        },
        testButton: {
            width: 117,
            height: 40,
            borderWidth: 2.5
        },
        cafeDetail: {
            imageHeight: 200,
        },
    }
};

export default theme;