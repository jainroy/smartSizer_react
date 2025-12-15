import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme, colors } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC<Props> = ({ route, navigation }) => {
    const { result, originalSize, fileType } = route.params;
    const { theme } = useTheme();
    const currentColors = colors[theme];

    const resultSize = result.size || 0;
    const reduction = originalSize > 0 ? ((originalSize - resultSize) / originalSize * 100) : 0;

    const handleShare = async () => {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(result.uri);
        } else {
            Alert.alert("Error", "Sharing not available");
        }
    };

    const handleCopy = async () => {
        try {
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            await Clipboard.setImageAsync(base64);
            Alert.alert("Success", "Copied to clipboard!");
        } catch (e) {
            Alert.alert("Error", "Failed to copy image.");
        }
    };

    const handleStartOver = () => {
        navigation.popToTop();
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentColors.background }]}>
            <View style={[styles.card, { backgroundColor: currentColors.card, borderColor: theme === 'dark' ? '#064e3b' : '#c6f6d5', borderWidth: 1 }]}>
                <Text style={[styles.title, { color: theme === 'dark' ? '#a7f3d0' : '#276749' }]}>Your file is ready! 🎉</Text>

                <View style={[styles.previewBox, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
                    {fileType === 'image' ? (
                        <Image source={{ uri: result.uri }} style={styles.image} resizeMode="contain" />
                    ) : (
                        <Text style={{ fontSize: 50 }}>📄</Text>
                    )}
                </View>

                <View style={styles.stats}>
                    <Text style={[styles.statText, { color: currentColors.text }]}>{formatSize(originalSize)}</Text>
                    <Text style={{ fontSize: 20 }}>➡️</Text>
                    <Text style={[styles.statText, { color: theme === 'dark' ? '#48bb78' : 'green', fontWeight: 'bold' }]}>{formatSize(resultSize)}</Text>
                </View>

                <Text style={[styles.reduction, { color: theme === 'dark' ? '#48bb78' : '#2f855a' }]}>
                    {reduction > 0 ? `Reduced by ${Math.round(reduction)}%` : 'Size unchanged / Optimized'}
                </Text>

                {result.warning && (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>{result.warning}</Text>
                    </View>
                )}

                <TouchableOpacity style={[styles.btn, { backgroundColor: currentColors.primary }]} onPress={handleShare}>
                    <Text style={styles.btnText}>Share / Save</Text>
                </TouchableOpacity>

                {fileType === 'image' && (
                    <TouchableOpacity style={[styles.btn, { backgroundColor: currentColors.secondary }]} onPress={handleCopy}>
                        <Text style={styles.btnText}>Copy Image</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.textBtn} onPress={handleStartOver}>
                    <Text style={{ color: currentColors.primary, fontSize: 16 }}>Start Over</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    previewBox: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    statText: {
        fontSize: 16,
    },
    reduction: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    warningBox: {
        backgroundColor: '#fffaf0',
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#fbd38d',
        marginBottom: 15,
        width: '100%',
    },
    warningText: {
        color: '#c05621',
        fontSize: 12,
        textAlign: 'center',
    },
    btn: {
        width: '100%',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textBtn: {
        padding: 10,
        marginTop: 5,
    }
});
