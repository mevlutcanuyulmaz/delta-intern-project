import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';

type CompanyTypeFormRouteProp = RouteProp<RootStackParamList, 'CompanyTypeForm'>;
type CompanyTypeFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompanyTypeForm'>;

const CompanyTypeForm = () => {
  const { t } = useLanguage();
  const route = useRoute<CompanyTypeFormRouteProp>();
  const navigation = useNavigation<CompanyTypeFormNavigationProp>();
  const { companyTypeId } = route.params || {};

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

  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchCompanyType = async () => {
    if (!companyTypeId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/company-types/${companyTypeId}`);
      setName(response.data.name);
      setActive(response.data.active);
    } catch (error) {
      console.error('Error fetching company type:', error);
      Alert.alert('Hata', 'Şirket türü bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyTypeId) {
      fetchCompanyType();
    }
  }, [companyTypeId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Şirket türü adı boş olamaz.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: name.trim(),
        active: active
      };

      if (companyTypeId) {
        // Güncelleme
        await api.put(`/api/company-types/${companyTypeId}`, payload);
        Alert.alert('Başarılı', 'Şirket türü başarıyla güncellendi.');
      } else {
        // Yeni oluşturma
        await api.post('/api/company-types', payload);
        Alert.alert('Başarılı', 'Şirket türü başarıyla oluşturuldu.');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving company type:', error);
      Alert.alert('Hata', 'Şirket türü kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && companyTypeId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Şirket Türü Adı</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Şirket türü adını girin"
        editable={!loading}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Aktif</Text>
        <Switch
          value={active}
          onValueChange={setActive}
          disabled={loading}
        />
      </View>

      <Button 
        title={companyTypeId ? "Güncelle" : "Kaydet"} 
        onPress={handleSave} 
        color="#4b5c75" 
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
});

export default CompanyTypeForm;