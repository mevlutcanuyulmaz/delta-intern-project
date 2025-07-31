import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';

type DepartmentTypeFormRouteProp = RouteProp<RootStackParamList, 'DepartmentTypeForm'>;
type DepartmentTypeFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DepartmentTypeForm'>;

const DepartmentTypeForm = () => {
  const { t } = useLanguage();
  const route = useRoute<DepartmentTypeFormRouteProp>();
  const navigation = useNavigation<DepartmentTypeFormNavigationProp>();
  const { departmentTypeId } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LanguageSwitcher />
          <TouchableOpacity 
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
            style={{ marginLeft: 16, marginRight: 16 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDepartmentType = async () => {
    if (!departmentTypeId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/department-types/${departmentTypeId}`);
      setName(response.data.name);
    } catch (error) {
      Alert.alert(t.common.error, t.departmentTypeForm.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentTypeId) {
      fetchDepartmentType();
    }
  }, [departmentTypeId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t.common.error, t.departmentTypeForm.nameRequired);
      return;
    }

    try {
      setLoading(true);
      
      if (departmentTypeId) {
        // Güncelleme
        await api.put('/api/department-types', { id: departmentTypeId, name: name.trim() });
        Alert.alert(t.common.success, t.departmentTypeForm.updateSuccess);
      } else {
        // Yeni oluşturma
        await api.post('/api/department-types', { name: name.trim() });
        Alert.alert(t.common.success, t.departmentTypeForm.createSuccess);
      }
      
      navigation.goBack();
    } catch (error: any) {
      console.error("❌ Departman türü kaydetme hatası:", error.response?.data || error.message);
      Alert.alert(t.common.error, t.departmentTypeForm.saveError);
    } finally {
      setLoading(false);
    }
  };

  if (loading && departmentTypeId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.departmentTypeForm.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t.departmentTypeForm.nameLabel}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t.departmentTypeForm.namePlaceholder}
        editable={!loading}
      />

      <Button 
        title={departmentTypeId ? t.common.update : t.common.save} 
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
});

export default DepartmentTypeForm;