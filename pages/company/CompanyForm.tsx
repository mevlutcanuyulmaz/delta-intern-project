import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, TextInput, Text, Switch, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

type CompanyFormProps = {
  route: RouteProp<{ params: { companyId: number } }, 'params'>;
};

const CompanyForm = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const { params } = useRoute<CompanyFormProps['route']>();
  const companyId = params.companyId;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addressDetail, setAddressDetail] = useState('');
  const [townId, setTownId] = useState<number | undefined>(undefined);
  const [towns, setTowns] = useState<{ id: number; name: string }[]>([]);
  const [companyTypes, setCompanyTypes] = useState<{ id: number; name: string }[]>([]);
  const [companyTypeId, setCompanyTypeId] = useState<number | undefined>(undefined);

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

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/companies/${companyId}`);
      const data = response.data;
      setName(data.name);
      setShortName(data.shortName);
      setActive(data.active);
      setAddressDetail(data.addressDetail || '');
      setTownId(data.town?.id);
      setCompanyTypeId(data.companyType?.id);
    } catch (error) {
      Alert.alert(t.common.error, t.companyForm.companyInfoError);
    } finally {
      setLoading(false);
    }
  }, [companyId, t]);

  // Şirket bilgilerini çek
  useEffect(() => {
    fetchCompany();

    const fetchCompanyTypes = async () => {
      try {
        const response = await api.get('/api/company-types');
        setCompanyTypes(response.data);
      } catch (error) {
        Alert.alert(t.common.error, 'Şirket türleri yüklenemedi.');
      }
    };

    const fetchTowns = async () => {
      try {
        const response = await api.get('/api/location/town');
        setTowns(response.data);
      } catch (error) {
        Alert.alert(t.common.error, 'İlçeler yüklenemedi.');
      }
    };

    fetchCompanyTypes();
    fetchTowns();
  }, [companyId, fetchCompany]);

const handleUpdate = async () => {
  if (!companyTypeId) {
    Alert.alert(t.common.error, 'Lütfen şirket türü seçiniz.');
    return;
  }

  try {
    const payload = {
      id: companyId,
      name,
      shortName,
      active,
      addressDetail,
      townId: townId || 1, // 🔧 İlçe seçilmemişse 1 gönder
      companyTypeId,
    };

    const response = await api.put('/api/companies', payload);
    
    Alert.alert(t.common.success, t.companyForm.updateSuccess, [
          {
            text: t.common.ok,
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
  } catch (error: any) {
    console.error("❌ Güncelleme hatası:", error.response?.data || error.message);
    Alert.alert(t.common.error, t.companyForm.updateError);
  }
};

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t.companyForm.companyName}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>{t.companyForm.shortName}</Text>
      <TextInput style={styles.input} value={shortName} onChangeText={setShortName} />

      <Text style={styles.label}>{t.companyForm.companyType}</Text>
      <Picker
        selectedValue={companyTypeId}
        onValueChange={(itemValue) => setCompanyTypeId(itemValue)}
      >
        <Picker.Item label={t.companyForm.selectCompanyType} value={undefined} />
        {companyTypes.map((type) => (
          <Picker.Item key={type.id} label={type.name} value={type.id} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.companyForm.addressDetail}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={addressDetail}
        onChangeText={setAddressDetail}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>{t.companyForm.district}</Text>
      <Picker
        selectedValue={townId}
        onValueChange={(itemValue) => setTownId(itemValue)}
      >
        <Picker.Item label={t.companyForm.selectDistrict} value={undefined} />
        {towns.map((t, index) => (
          <Picker.Item key={`town-${t.id}-${index}`} label={t.name} value={t.id} />
        ))}
      </Picker>

      <View style={styles.switchRow}>
        <Text style={styles.label}>{t.companyForm.active}</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <Button title={t.common.save} onPress={handleUpdate} color="#4b5c75" />
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
  infoText: {
    padding: 8,
    marginTop: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
});

export default CompanyForm;
