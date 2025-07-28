// ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import api from '../../services/api';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      Alert.alert(t.auth.forgotPassword.resetLinkSent, t.auth.forgotPassword.checkEmail);
    } catch (error) {
      Alert.alert(t.auth.forgotPassword.error, t.auth.forgotPassword.tryAgain);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <LanguageSwitcher />
      </View>
      
      <View style={styles.container}>
        <Text style={styles.title}>{t.auth.forgotPassword.title}</Text>
        
        <TextInput
          placeholder={t.auth.forgotPassword.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t.auth.forgotPassword.sendButton}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>{t.auth.forgotPassword.backToLogin}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    paddingBottom: 20,
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
    fontWeight: '700',
    color: '#333',
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
