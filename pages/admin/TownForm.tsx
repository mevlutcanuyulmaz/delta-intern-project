import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';
import { TownForm as TownFormType, Region } from '../../types/types';

type TownFormRouteProp = RouteProp<RootStackParamList, 'TownForm'>;
type TownFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TownForm'>;

const TownForm = () => {
  const { t } = useLanguage();
  const route = useRoute<TownFormRouteProp>();
  const navigation = useNavigation<TownFormNavigationProp>();
  const { townId } = route.params || {};

  const [name, setName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!townId);

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
      headerTitle: townId ? t.locationManagement.townForm.editTitle : t.locationManagement.townForm.title,
    });
  }, [navigation, townId, t]);

  const fetchRegions = async () => {
    try {
      const response = await api.get('/api/location/region');
      setRegions(response.data);
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.townForm.regionsLoadError);
    }
  };

  const fetchTown = async () => {
    if (!townId) return;
    
    try {
      setInitialLoading(true);
      const response = await api.get(`/api/location/town/${townId}`);
      const town = response.data;
      setName(town.name || '');
      setSelectedRegionId(town.region?.id);
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.townForm.townLoadError);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t.common.error, t.locationManagement.townForm.nameRequired);
      return;
    }

    if (!selectedRegionId) {
      Alert.alert(t.common.error, t.locationManagement.townForm.regionRequired);
      return;
    }

    try {
      setLoading(true);
      const townData: TownFormType = {
        name: name.trim(),
        regionId: selectedRegionId,
      };

      if (townId) {
        await api.put(`/api/location/town/${townId}`, townData);
        Alert.alert(t.common.success, t.locationManagement.townForm.updateSuccess);
      } else {
        await api.post('/api/location/town', townData);
        Alert.alert(t.common.success, t.locationManagement.townForm.saveSuccess);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.townForm.saveError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
    if (townId) {
      fetchTown();
    }
  }, [townId]);

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>{t.locationManagement.townForm.townName}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t.locationManagement.townForm.townNamePlaceholder}
          editable={!loading}
        />

        <Text style={styles.label}>{t.locationManagement.townForm.region}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRegionId}
            onValueChange={(value) => setSelectedRegionId(value)}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label={t.locationManagement.townForm.selectRegion} value={undefined} />
            {regions.map((region) => (
              <Picker.Item key={region.id} label={region.name} value={region.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {townId ? t.common.update : t.common.save}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  },
  form: {
    backgroundColor: '#fff',
    margin: 16,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#4b5c75',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TownForm;