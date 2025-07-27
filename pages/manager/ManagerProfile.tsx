import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import api from '../../services/api';

interface UserProfile {
  id: number;
  name: string;
  surname: string;
  email: string;
  departmentName: string;
  departmentId: number;  // Eksik olan alan eklendi
  role: {
    name: string;
  };
}

const ManagerProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/user/get-self');
      setProfile(response.data);
      setName(response.data.name);
      setSurname(response.data.surname);
      setEmail(response.data.email);
    } catch (error) {
      Alert.alert('Hata', 'Profil bilgileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/api/user/update-user', {
        id: profile?.id,
        name,
        surname,
        email,
        departmentId: profile?.departmentId
      });
      Alert.alert('Başarılı', 'Profil bilgileri güncellendi');
      fetchProfile();
    } catch (error) {
      Alert.alert('Hata', 'Güncelleme başarısız');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    try {
      await api.post('/api/auth/reset-password', {
        token: currentPassword, // Burada backend'in beklediği formata göre ayarlayın
        newPassword,
        confirmPassword
      });
      Alert.alert('Başarılı', 'Şifre başarıyla güncellendi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Hata', 'Şifre değiştirme başarısız');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Departman</Text>
        <Text style={styles.value}>{profile?.departmentName}</Text>
        
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{profile?.role.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ad"
        />
        <TextInput
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
          placeholder="Soyad"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Bilgileri Güncelle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Mevcut Şifre"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Yeni Şifre"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Yeni Şifre (Tekrar)"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Şifre Değiştir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4b5c75',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManagerProfile;