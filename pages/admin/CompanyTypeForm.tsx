import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
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

  const fetchCompanyType = async () => {
    if (!companyTypeId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/company-types/${companyTypeId}`);
      setName(response.data.name);
    } catch (error) {
      Alert.alert(t.common.error, t.companyTypeForm.companyTypeLoadError);
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
      Alert.alert(t.common.error, t.companyTypeForm.nameRequired);
      return;
    }

    try {
      setLoading(true);
      
      if (companyTypeId) {
        // Güncelleme
        const payload = {
          id: companyTypeId,
          name: name.trim()
        };
        await api.put(`/api/company-types`, payload);
        Alert.alert(t.common.success, t.companyTypeForm.saveSuccess);
      } else {
        // Yeni oluşturma
        const payload = {
          name: name.trim()
        };
        await api.post('/api/company-types', payload);
        Alert.alert(t.common.success, t.companyTypeForm.saveSuccess);
      }
      
      navigation.goBack();
    } catch (error) {

      Alert.alert(t.common.error, t.companyTypeForm.saveError);
    } finally {
      setLoading(false);
    }
  };

  if (loading && companyTypeId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.common.loading}</Text>
      </View>
    );
  }

    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{t.companyTypeForm.companyTypeName}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t.companyTypeForm.companyTypeNamePlaceholder}
        editable={!loading}
      />



      <Button 
        title={companyTypeId ? t.common.update : t.common.save} 
        onPress={handleSave} 
        color="#4b5c75" 
                disabled={loading}
      />
      </ScrollView>
    </KeyboardAvoidingView>
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