import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo, UserStats } from '../../types/types';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const UserDashboard = () => {
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <LanguageSwitcher />
          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 16 }}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>{t.common.logout}</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleLogout, t]);

  const calculateProfileCompletion = (user: any) => {
    const fields = [
      user.name,
      user.surname,
      user.email,
      user.phone,
      user.departmentId,
      user.companyId
    ];
    const completedFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const fetchDashboardData = async () => {
    try {
      // Kullanıcı bilgilerini al
      const userResponse = await api.get('/api/user/get-self');
      const userData = userResponse.data;
      setUserInfo(userData);

      const userStats: UserStats = {
        departmentName: userData.departmentName || 'Atanmamış',
        companyName: userData.company?.name || 'Bilinmiyor',
        joinDate: userData.createdAt || new Date().toISOString(),
      };

      setStats(userStats);
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

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.userDashboard.loading}</Text>
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
            <Icon name="account-circle" size={40} color="#4b5c75" />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>{t.userDashboard.welcome}</Text>
              <Text style={styles.welcomeName}>{userInfo?.name} {userInfo?.surname}</Text>
              <Text style={styles.welcomeRole}>{userInfo?.role?.name}</Text>
              <Text style={styles.welcomeCompany}>{stats?.companyName}</Text>
            </View>
          </View>
        </View>

        {/* Bilgilerim */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t.userDashboard.myInfo}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Icon name="domain" size={20} color="#4b5c75" />
              <Text style={styles.infoText}>{t.userDashboard.department}: {stats?.departmentName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="office-building" size={20} color="#4b5c75" />
              <Text style={styles.infoText}>{t.userDashboard.company}: {stats?.companyName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color="#4b5c75" />
              <Text style={styles.infoText}>{t.userDashboard.joinDate}: {formatJoinDate(stats?.joinDate || '')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="email" size={20} color="#4b5c75" />
              <Text style={styles.infoText}>{t.userDashboard.email}: {userInfo?.email}</Text>
            </View>
          </View>
        </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  welcomeCompany: {
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
  profileSection: {
    margin: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  profileHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  infoSection: {
    margin: 16,
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
  logoutButton: {
    padding: 8,
  },
  section: {
    margin: 16,
  },
});

export default UserDashboard;