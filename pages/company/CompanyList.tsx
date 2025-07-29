import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import { CompanyInfo } from '../../types/types';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const CompanyList = () => {
  const [companies, setCompanies] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

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

  const handleLogout = () => {
    // Çıkış işlemi burada yapılacak
    navigation.navigate('Login');
  };

  useFocusEffect(
        useCallback(() => {
        setLoading(true);
        fetchCompanies();
        }, [])
    );
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/api/companies');
      console.log('Şirketler:', response.data);
      setCompanies(response.data);
    } catch (error) {
      console.error(t.companyList.companiesLoadError, error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
  try {
    await api.delete(`/api/companies/soft/${id}`);
    Alert.alert(t.common.success, t.companyList.deleteSuccess);
    // Listeyi güncelle
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  } catch (error) {
    console.error('Silme hatası:', error);
    Alert.alert(t.common.error, t.companyList.deleteError);
  }
};
  useEffect(() => {
    fetchCompanies();
  }, []);

  const renderCompany = ({ item }: { item: CompanyInfo }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.shortName}</Text>
      
      {/* Lokasyon bilgileri */}
      <View style={styles.locationInfo}>
        {item.town && (
          <>
            <Text style={styles.locationText}>
              <Text style={styles.locationLabel}>{t.companyList.district}: </Text>
              {item.town.name}
            </Text>
            <Text style={styles.locationText}>
              <Text style={styles.locationLabel}>{t.companyList.city}: </Text>
              {item.town.city?.name || t.companyList.notSpecified}
            </Text>
            <Text style={styles.locationText}>
              <Text style={styles.locationLabel}>{t.companyList.region}: </Text>
              {item.town.region?.name || t.companyList.notSpecified}
            </Text>
          </>
        )}
        {item.addressDetail && (
          <Text style={styles.locationText}>
            <Text style={styles.locationLabel}>{t.companyList.address}: </Text>
            {item.addressDetail}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#3498db' }]}
        onPress={() => navigation.navigate('CompanyDetail', { id: item.id })}
      >
        <Text style={styles.buttonText}>{t.companyList.detail}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f39c12' }]}
        onPress={() => navigation.navigate('CompanyForm', { companyId: item.id })}
      >
        <Text style={styles.buttonText}>{t.companyList.edit}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#c0392b' }]}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.buttonText}>{t.companyList.delete}</Text>
      </TouchableOpacity>
    </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#4b5c75" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCompany}
        contentContainerStyle={styles.list}
      />
    <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateCompany')}
      >
        <Text style={styles.createButtonText}>{t.companyList.addNewCompany}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompanyList;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#555',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#4b5c75',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#4b5c75',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    marginBottom: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  locationText: {
    marginBottom: 4,
    fontSize: 14,
  },
  locationLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
});
