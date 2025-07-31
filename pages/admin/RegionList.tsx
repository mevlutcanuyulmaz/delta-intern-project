import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';
import { Region } from '../../types/types';

type RegionListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegionList = () => {
  const { t } = useLanguage();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<RegionListNavigationProp>();

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
      headerTitle: t.locationManagement.regionList.title,
    });
  }, [navigation, t]);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/location/region');
      setRegions(response.data);
    } catch (error) {
      Alert.alert(t.common.error, t.locationManagement.regionList.regionsLoadError);
    } finally {
      setLoading(false);
    }
  };

  const deleteRegion = async (id: number) => {
    Alert.alert(
      t.locationManagement.regionList.deleteRegion,
      t.locationManagement.regionList.deleteConfirmation,
      [
        { text: t.locationManagement.regionList.cancel, style: 'cancel' },
        {
          text: t.locationManagement.regionList.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/location/region/${id}`);
              Alert.alert(t.common.success, t.locationManagement.regionList.deleteSuccess);
              fetchRegions();
            } catch (error) {
              Alert.alert(t.common.error, t.locationManagement.regionList.deleteError);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchRegions);
    return unsubscribe;
  }, [navigation]);

  const renderRegion = ({ item }: { item: Region }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>ID: {item.id}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('RegionForm', { regionId: item.id })}
        >
          <Text style={styles.buttonText}>{t.locationManagement.regionList.edit}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteRegion(item.id)}
        >
          <Text style={styles.buttonText}>{t.locationManagement.regionList.delete}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('RegionForm')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        <Text style={styles.addButtonText}>{t.locationManagement.regionList.addNewRegion}</Text>
      </TouchableOpacity>

      <FlatList
        data={regions}
        renderItem={renderRegion}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
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
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b5c75',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
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
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegionList;