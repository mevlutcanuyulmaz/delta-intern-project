import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';

type DepartmentTypeListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DepartmentTypeList'>;

interface DepartmentType {
  id: number;
  name: string;
}

const DepartmentTypeList = () => {
  const { t } = useLanguage();
  const [departmentTypes, setDepartmentTypes] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<DepartmentTypeListNavigationProp>();

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
            onPress={() => navigation.navigate('DepartmentTypeForm')}
            style={{ marginLeft: 16, marginRight: 8 }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={{ marginLeft: 8, marginRight: 16 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

  const fetchDepartmentTypes = async () => {
    try {
      const response = await api.get('/api/department-types');
      setDepartmentTypes(response.data);
    } catch (error) {
      console.error('Error fetching department types:', error);
      Alert.alert('Hata', 'Departman türleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartmentType = async (id: number) => {
    Alert.alert(
      'Departman Türünü Sil',
      'Bu departman türünü silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/department-types/${id}`);
              fetchDepartmentTypes();
              Alert.alert('Başarılı', 'Departman türü başarıyla silindi.');
            } catch (error) {
              console.error('Error deleting department type:', error);
              Alert.alert('Hata', 'Departman türü silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchDepartmentTypes();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDepartmentTypes);
    return unsubscribe;
  }, [navigation]);

  const renderDepartmentType = ({ item }: { item: DepartmentType }) => (
    <View style={styles.departmentTypeCard}>
      <View style={styles.departmentTypeInfo}>
        <Text style={styles.departmentTypeName}>{item.name}</Text>
        <Text style={styles.departmentTypeId}>ID: {item.id}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('DepartmentTypeForm', { departmentTypeId: item.id })}
        >
          <Icon name="pencil" size={20} color="#4b5c75" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteDepartmentType(item.id)}
        >
          <Icon name="delete" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>Departman türleri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={departmentTypes}
        renderItem={renderDepartmentType}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: 16,
  },
  departmentTypeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentTypeInfo: {
    flex: 1,
  },
  departmentTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  departmentTypeId: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
});

export default DepartmentTypeList;