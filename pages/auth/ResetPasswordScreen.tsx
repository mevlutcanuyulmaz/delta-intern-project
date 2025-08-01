// ResetPasswordScreen.tsx
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import api from '../../services/api';

const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const route = useRoute<any>();
  const token = route.params?.token;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.auth.resetPassword.title,
      headerRight: () => <LanguageSwitcher />,
    });
  }, [navigation, t]);

  // Deep link'ten gelen token'ı kontrol et
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        console.log('Reset password token received:', token);
      }
    }, [token])
  );

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert(t.common.error, t.auth.resetPassword.tokenRequired);
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert(t.common.error, 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t.common.error, t.auth.resetPassword.passwordMismatch);
      return;
    }

    try {
      console.log('Trying password reset for token:', token);
      await api.post('/api/auth/reset-password', {
        token,
        newPassword,
        confirmPassword
      });

      Alert.alert(
        t.auth.resetPassword.resetSuccess,
        t.auth.resetPassword.passwordReset,
        [
          {
            text: t.common.ok,
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.message || t.auth.resetPassword.resetError;
      Alert.alert(t.auth.resetPassword.resetError, errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>{t.auth.resetPassword.title}</Text>
          <Text style={styles.subtitle}>Yeni şifrenizi belirleyin</Text>

          <TextInput
            placeholder={t.auth.resetPassword.newPasswordPlaceholder}
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            placeholder={t.auth.resetPassword.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>{t.auth.resetPassword.resetButton}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>{t.auth.resetPassword.backToLogin}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b5c75',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4b5c75',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 16,
    color: '#4b5c75',
    fontWeight: '600',
    textAlign: 'center',
  },
});