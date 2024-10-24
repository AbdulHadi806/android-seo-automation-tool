// app/components/TextInputField.tsx
import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

interface TextInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
}) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#31723417",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
  },
});

export default TextInputField;
