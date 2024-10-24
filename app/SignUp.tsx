// app/SignUp.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { signUp, signInWithGoogle } from "../fireBase/FireBase"; // Adjust the import path accordingly
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google"; // Move this import here

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  // Move the hook inside the component
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "963156443293-l30sdcpb38t0p8ckb7ovqlaq7ji7j9o5.apps.googleusercontent.com",
    webClientId:
      "963156443293-pkjkugaripbbabr8qr00hbujmcce3n10.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      signInWithGoogle(id_token);
    }
  }, [response]);

  const handleSignUp = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const result = await signUp(email, password);
    if (result.success) {
      Alert.alert("Success", result.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleGoogleSignIn = async () => {
    await promptAsync();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/bg.jpg")}
            style={styles.image}
          />
          <Text style={styles.title}>CleverSEO</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            Welcome to <Text style={styles.cleverSCOText}>CleverSEO</Text>
          </Text>
          <Text style={styles.joinText}>
            Join today and start your journey!
          </Text>

          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.container1}>
            <View style={styles.line} />
            <Text style={styles.text}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
            <Image
              source={require("../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.buttonText1}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Login")}>
            <Text style={styles.loginText}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5EA388",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    height: 302,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    fontSize: 55,
    color: "#FFFFFF",
    fontFamily: "Inter-ExtraBold",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    width: "90%",
    padding: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginTop: -100,
  },
  welcomeText: {
    fontSize: 26,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Inter-Bold",
    marginTop: 20,
  },
  cleverSCOText: {
    color: "#5DA389",
  },
  joinText: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    marginTop: 15,
    backgroundColor: "#31723417",
  },
  inputError: {
    borderColor: "red",
  },
  signUpButton: {
    backgroundColor: "#5DA389",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    textAlign: "left",
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 28,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#142E15",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    color: "#142E15",
    fontFamily: "Inter-Regular",
  },
  googleImage: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  button: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  buttonText1: {
    flex: 1,
    color: "black",
    fontSize: 18,
    fontFamily: "Inter-Medium",
    textAlign: "center",
    marginRight: 15,
  },
  loginText: {
    color: "#0066FF",
    textAlign: "center",
    marginTop: 15,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
});

export default SignUp;
