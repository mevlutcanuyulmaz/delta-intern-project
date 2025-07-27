import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

type UserFormRouteProp = RouteProp<{ params: { userId?: number } }, 'params'>;

interface Department {
  id: number;
  name: string;
}

const UserForm = () => {
  const { params } = useRoute<UserFormRouteProp>();
  const navigation = useNavigation<any>();
  const userId = params?.userId;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number>(6); 
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(!!userId);


  const roles = [
    { id: 4, label: 'Admin' },
    { id: 5, label: 'Manager' },
    { id: 6, label: 'User' },
  ];

useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data);
      // Eğer departman varsa ilk departmanın ID'sini set et
      if (response.data.length > 0) {
        setDepartmentId(response.data[0].id);
      }
    } catch (error) {
      Alert.alert('Hata', 'Departmanlar alınamadı');
    }
  };

  fetchDepartments();
}, []);

useEffect(() => {
  if (userId) {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/user/get-user-detail/${userId}`);
        const user = response.data;
        setName(user.name);
        setSurname(user.surname);
        setEmail(user.email);
        if (user.departmentId) {
          setDepartmentId(user.departmentId);
        }
      } catch (error) {
        Alert.alert('Hata', 'Kullanıcı bilgisi alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }
}, [userId]);

  const handleSave = async () => {
    if (!departmentId) {
      Alert.alert('Uyarı', 'Lütfen bir departman seçiniz.');
      return;
    }

    try {
      if (userId) {
        await api.put('/api/user/update-user', {
          id: userId,
          name,
          surname,
          email,
          departmentId,
        });
      } else {
        await api.post('/api/user/create-user', {
          name,
          surname,
          email,
          departmentId,
          roleId,
        });
      }

      Alert.alert('Başarılı', 'Kullanıcı kaydedildi');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı kaydedilemedi');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ad</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Soyad</Text>
      <TextInput style={styles.input} value={surname} onChangeText={setSurname} />

      <Text style={styles.label}>E-posta</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

      <Text style={styles.label}>Departman</Text>
      <Picker
        selectedValue={departmentId}
        onValueChange={(value) => setDepartmentId(value)}
        style={styles.picker}
      >
        <Picker.Item label="Departman Seçin" value={null} />
        {departments.map((dept) => (
          <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={roleId}
        onValueChange={(value) => setRoleId(value)}
        style={styles.picker}
      >
        {roles.map((role) => (
          <Picker.Item key={role.id} label={role.label} value={role.id} />
        ))}
      </Picker>


      <Button title="Kaydet" onPress={handleSave} color="#4b5c75" />
    </View>
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
  picker: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
});

export default UserForm;
