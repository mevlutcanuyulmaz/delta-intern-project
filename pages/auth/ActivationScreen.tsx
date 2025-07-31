import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import api from '../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivationScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const route = useRoute<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.auth.activation.title,
      headerRight: () => <LanguageSwitcher />,
    });
  }, [navigation, t]);

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
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t.auth.activation.emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => Alert.alert(t.auth.activation.infoTitle, t.auth.activation.infoMessage)} style={styles.infoIcon}>
            <MaterialCommunityIcons name="information-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleResendActivation}>
          <Text style={styles.buttonText}>{t.auth.activation.sendButton}</Text>
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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  infoIcon: {
    paddingHorizontal: 10,
  },
  passwordContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
