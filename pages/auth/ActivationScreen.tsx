import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../../services/api';
import { useLinkTo, useRoute, useNavigation } from '@react-navigation/native';

const ActivationScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
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
      Alert.alert('Başarılı', 'Aktivasyon maili gönderildi.');
    } catch (err) {
      Alert.alert('Hata', 'Gönderilemedi.');
    }
  };

  const handleActivate = async () => {
    if (!token) {
      Alert.alert('Hata', 'Token bulunamadı.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor.');
      return;
    }

    try {
      await api.post('/api/auth/activate-with-password', {
        token,
        newPassword,
        confirmPassword,
      });
      Alert.alert('Başarılı', 'Hesap aktif edildi.', [
        {
          text: 'Tamam',
          onPress: () => navigation.replace('Login')
        }
      ]);
    } catch (err) {
      Alert.alert('Hata', 'Aktivasyon başarısız.');
    }
  };

  return (
    <View style={styles.container}>
      {!token ? (
        <>
          <Text style={styles.label}>E-posta adresinizi girin</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
          />
          <Button title="Aktivasyon Maili Gönder" onPress={handleResendActivation} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Hesabı Aktive Et" onPress={handleActivate} />
        </>
      )}
    </View>
  );
};

export default ActivationScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, borderRadius: 6 },
});
