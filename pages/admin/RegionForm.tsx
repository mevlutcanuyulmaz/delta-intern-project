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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../localization';
import api from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RegionFormRouteProp = RouteProp<RootStackParamList, 'RegionForm'>;

interface City {
  id: number;
  name: string;
}

const RegionForm: React.FC = () => {
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState<number | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RegionFormRouteProp>();
  const { t } = useLanguage();
  
  const regionId = route.params?.regionId;
  const isEditing = !!regionId;

  useEffect(() => {
    fetchCities();
    if (isEditing) {
      fetchRegion();
    }
  }, [regionId]);

  const fetchCities = async () => {
    try {
      const response = await api.get('/api/location/city');
      setCities(response.data);
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.regionForm.citiesLoadError);
    }
  };

  const fetchRegion = async () => {
    try {
      setInitialLoading(true);
      const response = await api.get(`/api/location/region/${regionId}`);
      setName(response.data.name);
      setCityId(response.data.cityId);
    } catch (error) {
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

    if (!cityId) {
      Alert.alert(t.common.error, t.locationManagement.regionForm.cityRequired);
      return;
    }

    try {
      setLoading(true);
      
      const regionData = { 
        name: name.trim(),
        cityId: cityId
      };
      
      if (isEditing) {
        await api.put(`/api/location/region/${regionId}`, regionData);
      } else {
        await api.post('/api/location/region', regionData);
      }

      Alert.alert(t.common.success, t.locationManagement.regionForm.saveSuccess);
      navigation.goBack();
    } catch (error) {
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? t.locationManagement.regionForm.editTitle : t.locationManagement.regionForm.title}
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>{t.locationManagement.regionForm.city}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={cityId}
            onValueChange={(itemValue) => setCityId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={t.locationManagement.regionForm.cityPlaceholder} value={null} />
            {cities.map((city) => (
              <Picker.Item key={city.id} label={city.name} value={city.id} />
            ))}
          </Picker>
        </View>

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
    </ScrollView>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  picker: {
    height: 50,
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