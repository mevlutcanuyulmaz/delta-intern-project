import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Çıkış</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchSelf = async () => {
      try {
        const response = await api.get('/api/user/get-self');
        setUser(response.data);
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı');
      }
    };

    fetchSelf();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
         {user?.name} {user?.surname} Admin Paneline Hoş Geldin
      </Text>

      {user && (
        <>
          <Text style={styles.info}>E-posta: {user.email}</Text>
          <Text style={styles.info}>Rol: {user.role?.name}</Text>
        </>
      )}
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    marginTop: 8,
    fontSize: 16,
  },
});
