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
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useLanguage } from '../../localization';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CityFormRouteProp = RouteProp<RootStackParamList, 'CityForm'>;

interface Region {
  id: number;
  name: string;
}

const CityForm: React.FC = () => {
  const [name, setName] = useState('');
  const [regionId, setRegionId] = useState<number | undefined>(undefined);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CityFormRouteProp>();
  const { t } = useLanguage();
  
  const cityId = route.params?.cityId;
  const isEditing = !!cityId;

  useEffect(() => {
    fetchRegions();
    if (isEditing) {
      fetchCity();
    }
  }, [cityId]);

  const fetchRegions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/location/region');
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error('Error fetching regions:', error);
      Alert.alert(t.common.error, t.locationManagement.cityForm.regionsLoadError);
    }
  };

  const fetchCity = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(`http://localhost:8080/api/location/city/${cityId}`);
      const data = await response.json();
      setName(data.name);
      setRegionId(data.regionId);
    } catch (error) {
      console.error('Error fetching city:', error);
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
      const url = isEditing 
        ? `http://localhost:8080/api/location/city/${cityId}`
        : 'http://localhost:8080/api/location/city';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(),
          regionId: regionId 
        }),
      });

      if (response.ok) {
        Alert.alert(t.common.success, t.locationManagement.cityForm.saveSuccess);
        navigation.goBack();
      } else {
        Alert.alert(t.common.error, t.locationManagement.cityForm.saveError);
      }
    } catch (error) {
      console.error('Error saving city:', error);
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
    <View style={styles.container}>
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

        <Text style={styles.label}>{t.locationManagement.cityForm.region}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={regionId}
            onValueChange={(value) => setRegionId(value)}
            style={styles.picker}
          >
            <Picker.Item label={t.locationManagement.cityForm.selectRegion} value={undefined} />
            {regions.map((region) => (
              <Picker.Item key={region.id} label={region.name} value={region.id} />
            ))}
          </Picker>
        </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
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