import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface Company {
  id: number;
  name: string;
  shortName: string;
  active: boolean;
}

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
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
      console.error('Şirketler alınamadı', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
  try {
    await api.delete(`/api/companies/${id}`);
    Alert.alert('Başarılı', 'Şirket silindi');
    // Listeyi güncelle
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  } catch (error) {
    console.error('Silme hatası:', error);
    Alert.alert('Hata', 'Şirket silinemedi');
  }
};
  useEffect(() => {
    fetchCompanies();
  }, []);

  const renderCompany = ({ item }: { item: Company }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.shortName}</Text>
      <Text style={{ color: item.active ? 'green' : 'red' }}>
        {item.active ? 'Aktif' : 'Pasif'}
      </Text>
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#3498db' }]}
      onPress={() => navigation.navigate('CompanyDetail', { id: item.id })}
    >
      <Text style={styles.buttonText}>Detay</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#f39c12' }]}
      onPress={() => navigation.navigate('CompanyForm', { companyId: item.id })}
    >
      <Text style={styles.buttonText}>Düzenle</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#c0392b' }]}
      onPress={() => handleDelete(item.id)}
    >
      <Text style={styles.buttonText}>Sil</Text>
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
        <Text style={styles.createButtonText}>+ Yeni Şirket Ekle</Text>
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
});
