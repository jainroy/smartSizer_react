import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FileType } from '../types';
import { useTheme, colors } from '../theme/ThemeContext';

interface FileUploaderProps {
    onFileSelect: (uri: string, name: string) => void;
    fileType: FileType;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, fileType }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            onFileSelect(asset.uri, asset.fileName || 'image.jpg');
        }
    };

    const pickPdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (result.canceled === false) {
                onFileSelect(result.assets[0].uri, result.assets[0].name);
            }
        } catch (err) {
            Alert.alert("Error", "Failed to pick document");
        }
    };

    const handlePress = () => {
        if (fileType === 'image') pickImage();
        else pickPdf();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.dashedBox, { borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb', backgroundColor: currentColors.card }]}>
                <Text style={styles.icon}>
                    {fileType === 'image' ? '📷' : '📄'}
                </Text>
                <Text style={[styles.text, { color: currentColors.text }]}>
                    Tap to select {fileType === 'image' ? 'an image' : 'a PDF'}
                </Text>
                <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.primary }]} onPress={handlePress}>
                    <Text style={styles.buttonText}>Select File</Text>
                </TouchableOpacity>
                <Text style={[styles.subText, { color: currentColors.secondary }]}>
                    {fileType === 'image' ? 'JPG, PNG, WEBP' : 'PDF'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    dashedBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
    },
    icon: {
        fontSize: 40,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subText: {
        marginTop: 12,
        fontSize: 12,
    }
});
