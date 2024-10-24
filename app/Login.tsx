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
  Modal,
} from "react-native";
import {
  auth,
  signInWithGoogle,
  resetPassword,
  signIn,
} from "../fireBase/FireBase"; // Adjust the import path accordingly
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google"; // Google sign-in functionality
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailForReset, setEmailForReset] = useState(""); // Email for password reset
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const router = useRouter();

  // Google authentication hook
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

  const handleLogin = async () => {
    setUsernameError("");
    setPasswordError("");

    if (username.trim() === "") {
      setUsernameError("Please enter your username.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    const result = await signIn(username, password);
    if (result.success) {
      Alert.alert("Success", result.message);

      // Save login details if "Remember Me" is checked
      if (rememberMe) {
        try {
          await AsyncStorage.setItem("username", username);
          await AsyncStorage.setItem("password", password); // Avoid saving passwords insecurely!
        } catch (e) {
          console.log("Failed to save credentials:", e);
        }
      }
      setUsername("");
      setPassword("");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleGoogleSignIn = async () => {
    await promptAsync();
  };

  const handleForgetPassword = () => {
    setModalVisible(true); // Show the modal
  };

  const handlePasswordReset = async () => {
    if (emailForReset.trim() === "") {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    const result = await resetPassword(emailForReset.trim());
    console.log("Reset Result:", result); // Log the reset result

    if (result.success) {
      Alert.alert("Success", result.message);
    } else {
      Alert.alert("Error", result.message);
    }

    setModalVisible(false); // Close the modal after submitting
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
          <Text style={styles.joinText}>Please sign in to your account</Text>

          <TextInput
            style={[styles.input, usernameError ? styles.inputError : null]}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          {usernameError && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}

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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
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

          {/* Custom Checkbox and Forget Password */}
          <View style={styles.rememberForgotRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checked]}>
                {rememberMe && <Text style={styles.checkboxCheckmark}>✔</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgetPassword}>
              <Text style={styles.forgetPasswordText}>Forget Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/SignUp")}>
            <Text style={styles.signupText}>
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal for Forget Password */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Forgot Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={emailForReset}
                onChangeText={setEmailForReset}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontFamily: "Inter-Regular",
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
  loginButton: {
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
  signupText: {
    color: "#0066FF",
    textAlign: "center",
    marginTop: 15,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },

  checkboxText: {
    fontSize: 14,
    color: "#000",
  },

  rememberForgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 40,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#5DA389",
  },
  checkboxCheckmark: {
    color: "#fff",
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
  },
  forgetPasswordText: {
    fontSize: 14,
    color: "#0066FF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#5DA389",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonCancel: {
    backgroundColor: "#FF5E5E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Login;
