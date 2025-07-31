import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ManagerUserListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  const { t } = useLanguage();
  const navigation = useNavigation<ManagerUserListNavigationProp>();
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [managerDepartment, setManagerDepartment] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

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
        Alert.alert(t.common.error, t.managerUserList.usersLoadError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number, userName: string) => {
    Alert.alert(
      t.managerUserList.deleteUser,
      `${userName} ${t.managerUserList.deleteConfirmation}`,
      [
        { text: t.managerUserList.cancel, style: 'cancel' },
        {
          text: t.managerUserList.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/user/delete-user/${userId}`);
              // Başarılı silme işleminden sonra listeyi güncelle
              setUsers(users.filter(user => user.id !== userId));
              Alert.alert(t.common.success, t.managerUserList.deleteSuccess);
            } catch (err) {
              Alert.alert(t.common.error, t.managerUserList.deleteError);
            }
          }
        }
      ]
    );
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>{t.managerUserList.loading}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t.managerUserList.department}: {managerDepartment}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name} {item.surname}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.info}>{t.managerUserList.role}: {item.role.name}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteUser(item.id, `${item.name} ${item.surname}`)}
            >
              <Text style={styles.deleteButtonText}>{t.managerUserList.delete}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>{t.managerUserList.emptyList}</Text>
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
