import { useState } from "react";
// 1. Adicione ScrollView nas importações
import { View, StyleSheet, Pressable, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserProfile } from "@/models/models";
import { Shadow } from 'react-native-shadow-2';

export default function ProfileSetup() {
    const [step, setStep] = useState(1);
    const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});

    const MALE_GLOW = 'rgba(0, 136, 255, 0.2)';
    const FEMALE_GLOW = 'rgba(255, 141, 161, 0.2)';
    const INACTIVE_SHADOW = '#2A2A2A';

    const TOTAL_STEPS = 4;

    const isStepValid = () => {
        if (step === 1) return !!userProfile.gender;
        if (step === 2) return !!userProfile.age;
        return false;
    };

    const ISVALID = isStepValid();

    return (
        <>
            <View style={[styles.progressBar, { width: `${(step / TOTAL_STEPS) * 100}%` }]}></View>
            <View
                style={styles.container}
            >

                <View style={styles.content}>
                    {step === 1 && (
                        <>
                            <MaterialCommunityIcons name="gender-male-female" size={60} color="#FFD700" style={styles.icon} />
                            <Text style={styles.textTitle}>Qual seu genero?</Text>
                            <Text style={styles.textInformative}>Importante para entendermos seu metabolismo</Text>

                            <View style={styles.genderOptions}>
                                <Shadow startColor={userProfile.gender === "male" ? MALE_GLOW : INACTIVE_SHADOW} distance={12} stretch={true} style={{ borderRadius: 10, width: "100%" }}>
                                    <Pressable style={[styles.genderOption, userProfile.gender === "male" ? { borderColor: "#0088ff" } : {}]} onPress={() => setUserProfile(prev => ({ ...prev, gender: "male" }))}>
                                        <MaterialCommunityIcons name="gender-male" size={60} style={[styles.iconOptions, userProfile.gender === "male" ? { color: "#0088ff" } : {}]} />
                                        <Text style={[styles.textOptions, userProfile.gender === "male" ? { color: "#0088ff" } : {}]}>Masculino</Text>
                                    </Pressable>
                                </Shadow>

                                <Shadow startColor={userProfile.gender === "female" ? FEMALE_GLOW : INACTIVE_SHADOW} distance={12} stretch={true} style={{ borderRadius: 10, width: "100%" }}>
                                    <Pressable style={[styles.genderOption, userProfile.gender === "female" ? { borderColor: "#ff8da1" } : {}]} onPress={() => setUserProfile(prev => ({ ...prev, gender: "female" }))}>
                                        <MaterialCommunityIcons name="gender-female" size={60} style={[styles.iconOptions, userProfile.gender === "female" ? { color: "#ff8da1" } : {}]} />
                                        <Text style={[styles.textOptions, userProfile.gender === "female" ? { color: "#ff8da1" } : {}]}>Feminino</Text>
                                    </Pressable>
                                </Shadow>
                            </View>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <MaterialCommunityIcons name="calendar" size={60} color="#FFD700" style={styles.icon} />
                            <Text style={styles.textTitle}>Qual sua idade?</Text>
                            <Text style={styles.textInformative}>Para calcularmos suas necessidades calóricas diárias</Text>

                            <View style={styles.centerContainer}>
                                <TextInput
                                    style={styles.textInputOption}
                                    placeholder="00"
                                    placeholderTextColor="#555"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    value={userProfile.age?.toString()}
                                    onChangeText={(t) => setUserProfile(prev => ({ ...prev, age: Number(t) }))}
                                />
                                <Text style={styles.textLabelFloating}>anos</Text>
                            </View>
                        </>
                    )}
                </View>

                <Pressable
                    disabled={!ISVALID}
                    style={({ pressed }) => [
                        styles.continueButton,
                        (pressed && ISVALID) && styles.continueButtonPressed,
                        !ISVALID && { backgroundColor: "#333" }
                    ]}
                    onPress={() => setStep(prev => Math.min(prev + 1, TOTAL_STEPS))}
                >
                    <Text style={[
                        styles.textContinueButton,
                        !ISVALID && { color: "#666" }
                    ]}>
                        {step === TOTAL_STEPS ? "FINALIZAR" : "CONTINUAR"}
                    </Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    content: {
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2A2A2A",
        padding: 20,
        margin: 20,
        marginBottom: 20,
        borderRadius: 15,
    },
    icon: {
        marginBottom: 10,
    },
    textTitle: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#FFFFFF",
    },
    textInformative: {
        fontSize: 14,
        color: "#E0E0E0",
        marginTop: 10,
        textAlign: "center",
    },
    genderOptions: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 50,
        marginBottom: 30,
    },
    iconOptions: {
        marginBottom: 10,
        color: "#555"
    },
    textOptions: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#555"
    },
    genderOption: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#444',
        width: 140
    },
    centerContainer: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    textInputOption: {
        borderWidth: 3,
        borderColor: "#FFD700",
        width: 100,
        height: 60,
        borderRadius: 15,
        padding: 10,
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: '#3A3A3A'
    },
    textLabelFloating: {
        position: 'absolute',
        left: '35%',
        color: "#888",
        fontSize: 20,
        fontWeight: "bold",
        width: 100,
    },
    progressBar: {
        height: 7,
        backgroundColor: "#FFD700",
        borderRadius: 5,
    },
    continueButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFD700",
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        marginHorizontal: 20,
    },
    continueButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    textContinueButton: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#121212",
    }
})