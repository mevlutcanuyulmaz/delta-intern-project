import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';

type UserListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: {
    id: number;
    name: 'ADMIN' | 'MANAGER' | 'USER';
  };
  departmentName: string;
  departmentId: number;
  companyName: string;
}

const UserList = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<UserListNavigationProp>();

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LanguageSwitcher />
          <TouchableOpacity 
            onPress={handleLogout} 
            style={{ marginLeft: 16, marginRight: 16 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/user/get-users-of-detailed');
      setUsers(response.data);
    } catch (error) {
      console.error(t.adminUserList.usersLoadError, error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
  Alert.alert(
    t.adminUserList.deleteUser,
    t.adminUserList.deleteConfirmation,
    [
      { text: t.adminUserList.cancel, style: 'cancel' },
      {
        text: t.adminUserList.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/user/delete-user/${id}`);
            Alert.alert(t.common.success, t.adminUserList.deleteSuccess);
            fetchUsers(); // listeyi güncelle
          } catch (error) {
            Alert.alert(t.common.error, t.adminUserList.deleteError);
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
      <Text style={styles.email}>{t.adminUserList.email}: {item.email}</Text>
      <Text style={styles.role}>{t.adminUserList.role}: {item.role?.name}</Text>
      <Text style={styles.department}>{t.adminUserList.department}: {item.departmentName}</Text>
      <Text style={styles.company}>{t.adminUserList.company}: {item.companyName}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4b5c75', marginRight: 8 }]}
          onPress={() => navigation.navigate('UserForm', { userId: item.id })}
        >
          <Text style={styles.buttonText}>{t.adminUserList.edit}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.buttonText}>{t.adminUserList.delete}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
      />
      
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('UserForm')}
      >
        <Text style={styles.createButtonText}>{t.adminUserList.addNewUser}</Text>
      </TouchableOpacity>
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
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#4b5c75',
    fontWeight: '600',
    marginBottom: 2,
  },
  department: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
    marginBottom: 8,
  },
  button: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#4b5c75',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
