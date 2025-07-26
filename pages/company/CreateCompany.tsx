// src/screens/CreateCompany.tsx
import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Text, Switch, Button, StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import api from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const CreateCompany = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [active, setActive] = useState(true);
  const [addressDetail, setAddressDetail] = useState('');
  const [townId, setTownId] = useState<number | null>(null);
  const [towns, setTowns] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const response = await api.get('/api/location/town');
        setTowns(response.data);
      } catch (err) {
        console.error('İlçeler alınamadı', err);
      }
    };

    fetchTowns();
  }, []);

  const handleCreate = async () => {
    if (!name || !shortName) {
      Alert.alert('Eksik Bilgi', 'Lütfen şirket adı ve kısa adı girin.');
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
      };

      const response = await api.post('/api/companies', payload);
      console.log("✅ Şirket oluşturuldu:", response.data);
      Alert.alert('Başarılı', 'Yeni şirket oluşturuldu');
      navigation.goBack();
    } catch (error: any) {
      console.error('❌ Oluşturma hatası:', error.response?.data || error.message);
      Alert.alert('Hata', 'Şirket oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

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
        selectedValue={townId}
        onValueChange={(itemValue) => setTownId(itemValue)}
      >
        <Picker.Item label="Lütfen ilçe seçin" value={undefined} />
        {towns.map((t) => (
          <Picker.Item key={t.id} label={t.name} value={t.id} />
        ))}
      </Picker>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Aktif mi?</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4b5c75" />
      ) : (
        <Button title="Oluştur" onPress={handleCreate} color="#4b5c75" />
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
