import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../localization';
import api from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CityFormRouteProp = RouteProp<RootStackParamList, 'CityForm'>;

const CityForm: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CityFormRouteProp>();
  const { t } = useLanguage();
  
  const cityId = route.params?.cityId;
  const isEditing = !!cityId;

  useEffect(() => {
    if (isEditing) {
      fetchCity();
    }
  }, [cityId]);

  const fetchCity = async () => {
    try {
      setInitialLoading(true);
      const response = await api.get(`/api/location/city/${cityId}`);
      setName(response.data.name);
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.cityForm.cityLoadError);
    } finally {
      setInitialLoading(false);
    }
  };

  const saveCity = async () => {
    if (!name.trim()) {
      Alert.alert(t.common.error, t.locationManagement.cityForm.nameRequired);
      return;
    }

    try {
      setLoading(true);
      
      const cityData = { 
        name: name.trim()
      };

      if (isEditing) {
        await api.put(`/api/location/city/${cityId}`, cityData);
      } else {
        await api.post('/api/location/city', cityData);
      }

      Alert.alert(t.common.success, t.locationManagement.cityForm.saveSuccess);
      navigation.goBack();
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.cityForm.saveError);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.locationManagement.cityForm.loading}</Text>
      </View>
    );
  }

    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEditing ? t.locationManagement.cityForm.editTitle : t.locationManagement.cityForm.title}
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>{t.locationManagement.cityForm.cityName}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t.locationManagement.cityForm.cityNamePlaceholder}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={saveCity}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{t.locationManagement.cityForm.save}</Text>
          )}
                </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4b5c75',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CityForm;