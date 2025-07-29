import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const UserProfile = ({ navigation }: any) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = () => {
    Alert.alert(
      t.userProfile.logoutTitle,
      t.userProfile.logoutMessage,
      [
        { text: t.userProfile.cancel, style: 'cancel' },
        { text: t.userProfile.logout, style: 'destructive', onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <LanguageSwitcher />
          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 16 }}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>{t.common.logout}</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleLogout, t]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/user/get-self');
      setProfile(response.data);
    } catch (error) {
      Alert.alert(t.userProfile.error, t.userProfile.profileLoadError);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t.userProfile.error, t.userProfile.fillAllFields);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t.userProfile.error, t.userProfile.passwordMismatch);
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t.userProfile.error, t.userProfile.passwordMinLength);
      return;
    }

    try {
      await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      Alert.alert(t.userProfile.success, t.userProfile.passwordChangeSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert(t.userProfile.error, t.userProfile.passwordChangeError);
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
        <Text style={styles.loadingText}>{t.userProfile.loading}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>{t.userProfile.title}</Text>
        
        {/* Genel Bilgiler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="account-circle" size={24} color="#4b5c75" />
            <Text style={styles.sectionTitle}>{t.userProfile.generalInfo}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.department}</Text>
            <Text style={styles.value}>{profile?.departmentName || profile?.department?.name || t.userProfile.unassigned}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.company}</Text>
            <Text style={styles.value}>{profile?.company?.name || t.userProfile.unknown}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.role}</Text>
            <Text style={styles.value}>{profile?.role?.name}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.joinDate}</Text>
            <Text style={styles.value}>{formatJoinDate(profile?.createdAt || '')}</Text>
          </View>
        </View>

        {/* Kişisel Bilgiler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="account-edit" size={24} color="#4b5c75" />
            <Text style={styles.sectionTitle}>{t.userProfile.personalInfo}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.name}</Text>
            <Text style={styles.value}>{profile?.name}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.surname}</Text>
            <Text style={styles.value}>{profile?.surname}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t.userProfile.email}</Text>
            <Text style={styles.value}>{profile?.email}</Text>
          </View>

          {profile?.phone && (
            <View style={styles.infoItem}>
              <Text style={styles.label}>{t.userProfile.phone}</Text>
              <Text style={styles.value}>{profile.phone}</Text>
            </View>
          )}
        </View>

        {/* Şifre Değiştir */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lock-reset" size={24} color="#4b5c75" />
            <Text style={styles.sectionTitle}>{t.userProfile.changePassword}</Text>
          </View>
          
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder={t.userProfile.currentPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t.userProfile.newPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t.userProfile.confirmPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Icon name="check" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t.userProfile.changePasswordButton}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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