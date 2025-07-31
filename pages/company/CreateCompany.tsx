// src/screens/CreateCompany.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, TextInput, Text, Switch, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { CompanyType } from '../../types/types';

const CreateCompany = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [active, setActive] = useState(true);
  const [addressDetail, setAddressDetail] = useState('');
  const [townId, setTownId] = useState<number | null>(null);
  const [companyTypeId, setCompanyTypeId] = useState<number | null>(null);
  const [towns, setTowns] = useState<{ id: number; name: string }[]>([]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ marginLeft: 15 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const response = await api.get('/api/location/town');
        setTowns(response.data);
      } catch (err) {
        Alert.alert(t.createCompany.districtsLoadError);
      }
    };

    const fetchCompanyTypes = async () => {
      try {
        const response = await api.get('/api/company-types');
        setCompanyTypes(response.data);
      } catch (err) {
        Alert.alert(t.createCompany.companyTypesLoadError);
      }
    };

    fetchTowns();
    fetchCompanyTypes();
  }, []);

  const handleCreate = async () => {
    if (!name || !shortName) {
      Alert.alert(t.createCompany.missingInfo, t.createCompany.enterCompanyNameAndShort);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name,
        shortName,
        active,
        addressDetail,
        townId: townId || 1, // 🔧 İlçe seçilmediyse 1 gönder
        companyTypeId: companyTypeId || 1, // 🔧 Şirket türü seçilmediyse 1 gönder
      };

      await api.post('/api/companies', payload);
      Alert.alert(t.common.success, t.createCompany.createSuccess);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t.common.error, t.createCompany.createError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t.createCompany.companyName}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>{t.createCompany.shortName}</Text>
      <TextInput style={styles.input} value={shortName} onChangeText={setShortName} />

      <Text style={styles.label}>{t.createCompany.addressDetail}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={addressDetail}
        onChangeText={setAddressDetail}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>{t.createCompany.district}</Text>
      <Picker
        selectedValue={townId}
        onValueChange={(itemValue) => setTownId(itemValue)}
      >
        <Picker.Item label={t.createCompany.selectDistrict} value={undefined} />
        {towns.map((t) => (
          <Picker.Item key={t.id} label={t.name} value={t.id} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.createCompany.companyType}</Text>
      <Picker
        selectedValue={companyTypeId}
        onValueChange={(itemValue) => setCompanyTypeId(itemValue)}
      >
        <Picker.Item label={t.createCompany.selectCompanyType} value={undefined} />
        {companyTypes.map((ct) => (
          <Picker.Item key={ct.id} label={ct.name} value={ct.id} />
        ))}
      </Picker>

      <View style={styles.switchRow}>
        <Text style={styles.label}>{t.createCompany.active}</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4b5c75" />
      ) : (
        <Button title={t.createCompany.create} onPress={handleCreate} color="#4b5c75" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default CreateCompany;
