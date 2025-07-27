import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const ManagerDashboard = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/user/get-self');
        setUserInfo(res.data);
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
      <Text style={styles.info}>Şirket: {userInfo?.company?.name}</Text>
    </View>
  );
};

export default ManagerDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  info: { fontSize: 18, marginBottom: 8 },
});
