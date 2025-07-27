import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

const ManagerDashboard = () => {
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/user/get-self');
        setUserInfo(res.data);
        console.log("Kullanıcı bilgisi:", res.data);
      } catch (err) {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoş geldin, {userInfo?.name}</Text>
      <Text style={styles.info}>Rol: {userInfo?.role?.name}</Text>
      <Text style={styles.info}>Departman: {userInfo?.departmentName}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ManagerUserList')}
        >
          <Text style={styles.buttonText}>Kullanıcı Listesi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2ecc71' }]}
          onPress={() => navigation.navigate('ManagerProfile')}
        >
          <Text style={styles.buttonText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  info: { fontSize: 18, marginBottom: 8 },
  button: {
    backgroundColor: '#4b5c75',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
});

export default ManagerDashboard;
