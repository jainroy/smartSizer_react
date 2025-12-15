import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FileUploader } from '../components/FileUploader';
import { OptionsPanel } from '../components/OptionsPanel';
import { useTheme, colors } from '../theme/ThemeContext';
import { ProcessOptions } from '../types';
import { resizeImage } from '../utils/imageUtils.native';
import { compressPdf } from '../utils/pdfUtils.native';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export const ProcessingScreen: React.FC<Props> = ({ route, navigation }) => {
    const { fileType } = route.params;
    const { theme } = useTheme();
    const currentColors = colors[theme];

    const [file, setFile] = useState<{ uri: string; name: string; size: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<string | null>(null);

    const handleFileSelect = async (uri: string, name: string) => {
        try {
            const info = await FileSystem.getInfoAsync(uri);
            const size = info.exists ? info.size : 0;
            setFile({ uri, name, size });
        } catch (e) {
            console.warn("Error getting file info", e);
            setFile({ uri, name, size: 0 });
        }
    };

    const handleProcess = async (options: ProcessOptions) => {
        if (!file) return;
        setIsProcessing(true);
        try {
            if (fileType === 'image') {
                const result = await resizeImage(file.uri, options);
                navigation.navigate('Result', { result, originalSize: file.size, fileType });
            } else {
                const result = await compressPdf(file.uri, options, setProgress);
                navigation.navigate('Result', { result, originalSize: file.size, fileType });
            }
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setIsProcessing(false);
            setProgress(null);
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentColors.background }]}>
            {!file ? (
                <FileUploader onFileSelect={handleFileSelect} fileType={fileType} />
            ) : (
                <View style={styles.content}>
                    <View style={styles.preview}>
                        {fileType === 'image' && <Image source={{ uri: file.uri }} style={styles.thumb} resizeMode="contain" />}
                        <Text style={[styles.fileName, { color: currentColors.text }]}>{file.name}</Text>
                        <Text style={[styles.fileSize, { color: currentColors.secondary }]}>{(file.size / 1024).toFixed(1)} KB</Text>
                        <Text style={styles.changeLink} onPress={() => setFile(null)}>Change File</Text>
                    </View>

                    <OptionsPanel isImage={fileType === 'image'} onProcess={handleProcess} isProcessing={isProcessing} />

                    {progress && <Text style={[styles.progress, { color: currentColors.primary }]}>{progress}</Text>}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    content: {
        width: '100%',
    },
    preview: {
        alignItems: 'center',
        marginBottom: 20,
    },
    thumb: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#eee',
    },
    fileName: {
        fontWeight: '600',
        marginBottom: 2,
    },
    fileSize: {
        fontSize: 12,
        marginBottom: 8,
    },
    changeLink: {
        color: '#1976D2',
        fontSize: 14,
    },
    progress: {
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '600',
    }
});
