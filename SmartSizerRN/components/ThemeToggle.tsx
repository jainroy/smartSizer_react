import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme, colors } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const currentColors = colors[theme];

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[styles.container, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}
                onPress={toggleTheme}
            >
                <Text style={{ fontSize: 20 }}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    container: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
