import React, { useState, useEffect } from 'react';
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
import { CompanyInfo, UserInfo, DepartmentInfo } from '../../types/types';

const UserCompanyInfo = () => {
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/api/user/get-self');
      console.log('🔍 API Response - User Info:', JSON.stringify(response.data, null, 2));
      setUserInfo(response.data);
      
      // Eğer companyId varsa şirket bilgilerini çek
      if (response.data.companyId) {
        await fetchCompanyInfo(response.data.companyId);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCompanyInfo = async (companyId: number) => {
    try {
      const response = await api.get(`/api/company/${companyId}`);
      console.log('🔍 API Response - Company Info:', JSON.stringify(response.data, null, 2));
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Şirket bilgileri alınamadı:', error);
      // Şirket bilgisi alamazsa sessizce devam et
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserInfo();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAddress = (company: CompanyInfo) => {
    const parts = [
      company.addressDetail,
      company.town?.name,
      company.town?.city?.name,
      company.town?.region?.name
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Adres belirtilmemiş';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>Şirket bilgileri yükleniyor...</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#f44336" />
        <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserInfo}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
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
      {/* Şirket Bilgileri */}
      {companyInfo ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="office-building" size={20} color="#4b5c75" /> Şirket Bilgileri
          </Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{companyInfo.name || 'Şirket adı belirtilmemiş'}</Text>
              <View style={[styles.statusBadge, { backgroundColor: companyInfo.active ? '#4CAF50' : '#f44336' }]}>
                <Text style={styles.statusText}>{companyInfo.active ? 'Aktif' : 'Pasif'}</Text>
              </View>
            </View>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Icon name="tag" size={16} color="#666" />
                <Text style={styles.infoLabel}>Kısa Ad:</Text>
                <Text style={styles.infoValue}>{companyInfo.shortName || 'Belirtilmemiş'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="domain" size={16} color="#666" />
                <Text style={styles.infoLabel}>Şirket Türü:</Text>
                <Text style={styles.infoValue}>{companyInfo.companyType?.name || 'Belirtilmemiş'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="map-marker" size={16} color="#666" />
                <Text style={styles.infoLabel}>Adres:</Text>
                <Text style={styles.infoValue}>{formatAddress(companyInfo)}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="calendar-plus" size={16} color="#666" />
                <Text style={styles.infoLabel}>Kuruluş Tarihi:</Text>
                <Text style={styles.infoValue}>{companyInfo.createdAt ? formatDate(companyInfo.createdAt) : 'Belirtilmemiş'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Icon name="account-circle" size={16} color="#666" />
                <Text style={styles.infoLabel}>Kullanıcı:</Text>
                <Text style={styles.infoValue}>{userInfo?.name || 'İsim'} {userInfo?.surname || 'Soyisim'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Icon name="email" size={16} color="#666" />
                <Text style={styles.infoLabel}>E-posta:</Text>
                <Text style={styles.infoValue}>{userInfo?.email || 'E-posta belirtilmemiş'}</Text>
              </View>

              <View style={styles.infoItem}>
                <Icon name="shield-account" size={16} color="#666" />
                <Text style={styles.infoLabel}>Rol:</Text>
                <Text style={styles.infoValue}>{userInfo?.role?.name || 'Rol belirtilmemiş'}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="office-building" size={20} color="#4b5c75" /> Şirket Bilgileri
          </Text>
          <View style={styles.warningCard}>
            <Text style={styles.warningCardTitle}>
              <Icon name="information" size={20} color="#f57c00" /> Şirket Bilgisi Bulunamadı
            </Text>
            <Text style={styles.warningCardText}>
              Henüz bir şirkete bağlı değilsiniz. Şirket ataması için yöneticinizle iletişime geçin.
            </Text>
          </View>
        </View>
      )}
      
      {/* Departman Bilgileri - departmentName varsa göster */}
      {userInfo.departmentName && (
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
                <Icon name="shield-account" size={16} color="#666" />
                <Text style={styles.infoLabel}>Kullanıcı Rolü:</Text>
                <Text style={styles.infoValue}>{userInfo.role?.name || 'USER'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Icon name="calendar-account" size={16} color="#666" />
                <Text style={styles.infoLabel}>Katılım Tarihi:</Text>
                <Text style={styles.infoValue}>{userInfo.createdAt ? formatDate(userInfo.createdAt) : 'Belirtilmemiş'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Departman bilgisi yoksa bilgilendirme mesajı */}
      {!userInfo.departmentName && !userInfo.department && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Icon name="domain" size={20} color="#4b5c75" /> Departman Bilgileri
          </Text>
          <View style={styles.warningCard}>
            <Text style={styles.warningCardTitle}>
              <Icon name="information" size={20} color="#f57c00" /> Departman Bilgisi Bulunamadı
            </Text>
            <Text style={styles.warningCardText}>
              Henüz bir departmana atanmadınız. Departman ataması için yöneticinizle iletişime geçin.
            </Text>
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
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    minWidth: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
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

export default UserCompanyInfo;