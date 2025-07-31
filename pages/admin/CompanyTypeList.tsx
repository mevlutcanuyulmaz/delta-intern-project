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
import { CompanyType } from '../../types/types';

type CompanyTypeListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompanyTypeList'>;

const CompanyTypeList = () => {
  const { t } = useLanguage();
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<CompanyTypeListNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LanguageSwitcher />
          <TouchableOpacity 
            onPress={() => navigation.navigate('CompanyTypeForm')}
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

  const fetchCompanyTypes = async () => {
    try {
      const response = await api.get('/api/company-types');
      setCompanyTypes(response.data);
    } catch (error) {
      Alert.alert(t.common.error, t.companyTypeList.companyTypesLoadError);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompanyType = async (id: number) => {
    Alert.alert(
      t.companyTypeList.deleteCompanyType,
      t.companyTypeList.deleteConfirmation,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/company-types/${id}`);
              fetchCompanyTypes();
              Alert.alert(t.common.success, t.companyTypeList.deleteSuccess);
            } catch (error) {
              Alert.alert(t.common.error, t.companyTypeList.deleteError);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchCompanyTypes();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchCompanyTypes);
    return unsubscribe;
  }, [navigation]);

  const renderCompanyType = ({ item }: { item: CompanyType }) => (
    <View style={styles.companyTypeCard}>
      <View style={styles.companyTypeInfo}>
        <Text style={styles.companyTypeName}>{item.name}</Text>
        <Text style={styles.companyTypeId}>ID: {item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.active ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>
            {item.active ? t.companyTypeList.active : t.companyTypeList.inactive}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('CompanyTypeForm', { companyTypeId: item.id })}
        >
          <Icon name="pencil" size={20} color="#4b5c75" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteCompanyType(item.id)}
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
        <Text style={styles.loadingText}>{t.companyTypeList.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={companyTypes}
        renderItem={renderCompanyType}
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
  companyTypeCard: {
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
  companyTypeInfo: {
    flex: 1,
  },
  companyTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyTypeId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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

export default CompanyTypeList;