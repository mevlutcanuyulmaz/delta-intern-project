import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { CompanyInfo, UserInfo, } from '../../types/types';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const UserDepartmentInfo = () => {
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
            style={{ marginLeft: 15 }}
          >
            <Icon name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/api/user/get-self');
      console.log('User Info Response:', JSON.stringify(response.data, null, 2));
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserInfo();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.userCompanyInfo.loading}</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#f44336" />
        <Text style={styles.errorText}>{t.userCompanyInfo.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserInfo}>
          <Text style={styles.retryButtonText}>{t.userCompanyInfo.retry}</Text>
        </TouchableOpacity>
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
        {/* Departman Bilgileri */}
        {userInfo.departmentName ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Icon name="domain" size={20} color="#4b5c75" /> Departman Bilgileri
            </Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{userInfo.departmentName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.statusText}>Aktif</Text>
                </View>
              </View>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Icon name="account-group" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Departman Adı:</Text>
                  <Text style={styles.infoValue}>{userInfo.departmentName}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Icon name="account-circle" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Adınız:</Text>
                  <Text style={styles.infoValue}>{userInfo?.name} {userInfo?.surname}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Icon name="shield-account" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Rolünüz:</Text>
                  <Text style={styles.infoValue}>{userInfo.role?.name || 'Belirtilmemiş'}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Icon name="email" size={16} color="#666" />
                  <Text style={styles.infoLabel}>E-posta:</Text>
                  <Text style={styles.infoValue}>{userInfo?.email || 'Belirtilmemiş'}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Icon name="domain" size={20} color="#4b5c75" /> Departman Bilgileri
            </Text>
            <View style={styles.warningCard}>
              <Text style={styles.warningCardTitle}>
                <Icon name="information" size={20} color="#f57c00" /> Departman Bilgisi Bulunamadı
              </Text>
              <Text style={styles.warningCardText}>
                Henüz bir departmana atanmamışsınız. Lütfen yöneticinizle iletişime geçin.
              </Text>
            </View>
          </View>
        )}
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
    padding: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4b5c75',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    minWidth: 120,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  warningCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  warningCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 8,
  },
  warningCardText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});

export default UserDepartmentInfo;