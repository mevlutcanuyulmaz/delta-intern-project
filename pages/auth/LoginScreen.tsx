// src/screens/LoginScreen.tsx
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const clearTokens = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  };

  clearTokens();
}, []);
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { accessToken } = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);

      const userResponse = await api.get('/api/user/get-self');
      const role = userResponse.data?.role?.name;

      if (role === 'ADMIN') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      } else if (role === 'MANAGER') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ManagerBottomTabs' }],
        });
      } else if (role === 'USER') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserBottomTabs' }],
        });
      } else {
        Alert.alert(t.auth.login.authError, t.auth.login.roleNotDefined);
      }
    } catch (error) {
      Alert.alert(t.auth.login.loginError, t.auth.login.checkCredentials);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleActivation = () => {
    navigation.navigate('Activation');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <LanguageSwitcher />
      </View>
      
      <View style={styles.container}>
        <TextInput
          placeholder={t.auth.login.email}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder={t.auth.login.password}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t.auth.login.loginButton}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.linkText}>
          {t.auth.login.forgotPassword}{' '}
          <Text style={styles.link} onPress={handleForgotPassword}>
            {t.auth.login.resetPassword}
          </Text>
        </Text>
        <Text style={styles.linkText}>
          {t.auth.login.activateAccount}{' '}
          <Text style={styles.link} onPress={handleActivation}>
            {t.auth.login.activate}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

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
  passwordContainer: {
    width: '100%',
    height: 50,
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
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
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
  linkText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#4b5c75',
    fontWeight: '600',
  },
});
