// ForgotPasswordScreen.tsx
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import api from '../../services/api';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.auth.forgotPassword.title,
      headerRight: () => <LanguageSwitcher />,
    });
  }, [navigation, t]);

  const handleSubmit = async () => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      Alert.alert(t.auth.forgotPassword.resetLinkSent, t.auth.forgotPassword.checkEmail);
    } catch (error) {
      Alert.alert(t.auth.forgotPassword.error, t.auth.forgotPassword.tryAgain);
    }
  };



  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t.auth.forgotPassword.emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => Alert.alert(t.auth.forgotPassword.infoTitle, t.auth.forgotPassword.infoMessage)}>
            <MaterialCommunityIcons name="information-outline" size={24} color="#888" style={styles.infoIcon} />
          </TouchableOpacity>
        </View>

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
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  infoIcon: {
    marginLeft: 10,
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
