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
import { Town } from '../../types/types';

type TownListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TownList = () => {
  const { t } = useLanguage();
  const [towns, setTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<TownListNavigationProp>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LanguageSwitcher />
          <TouchableOpacity 
            onPress={handleLogout} 
            style={{ marginLeft: 16, marginRight: 16 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
      headerTitle: t.locationManagement.townList.title,
    });
  }, [navigation]);

  const fetchTowns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/location/town');
      setTowns(response.data);
    } catch (error) {
      console.error('İlçeler yüklenirken hata:', error);
      Alert.alert(t.common.error, t.locationManagement.townList.townsLoadError);
    } finally {
      setLoading(false);
    }
  };

  const deleteTown = async (id: number) => {
    Alert.alert(
      t.locationManagement.townList.deleteTitle,
      t.locationManagement.townList.deleteConfirmation,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/location/town/${id}`);
              Alert.alert(t.common.success, t.locationManagement.townList.deleteSuccess);
              fetchTowns();
            } catch (error) {
              console.error('İlçe silinirken hata:', error);
              Alert.alert(t.common.error, t.locationManagement.townList.deleteError);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchTowns();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchTowns);
    return unsubscribe;
  }, [navigation]);

  const renderTown = ({ item }: { item: Town }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>ID: {item.id}</Text>
        {item.region && (
          <Text style={styles.detail}>{t.locationManagement.townList.region}: {item.region.name}</Text>
        )}
        {item.city && (
          <Text style={styles.detail}>{t.locationManagement.townList.city}: {item.city.name}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('TownForm', { townId: item.id })}
        >
          <Text style={styles.buttonText}>{t.common.edit}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteTown(item.id)}
        >
          <Text style={styles.buttonText}>{t.common.delete}</Text>
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
        onPress={() => navigation.navigate('TownForm')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        <Text style={styles.addButtonText}>{t.locationManagement.townList.addNewTown}</Text>
      </TouchableOpacity>

      <FlatList
        data={towns}
        renderItem={renderTown}
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
    marginBottom: 2,
  },
  detail: {
    fontSize: 12,
    color: '#888',
    marginBottom: 1,
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

export default TownList;