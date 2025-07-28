import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import api from '../../services/api';

const ActivationScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const route = useRoute<any>();
  

  // token varsa linkten al
  useEffect(() => {
    const urlToken = route?.params?.token;
    if (urlToken) {
      setToken(urlToken);
    }
  }, [route?.params]);

  const handleResendActivation = async () => {
    try {
      await api.post('/api/auth/resend-activation', { email });
      Alert.alert(t.auth.activation.activationSuccess, t.auth.activation.accountActivated);
    } catch (err) {
      Alert.alert(t.auth.activation.activationError, t.common.error);
    }
  };

  const handleActivate = async () => {
    if (!token) {
      Alert.alert(t.auth.activation.activationError, t.auth.activation.invalidCode);
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t.auth.activation.activationError, 'Passwords do not match.');
      return;
    }

    try {
      await api.post('/api/auth/activate-with-password', {
        token,
        newPassword,
        confirmPassword,
      });
      Alert.alert(t.auth.activation.activationSuccess, t.auth.activation.accountActivated, [
        {
          text: t.common.confirm,
          onPress: () => navigation.replace('Login')
        }
      ]);
    } catch (err) {
      Alert.alert(t.auth.activation.activationError, t.auth.activation.invalidCode);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.wrapper}>
      <LanguageSwitcher />
      
      <View style={styles.container}>
        <Text style={styles.title}>{t.auth.activation.title}</Text>
        
        <TextInput
          placeholder={t.auth.activation.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleResendActivation}>
          <Text style={styles.buttonText}>{t.auth.activation.sendButton}</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>{t.auth.activation.orText}</Text>

        <TextInput
          placeholder={t.auth.activation.tokenPlaceholder}
          value={token}
          onChangeText={setToken}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleActivate}>
          <Text style={styles.buttonText}>{t.auth.activation.activateButton}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>{t.auth.activation.backToLogin}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivationScreen;

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
    marginBottom: 15,
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
  orText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#4b5c75',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});
