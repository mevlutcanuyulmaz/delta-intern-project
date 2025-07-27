// ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../../services/api';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      Alert.alert('Başarılı', 'E-posta gönderildi.');
    } catch (error) {
      Alert.alert('Hata', 'İşlem başarısız.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>E-posta adresinizi girin</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
      />
      <Button title="Gönder" onPress={handleSubmit} />
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, borderRadius: 6 },
});
