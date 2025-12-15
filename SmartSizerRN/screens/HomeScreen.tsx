import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, colors } from '../theme/ThemeContext';
import { FileType } from '../types';
import { ThemeToggle } from '../components/ThemeToggle'; // We'll create this next

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];

    const handleSelect = (fileType: FileType) => {
        navigation.navigate('Processing', { fileType });
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentColors.background }]}>
            <ThemeToggle />
            <View style={styles.header}>
                <Text style={[styles.title, { color: currentColors.text }]}>SmartSizer</Text>
                <Text style={[styles.subtitle, { color: currentColors.secondary }]}>Choose what you want to optimize.</Text>
            </View>

            <View style={styles.cardsContainer}>
                <SelectionCard
                    icon="📷"
                    title="Resize Image"
                    onPress={() => handleSelect('image')}
                    theme={theme}
                    colors={currentColors}
                />
                <SelectionCard
                    icon="📄"
                    title="Compress PDF"
                    onPress={() => handleSelect('pdf')}
                    theme={theme}
                    colors={currentColors}
                />
            </View>

            <Text style={[styles.footer, { color: currentColors.secondary }]}>
                All processing done locally — no uploads required.
            </Text>
        </ScrollView>
    );
};

const SelectionCard: React.FC<{ icon: string; title: string; onPress: () => void; theme: string; colors: any }> = ({ icon, title, onPress, theme, colors }) => (
    <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 40,
    },
    card: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 150,
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    footer: {
        marginTop: 'auto',
        fontSize: 12,
        textAlign: 'center',
    }
});
