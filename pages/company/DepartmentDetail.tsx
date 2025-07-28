import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import { DepartmentDetailData, UserInfo } from '../../types/types';

type DepartmentDetailRouteProp = RouteProp<{ params: { departmentId: number } }, 'params'>;

const DepartmentDetailPage = () => {
  const { params } = useRoute<DepartmentDetailRouteProp>();
  const departmentId = params.departmentId;
  
  const [department, setDepartment] = useState<DepartmentDetailData | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [manager, setManager] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDepartmentDetail = async () => {
    try {
      const response = await api.get(`/api/departments/${departmentId}`);
      setDepartment(response.data);
    } catch (error) {
      Alert.alert('Hata', 'Departman detayları alınamadı');
    }
  };

  const fetchDepartmentUsers = async () => {
    try {
      const response = await api.get('/api/users');
      const departmentUsers = response.data.filter((user: UserInfo) => 
        user.department?.id === departmentId
      );
      
      // Yöneticiyi ve diğer kullanıcıları ayır
      const managerUser = departmentUsers.find((user: UserInfo) => 
        user.role?.name === 'MANAGER'
      );
      const regularUsers = departmentUsers.filter((user: UserInfo) => 
        user.role?.name !== 'MANAGER'
      );
      
      setManager(managerUser || null);
      setUsers(regularUsers);
    } catch (error) {
      Alert.alert('Hata', 'Departman kullanıcıları alınamadı');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDepartmentDetail(),
        fetchDepartmentUsers()
      ]);
      setLoading(false);
    };
    
    fetchData();
  }, [departmentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>Departman bilgileri yükleniyor...</Text>
      </View>
    );
  }

  if (!department) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Departman bulunamadı</Text>
      </View>
    );
  }

  const renderUserItem = ({ item }: { item: UserInfo }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name} {item.surname}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>{item.role?.name}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Departman Başlık */}
      <View style={styles.header}>
        <Text style={styles.departmentName}>{department.name}</Text>
        <Text style={styles.companyName}>{department.company.name}</Text>
      </View>

      {/* Departman Bilgileri */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="information-outline" size={20} color="#333" />
          <Text style={styles.sectionTitle}>Departman Bilgileri</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Departman Türü:</Text>
            <Text style={styles.infoValue}>{department.departmentType.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Şehir/Bölge:</Text>
            <Text style={styles.infoValue}>{department.town.city} / {department.town.region}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>İlçe:</Text>
            <Text style={styles.infoValue}>{department.town.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Adres:</Text>
            <Text style={styles.infoValue}>{department.addressDetail}</Text>
          </View>
        </View>
      </View>

      {/* Departman Yöneticisi */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="account-tie" size={20} color="#333" />
          <Text style={styles.sectionTitle}>Departman Yöneticisi</Text>
        </View>
        {manager ? (
          <View style={styles.managerCard}>
            <Text style={styles.managerName}>{manager.name} {manager.surname}</Text>
            <Text style={styles.managerEmail}>{manager.email}</Text>
            <Text style={styles.managerRole}>{manager.role?.name}</Text>
          </View>
        ) : (
          <View style={styles.noManagerCard}>
            <Text style={styles.noManagerText}>Bu departmana henüz yönetici atanmamış</Text>
          </View>
        )}
      </View>

      {/* Departman Çalışanları */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="account-group" size={20} color="#333" />
          <Text style={styles.sectionTitle}>Departman Çalışanları ({users.length})</Text>
        </View>
        {users.length > 0 ? (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.noUsersCard}>
            <Text style={styles.noUsersText}>Bu departmanda henüz çalışan bulunmuyor</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DepartmentDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
  },
  header: {
    backgroundColor: '#4b5c75',
    padding: 20,
    alignItems: 'center',
  },
  departmentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  managerCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  managerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  managerEmail: {
    fontSize: 14,
    color: '#388e3c',
    marginBottom: 2,
  },
  managerRole: {
    fontSize: 12,
    color: '#66bb6a',
    fontWeight: '600',
  },
  noManagerCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  noManagerText: {
    fontSize: 14,
    color: '#f57c00',
    fontStyle: 'italic',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#4b5c75',
    fontWeight: '600',
  },
  noUsersCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  noUsersText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});