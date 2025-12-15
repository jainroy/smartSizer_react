import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, colors } from '../theme/ThemeContext';

type SplashScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { theme } = useTheme();
    const currentColors = colors[theme];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 1500);

        return () => clearTimeout(timer);
    }, [fadeAnim, navigation]);

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Text style={[styles.title, { color: currentColors.primary }]}>SmartSizer</Text>
                <Text style={[styles.subtitle, { color: currentColors.secondary }]}>Resize Images & PDFs Instantly.</Text>

                <View style={styles.loadingBarContainer}>
                    <View style={[styles.loadingBarFill, { backgroundColor: currentColors.primary }]} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
    },
    loadingBarContainer: {
        marginTop: 30,
        height: 8,
        width: 200,
        backgroundColor: '#E3F2FD',
        borderRadius: 4,
        overflow: 'hidden',
    },
    loadingBarFill: {
        height: '100%',
        width: '50%',
    }
});
