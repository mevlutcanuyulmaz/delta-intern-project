import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button,Alert } from 'react-native';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: {
    name: 'ADMIN' | 'MANAGER' | 'USER';
  };
  departmentName: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/user/get-users-of-detailed');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar alınamadı', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
  Alert.alert(
    'Kullanıcıyı Sil',
    'Bu kullanıcıyı silmek istediğinizden emin misiniz?',
    [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/user/delete-user/${id}`);
            Alert.alert('Başarılı', 'Kullanıcı silindi');
            fetchUsers(); // listeyi güncelle
          } catch (error) {
            Alert.alert('Hata', 'Kullanıcı silinemedi');
          }
        },
      },
    ]
  );
};

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    return unsubscribe;
  }, [navigation]);

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name} {item.surname}</Text>
      <Text>{item.email}</Text>
      <Text>{item.role?.name}</Text>
      <Text>{item.departmentName}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4b5c75', marginRight: 8 }]}
          onPress={() => navigation.navigate('UserForm', { userId: item.id })}
        >
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

  return (
    <View style={styles.container}>
      <Button
        title="Yeni Kullanıcı Ekle"
        onPress={() => navigation.navigate('UserForm')}
        color="#4b5c75"
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    marginTop: 12,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
  padding: 8,
  borderRadius: 6,
  alignItems: 'center',
  marginRight: 8, // sadece "Düzenle" butonuna uygula
  },
  buttonText: {
    color: '#fff',
  },
  buttonRow: {
  flexDirection: 'row',
  gap: 8, // Eğer desteklemiyorsa yerine marginRight kullan
  marginTop: 8,
},
});
