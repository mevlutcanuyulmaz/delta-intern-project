import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';

interface UserDetail {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: {
    id: number;
    name: 'ADMIN' | 'MANAGER' | 'USER';
  };
  departmentName: string;
}

const ManagerUserList = () => {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [managerDepartment, setManagerDepartment] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Önce yöneticinin kendi bilgilerini al
        const selfResponse = await api.get('/api/user/get-self');
        const managerInfo = selfResponse.data;
        setManagerDepartment(managerInfo.departmentName);

        // Sonra tüm kullanıcıları getir
        const usersResponse = await api.get('/api/user/get-users-of-detailed');
        
        // Sadece aynı departmandaki ve admin olmayan kullanıcıları filtrele
        const filteredUsers = usersResponse.data.filter((user: UserDetail) => 
          user.departmentName === managerInfo.departmentName && 
          user.role.name !== 'ADMIN'
        );
        
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Kullanıcılar getirilemedi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number, userName: string) => {
    Alert.alert(
      'Kullanıcı Silme',
      `${userName} kullanıcısını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/user/delete-user/${userId}`);
              // Başarılı silme işleminden sonra listeyi güncelle
              setUsers(users.filter(user => user.id !== userId));
              Alert.alert('Başarılı', 'Kullanıcı başarıyla silindi.');
            } catch (err) {
              console.error('Silme hatası:', err);
              Alert.alert('Hata', 'Kullanıcı silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Departman: {managerDepartment}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name} {item.surname}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.info}>Rol: {item.role.name}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteUser(item.id, `${item.name} ${item.surname}`)}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Bu departmanda henüz kullanıcı bulunmuyor.</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  header: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 4,
  },
  info: { 
    fontSize: 14, 
    color: '#444',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
});

export default ManagerUserList;
