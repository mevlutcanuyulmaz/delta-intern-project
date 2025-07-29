import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../localization';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RegionFormRouteProp = RouteProp<RootStackParamList, 'RegionForm'>;

const RegionForm: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RegionFormRouteProp>();
  const { t } = useLanguage();
  
  const regionId = route.params?.regionId;
  const isEditing = !!regionId;

  useEffect(() => {
    if (isEditing) {
      fetchRegion();
    }
  }, [regionId]);

  const fetchRegion = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(`http://localhost:8080/api/location/region/${regionId}`);
      const data = await response.json();
      setName(data.name);
    } catch (error) {
      console.error('Error fetching region:', error);
      Alert.alert(t.common.error, t.locationManagement.regionForm.regionLoadError);
    } finally {
      setInitialLoading(false);
    }
  };

  const saveRegion = async () => {
    if (!name.trim()) {
      Alert.alert(t.common.error, t.locationManagement.regionForm.nameRequired);
      return;
    }

    try {
      setLoading(true);
      const url = isEditing 
        ? `http://localhost:8080/api/location/region/${regionId}`
        : 'http://localhost:8080/api/location/region';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        Alert.alert(t.common.success, t.locationManagement.regionForm.saveSuccess);
        navigation.goBack();
      } else {
        Alert.alert(t.common.error, t.locationManagement.regionForm.saveError);
      }
    } catch (error) {
      console.error('Error saving region:', error);
      Alert.alert(t.common.error, t.locationManagement.regionForm.saveError);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>{t.locationManagement.regionForm.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? t.locationManagement.regionForm.editTitle : t.locationManagement.regionForm.title}
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>{t.locationManagement.regionForm.regionName}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t.locationManagement.regionForm.regionNamePlaceholder}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={saveRegion}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{t.locationManagement.regionForm.save}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: 10,
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

export default RegionForm;