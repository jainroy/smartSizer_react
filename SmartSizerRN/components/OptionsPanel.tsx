import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ProcessOptions } from '../types';
import { useTheme, colors } from '../theme/ThemeContext';

interface OptionsPanelProps {
    isImage: boolean;
    onProcess: (options: ProcessOptions) => void;
    isProcessing: boolean;
}

const InputField: React.FC<{ label: string; value: string; onChange: (text: string) => void; placeholder: string; unit: string; theme: string; colors: any }> = ({ label, value, onChange, placeholder, unit, theme, colors }) => (
    <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: theme === 'dark' ? '#374151' : '#fff' }]}>
            <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                keyboardType="numeric"
                placeholderTextColor={colors.secondary}
            />
            <Text style={[styles.unit, { color: colors.secondary }]}>{unit}</Text>
        </View>
    </View>
);

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ isImage, onProcess, isProcessing }) => {
    const { theme } = useTheme();
    const currentColors = colors[theme];

    const [targetWidth, setTargetWidth] = useState('');
    const [targetHeight, setTargetHeight] = useState('');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [targetSizeKB, setTargetSizeKB] = useState('');

    const handleProcess = () => {
        onProcess({
            targetWidth: targetWidth ? parseInt(targetWidth) : undefined,
            targetHeight: targetHeight ? parseInt(targetHeight) : undefined,
            maintainAspectRatio,
            targetSizeKB: targetSizeKB ? parseInt(targetSizeKB) : undefined,
        });
    };

    return (
        <View style={styles.container}>
            <View style={[styles.section, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Target Resolution</Text>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <InputField label="Width" value={targetWidth} onChange={setTargetWidth} placeholder="e.g. 1920" unit="px" theme={theme} colors={currentColors} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <InputField label="Height" value={targetHeight} onChange={setTargetHeight} placeholder="e.g. 1080" unit="px" theme={theme} colors={currentColors} />
                    </View>
                </View>

                {isImage && (
                    <View style={styles.switchRow}>
                        <Switch
                            value={maintainAspectRatio}
                            onValueChange={setMaintainAspectRatio}
                            thumbColor={maintainAspectRatio ? currentColors.primary : "#f4f3f4"}
                            trackColor={{ false: "#767577", true: theme === 'dark' ? '#4b5563' : '#e5e7eb' }}
                        />
                        <Text style={[styles.switchLabel, { color: currentColors.text }]}>Maintain Aspect Ratio</Text>
                    </View>
                )}
            </View>

            <View style={styles.divider}>
                <Text style={[styles.dividerText, { color: currentColors.secondary }]}>OR</Text>
            </View>

            <View style={[styles.section, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Target File Size (KB)</Text>
                <InputField label="File Size" value={targetSizeKB} onChange={setTargetSizeKB} placeholder="e.g. 500" unit="KB" theme={theme} colors={currentColors} />
            </View>

            <TouchableOpacity
                style={[styles.processButton, { backgroundColor: isProcessing ? currentColors.secondary : currentColors.primary }]}
                onPress={handleProcess}
                disabled={isProcessing}
            >
                {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.processButtonText}>Process File</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    section: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
    },
    unit: {
        fontSize: 12,
        marginLeft: 5,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    switchLabel: {
        marginLeft: 10,
        fontSize: 14,
    },
    divider: {
        alignItems: 'center',
        marginVertical: 10,
    },
    dividerText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    processButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    processButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
