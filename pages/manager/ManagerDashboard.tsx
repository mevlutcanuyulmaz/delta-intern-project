import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from '../../types/types';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';

type ManagerDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManagerDashboard'>;

interface DepartmentStats {
  totalEmployees: number;
  managedDepartments: number;
  departmentName: string;
}

const ManagerDashboard = () => {
  const { t } = useLanguage();
  const navigation = useNavigation<ManagerDashboardNavigationProp>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
            style={{ marginLeft: 16 }}
          >
            <Icon name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

  const fetchDashboardData = async () => {
    try {
      // Kullanıcı bilgilerini al
      const userResponse = await api.get('/api/user/get-self');
      setUserInfo(userResponse.data);

      // Departman çalışanlarını al
      const usersResponse = await api.get('/api/users');
      const allUsers = usersResponse.data;
      
      // Manager'ın departmanındaki çalışanları filtrele
      const departmentEmployees = allUsers.filter((user: any) => 
        user.departmentId === userResponse.data.departmentId
      );

      const departmentStats: DepartmentStats = {
        totalEmployees: departmentEmployees.length,
        managedDepartments: 1, // Manager sadece bir departman yönetir
        departmentName: userResponse.data.departmentName || t.managerDashboard.unknown,
      };

      setStats(departmentStats);
    } catch (error) {
      Alert.alert(t.common.error, t.managerDashboard.dashboardDataError);
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

  const quickActions = [
    {
      title: t.managerDashboard.departmentEmployees,
      icon: 'account-group',
      color: '#4CAF50',
      onPress: () => navigation.navigate('ManagerUserList')
    },
    {
      title: t.managerDashboard.companies,
      icon: 'domain',
      color: '#FF9800',
      onPress: () => navigation.navigate('ManagerCompanyList')
    },
    {
      title: t.managerDashboard.profileSettings,
      icon: 'account-cog',
      color: '#2196F3',
      onPress: () => navigation.navigate('ManagerProfile')
    }
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t.managerDashboard.loading}</Text>
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
          <Icon name="account-tie" size={40} color="#4b5c75" />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>{t.managerDashboard.welcome}</Text>
            <Text style={styles.welcomeName}>{userInfo?.name} {userInfo?.surname}</Text>
            <Text style={styles.welcomeRole}>{userInfo?.role?.name}</Text>
            <Text style={styles.welcomeDepartment}>{t.managerDashboard.department}: {userInfo?.departmentName}</Text>
          </View>
        </View>
      </View>

      {/* Departman İstatistikleri */}
       {stats && (
         <View style={styles.statsSection}>
           <Text style={styles.sectionTitle}>{t.managerDashboard.departmentStats}</Text>
           <View style={styles.statsGrid}>
             <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
               <Icon name="account-group" size={30} color="#1976D2" />
               <Text style={styles.statNumber}>{stats.totalEmployees}</Text>
               <Text style={styles.statLabel}>{t.managerDashboard.totalEmployees}</Text>
             </View>
             
             <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
               <Icon name="domain" size={30} color="#7B1FA2" />
               <Text style={styles.statNumber}>{stats.managedDepartments}</Text>
               <Text style={styles.statLabel}>{t.managerDashboard.managedDepartments}</Text>
             </View>
           </View>
         </View>
       )}
    </ScrollView>
  );
};

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
  welcomeDepartment: {
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
  quickActionsSection: {
    margin: 16,
  },
  quickActionsGrid: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 4,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  departmentInfoSection: {
    margin: 16,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
});

export default ManagerDashboard;
