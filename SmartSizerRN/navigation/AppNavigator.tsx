import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { useTheme, colors } from '../theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { FileType, ProcessResult } from '../types';

export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Processing: { fileType: FileType };
    Result: { result: ProcessResult; originalSize: number; fileType: FileType };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const { theme } = useTheme();
    const currentColors = colors[theme];

    return (
        <NavigationContainer>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={currentColors.background} />
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: currentColors.background,
                    },
                    headerTintColor: currentColors.text,
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: currentColors.background },
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Processing"
                    component={ProcessingScreen}
                    options={({ route }) => ({
                        title: route.params.fileType === 'image' ? 'Resize Image' : 'Compress PDF'
                    })}
                />
                <Stack.Screen
                    name="Result"
                    component={ResultScreen}
                    options={{ title: 'Result', headerLeft: () => null, gestureEnabled: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
