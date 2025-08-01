import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import api from '../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivationScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const route = useRoute<any>();
  const token = route.params?.token;

  // Deep link'ten gelen token'ı kontrol et
  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        console.log('Activation token received:', token);
        setShowPasswordFields(true); // Token geldiğinde şifre alanlarını göster
      }
    }, [token])
  );

  const handleActivateWithPassword = async () => {
    if (!token) {
      Alert.alert(t.common.error, 'Token bulunamadı');
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert(t.common.error, 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t.common.error, 'Şifreler eşleşmiyor');
      return;
    }

    try {
      console.log('Trying activation with password for token:', token);
      
      const response = await api.post('/api/auth/activate-with-password', {
        token: token,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });
      
      console.log('Activation with password successful');
      Alert.alert(t.auth.activation.activationSuccess, t.auth.activation.accountActivated, [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      console.error('Activation with password failed:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      Alert.alert(t.auth.activation.activationError, 
        err.response?.data?.message || 'Aktivasyon başarısız');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.auth.activation.title,
      headerRight: () => <LanguageSwitcher />,
    });
  }, [navigation, t]);

  const handleResendActivation = async () => {
    if (!email.trim()) {
      Alert.alert(t.common.error, t.auth.activation.emailRequired);
      return;
    }

    try {
      console.log('Trying resend activation for email:', email);
      
      const response = await api.post('/api/auth/resend-activation', { email });
      console.log('Resend successful with /api/auth/resend-activation');
      
      Alert.alert(t.auth.activation.activationSuccess, t.auth.activation.activationEmailSent);
    } catch (err: any) {
      console.error('Resend activation failed:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      Alert.alert(t.auth.activation.activationError, 
        err.response?.data?.message || t.common.error);
    }
  };



    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        
        {!showPasswordFields ? (
          <>
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
          </>
        ) : (
          // Şifre belirleme ekranı
          <>
            <Text style={styles.title}>{t.auth.activation.activateAccount}</Text>
            <Text style={styles.subtitle}>{t.auth.activation.setNewPassword}</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t.auth.activation.newPasswordPlaceholder}
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t.auth.activation.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleActivateWithPassword}>
              <Text style={styles.buttonText}>{t.auth.activation.activateButton}</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </ScrollView>
    </KeyboardAvoidingView>
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
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
