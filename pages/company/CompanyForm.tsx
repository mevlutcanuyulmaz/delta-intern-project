import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Switch, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import api from '../../services/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CompanyFormProps = {
  route: RouteProp<{ params: { companyId: number } }, 'params'>;
};

const CompanyForm = () => {
  const { params } = useRoute<CompanyFormProps['route']>();
  const companyId = params.companyId;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addressDetail, setAddressDetail] = useState('');
  const [town, setTown] = useState<{
    id: number;
    name: string;
    city: string | null;
    region: string | null;
  } | null>(null);
  const [towns, setTowns] = useState<{ id: number; name: string }[]>([]);

  // Şirket bilgilerini çek
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/api/companies/${companyId}`);
        const data = response.data;
        setName(data.name);
        setShortName(data.shortName);
        setActive(data.active);
        setAddressDetail(data.addressDetail || '');
        setTown(data.town || null);
      } catch (error) {
        Alert.alert('Hata', 'Şirket bilgisi alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  // İlçeleri çek
  useEffect(() => {
  const fetchTowns = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('Token bulunamadı, ilçe verisi çekilemedi');
        return;
      }

      const response = await api.get('/api/location/town');
      setTowns(response.data);
    } catch (err) {
      console.error('İlçeler alınamadı', err);
    }
  };

  fetchTowns();
}, []);

  // İlçe değişince detaylarını getir (şehir ve bölge)
  const handleTownChange = async (townId: number) => {
    try {
      const response = await api.get(`/api/location/town/${townId}`);
      setTown(response.data);
    } catch (err) {
      console.error('İlçe detayları alınamadı', err);
      setTown(null);
    }
  };

const handleUpdate = async () => {
  try {
    const payload = {
      id: companyId,
      name,
      shortName,
      active,
      addressDetail,
      townId: town?.id || 1, // 🔧 İlçe seçilmemişse 1 gönder
    };

    const response = await api.put('/api/companies', payload);
    console.log("✅ Şirket güncellendi:", response.data);
    Alert.alert('Başarılı', 'Şirket güncellendi');
  } catch (error: any) {
    console.error("❌ Güncelleme hatası:", error.response?.data || error.message);
    Alert.alert('Hata', 'Şirket güncellenemedi');
  }
};

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Şirket Adı</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Kısa Ad</Text>
      <TextInput style={styles.input} value={shortName} onChangeText={setShortName} />

      <Text style={styles.label}>Adres Detayı</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={addressDetail}
        onChangeText={setAddressDetail}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>İlçe</Text>
      <Picker
        selectedValue={town?.id}
        onValueChange={handleTownChange}
      >
        <Picker.Item label="Lütfen ilçe seçin" value={undefined} />
        {towns.map((t) => (
          <Picker.Item key={t.id} label={t.name} value={t.id} />
        ))}
      </Picker>

      <Text style={styles.label}>İl</Text>
      <Text style={styles.infoText}>{town?.city || 'Belirtilmedi'}</Text>

      <Text style={styles.label}>Bölge</Text>
      <Text style={styles.infoText}>{town?.region || 'Belirtilmedi'}</Text>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Aktif mi?</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <Button title="Kaydet" onPress={handleUpdate} color="#4b5c75" />
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
