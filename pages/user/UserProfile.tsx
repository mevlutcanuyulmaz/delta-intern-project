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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
            style={{ marginLeft: 15 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

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


        </View>

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
            <Text style={styles.label}>{t.userProfile.role}</Text>
            <Text style={styles.value}>{profile?.role?.name}</Text>
          </View>
        </View>

        {/* Şifre Değiştir */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lock-reset" size={24} color="#4b5c75" />
            <Text style={styles.sectionTitle}>{t.userProfile.changePassword}</Text>
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder={t.userProfile.currentPassword}
              secureTextEntry={!showCurrentPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <MaterialCommunityIcons
                name={showCurrentPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t.userProfile.newPassword}
              secureTextEntry={!showNewPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <MaterialCommunityIcons
                name={showNewPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t.userProfile.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
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
  passwordContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
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