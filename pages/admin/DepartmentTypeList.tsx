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
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
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
      Alert.alert(t.common.error, t.departmentTypeList.loadError);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartmentType = async (id: number) => {
    Alert.alert(
      t.departmentTypeList.deleteTitle,
      t.departmentTypeList.deleteConfirmation,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/department-types/${id}`);
              fetchDepartmentTypes();
              Alert.alert(t.common.success, t.departmentTypeList.deleteSuccess);
            } catch (error) {
              Alert.alert(t.common.error, t.departmentTypeList.deleteError);  
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
        <Text style={styles.loadingText}>{t.departmentTypeList.loading}</Text>
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