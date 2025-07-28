import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalDepartments: number;
  activeUsers: number;
  pendingUsers: number;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchDashboardData = async () => {
    try {
      // Kullanıcı bilgilerini al
      const userResponse = await api.get('/api/user/get-self');
      setUser(userResponse.data);

      // İstatistikleri hesapla
      const [usersResponse, companiesResponse, departmentsResponse] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/companies'),
        api.get('/api/departments')
      ]);

      const users = usersResponse.data;
      const companies = companiesResponse.data;
      const departments = departmentsResponse.data;

      const dashboardStats: DashboardStats = {
        totalUsers: users.length,
        totalCompanies: companies.length,
        totalDepartments: departments.length,
        activeUsers: users.filter((u: any) => u.isActive).length,
        pendingUsers: users.filter((u: any) => !u.isActive).length,
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Dashboard verileri alınamadı:', error);
      Alert.alert('Hata', 'Dashboard verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>Dashboard yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hoş Geldin Bölümü */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <Icon name="shield-account" size={40} color="#4b5c75" />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Hoş Geldin!</Text>
            <Text style={styles.welcomeName}>{user?.name} {user?.surname}</Text>
            <Text style={styles.welcomeRole}>{user?.role?.name}</Text>
          </View>
        </View>
      </View>

      {/* İstatistik Kartları */}
      {stats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Sistem İstatistikleri</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="account-group" size={30} color="#1976D2" />
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Toplam Kullanıcı</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <Icon name="office-building" size={30} color="#388E3C" />
              <Text style={styles.statNumber}>{stats.totalCompanies}</Text>
              <Text style={styles.statLabel}>Toplam Şirket</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="domain" size={30} color="#F57C00" />
              <Text style={styles.statNumber}>{stats.totalDepartments}</Text>
              <Text style={styles.statLabel}>Toplam Departman</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
              <Icon name="account-check" size={30} color="#7B1FA2" />
              <Text style={styles.statNumber}>{stats.activeUsers}</Text>
              <Text style={styles.statLabel}>Aktif Kullanıcı</Text>
            </View>
          </View>
        </View>
       )}
     </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  welcomeSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b5c75',
    marginTop: 4,
  },
  welcomeRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsSection: {
    margin: 16,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});
