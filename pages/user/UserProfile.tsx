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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import { UserInfo } from '../../types/types';

const UserProfile = () => {
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      Alert.alert('Hata', 'Profil bilgileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      Alert.alert('Başarılı', 'Şifre başarıyla güncellendi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Hata', 'Şifre değiştirme başarısız. Mevcut şifrenizi kontrol edin.');
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b5c75" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>
      
      {/* Genel Bilgiler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="account-circle" size={24} color="#4b5c75" />
          <Text style={styles.sectionTitle}>Genel Bilgiler</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>Departman</Text>
          <Text style={styles.value}>{profile?.departmentName || profile?.department?.name || 'Atanmamış'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>Şirket</Text>
          <Text style={styles.value}>{profile?.company?.name || 'Bilinmiyor'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{profile?.role?.name}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Katılım Tarihi</Text>
          <Text style={styles.value}>{formatJoinDate(profile?.createdAt || '')}</Text>
        </View>
      </View>

      {/* Kişisel Bilgiler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="account-edit" size={24} color="#4b5c75" />
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>Ad</Text>
          <Text style={styles.value}>{profile?.name}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>Soyad</Text>
          <Text style={styles.value}>{profile?.surname}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.value}>{profile?.email}</Text>
        </View>

        {profile?.phone && (
          <View style={styles.infoItem}>
            <Text style={styles.label}>Telefon</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
        )}
      </View>

      {/* Şifre Değiştir */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="lock-reset" size={24} color="#4b5c75" />
          <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
        </View>
        
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Mevcut Şifre"
          secureTextEntry
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Yeni Şifre (En az 6 karakter)"
          secureTextEntry
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Yeni Şifre (Tekrar)"
          secureTextEntry
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Icon name="check" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Şifre Değiştir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 16,
    marginBottom: 8,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4b5c75',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;