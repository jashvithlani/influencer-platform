import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { tokens, borderRadius, fontSize, spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={tokens.color.inputPlaceholder}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: tokens.font.family.semibold,
    fontSize: fontSize.sm,
    color: tokens.color.inputLabel,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: tokens.font.family.regular,
    backgroundColor: tokens.color.inputBg,
    borderWidth: 1,
    borderColor: tokens.color.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: fontSize.md,
    color: tokens.color.inputText,
  },
  inputError: {
    borderColor: tokens.color.inputError,
  },
  error: {
    fontSize: fontSize.xs,
    color: tokens.color.inputError,
    marginTop: spacing.xs,
  },
});
