import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { CompanyInfo, UserInfo } from '../../types/types';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const ManagerCompanyList = () => {
  const [companies, setCompanies] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();

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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginLeft: 15 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const fetchCompanies = async () => {
    try {
      // Önce kullanıcı bilgilerini al
      const userResponse = await api.get('/api/user/get-self');
      const userData = userResponse.data;
      setUserInfo(userData);

      // Eğer kullanıcının companyId'si varsa, sadece o şirketi getir
      if (userData.companyId) {
        const companyResponse = await api.get(`/api/company/${userData.companyId}`);
        console.log('Manager\'ın şirketi:', companyResponse.data);
        setCompanies([companyResponse.data]);
      } else {
        // CompanyId yoksa boş liste göster
        console.log('Manager\'ın şirket bilgisi bulunamadı');
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      Alert.alert('Error', t.managerCompanyList.companiesLoadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanies();
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCompanies();
    }, [])
  );

  useEffect(() => {
    fetchCompanies();
  }, []);

  const renderCompany = ({ item }: { item: CompanyInfo }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="domain" size={24} color="#4b5c75" />
        <View style={styles.headerText}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.shortName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.active ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>
            {item.active ? t.managerCompanyList.active : t.managerCompanyList.inactive}
          </Text>
        </View>
      </View>
      
      {/* Şirket türü */}
      {item.companyType && (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="tag" size={16} color="#666" />
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>{t.managerCompanyList.companyType}: </Text>
            {item.companyType.name}
          </Text>
        </View>
      )}

      {/* Lokasyon bilgileri */}
      {item.town && (
        <View style={styles.locationInfo}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>{t.managerCompanyList.district}: </Text>
              {item.town.name}
            </Text>
          </View>
          
          {item.town.city && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="city" size={16} color="#666" />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>{t.managerCompanyList.city}: </Text>
                {item.town.city.name}
              </Text>
            </View>
          )}
          
          {item.town.region && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="earth" size={16} color="#666" />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>{t.managerCompanyList.region}: </Text>
                {item.town.region.name}
              </Text>
            </View>
          )}
        </View>
      )}

      {item.addressDetail && (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="home" size={16} color="#666" />
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>{t.managerCompanyList.address}: </Text>
            {item.addressDetail}
          </Text>
        </View>
      )}

      {/* Oluşturulma tarihi */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="calendar" size={16} color="#666" />
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>{t.managerCompanyList.createdDate}: </Text>
          {new Date(item.createdAt).toLocaleDateString('tr-TR')}
        </Text>
      </View>

      {/* Detay butonu */}
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => navigation.navigate('CompanyDetail', { id: item.id })}
      >
        <MaterialCommunityIcons name="eye" size={16} color="#fff" />
        <Text style={styles.detailButtonText}>{t.managerCompanyList.viewDetails}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.managerCompanyList.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="domain" size={24} color="#4b5c75" />
        <Text style={styles.headerTitle}>{t.managerCompanyList.title}</Text>
        {companies.length > 0 && (
          <Text style={styles.headerSubtitle}>{companies.length} {t.managerCompanyList.companiesCount}</Text>
        )}
      </View>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCompany}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#4b5c75',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b5c75',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default ManagerCompanyList;