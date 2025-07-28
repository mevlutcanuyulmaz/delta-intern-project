// src/screens/LoginScreen.tsx
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import ForgotPasswordScreen from './ForgotPasswordScreen';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
  const clearTokens = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    console.log('📦 Tokenlar silindi!');
  };

  clearTokens();
}, []);
  const handleLogin = async () => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });

    console.log("Gelen login cevabı:", response.data);
    const { accessToken } = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);

    // Biraz bekle
    await new Promise((resolve) => setTimeout(resolve, 100));

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
      Alert.alert('Yetki Hatası', 'Yetkiniz tanımlı değil.');
    }
  } catch (error) {
    Alert.alert('Giriş başarısız', 'Lütfen bilgilerinizi kontrol edin.');
  }
};

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleActivation = () => {
    navigation.navigate('Activation');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-Posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        Şifremi unuttum,{' '}
        <Text style={styles.link} onPress={handleForgotPassword}>
          Şifre sıfırla
        </Text>
      </Text>
      <Text style={styles.linkText}>
        Hesabını aktive etmek için,{' '}
        <Text style={styles.link} onPress={handleActivation}>
          Aktive et
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#4b5c75',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  linkText: {
    textAlign: 'center',
    color: '#444',
    marginTop: 8,
  },
  link: {
    color: '#3f51b5',
    fontWeight: 'bold',
  },
});
