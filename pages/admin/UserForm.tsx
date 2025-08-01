import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { RootStackParamList } from '../../navigation/types';

type UserFormRouteProp = RouteProp<RootStackParamList, 'UserForm'>;
type UserFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Department {
  id: number;
  name: string;
}

const UserForm = () => {
  const { t } = useLanguage();
  const route = useRoute<UserFormRouteProp>();
  const navigation = useNavigation<UserFormNavigationProp>();
  const { userId } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LanguageSwitcher />
          <TouchableOpacity 
            onPress={async () => {
              await AsyncStorage.removeItem('accessToken');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
            style={{ marginLeft: 16, marginRight: 16 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, t]);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number>(4); // Default: USER (4)
  const [isActive, setIsActive] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(!!userId);

  const roles = [
    { value: 4, label: t.roles.admin },
    { value: 5, label: t.roles.manager },
    { value: 6, label: t.roles.user },
  ];

  // Role string'den ID'ye çevirme fonksiyonu
  const getRoleIdFromString = (roleString: string): number => {
    switch (roleString) {
      case 'ADMIN': return 4;
      case 'MANAGER': return 5;
      case 'USER': return 6;
      default: return 6;
    }
  };


const fetchDepartments = async () => {
  try {
    const response = await api.get('/api/departments');
    setDepartments(response.data);
  } catch (error) {
    Alert.alert(t.common.error, t.adminUserForm.departmentsLoadError);
  }
};

const fetchUser = async () => {
  if (!userId) return;
  try {
    const response = await api.get(`/api/user/get-user-detail/${userId}`);
    const user = response.data;
    setName(user.name);
    setSurname(user.surname);
    setEmail(user.email);
    setDepartmentId(user.departmentId);
    
    // Role string'i ID'ye çevir
    if (user.role && typeof user.role === 'string') {
      setRoleId(getRoleIdFromString(user.role));
    } else if (user.role && user.role.name) {
      setRoleId(getRoleIdFromString(user.role.name));
    } else if (user.roleId) {
      setRoleId(user.roleId);
    }
    
    setIsActive(user.isActive);
  } catch (error) {
    Alert.alert(t.common.error, t.adminUserForm.userLoadError);
  }
};

useEffect(() => {
  fetchDepartments();
}, []);

useEffect(() => {
  if (userId) {
    fetchUser();
    setLoading(false);
  }
}, [userId]);

  const handleSave = async () => {
    if (!departmentId) {
      Alert.alert(t.adminUserForm.warning, t.adminUserForm.selectDepartmentWarning);
      return;
    }

    try {
      if (userId) {
        // Kullanıcı güncelleme - userId'yi body'de gönder
        const updateData = {
          id: userId,
          name,
          surname,
          email,
          departmentId,
          roleId, // roleId gönder
          isActive,
        };
        await api.put('/api/user/update-user', updateData);
      } else {
        // Yeni kullanıcı oluşturma
        const createData = {
          name,
          surname,
          email,
          departmentId,
          roleId, // roleId gönder
          isActive,
        };
        await api.post('/api/user/create-user', createData);
      }
      Alert.alert(t.common.success, t.adminUserForm.saveSuccess);
      navigation.goBack();
    } catch (error) {
      Alert.alert(t.common.error, t.adminUserForm.saveError);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{t.adminUserForm.name}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t.adminUserForm.name}
      />

      <Text style={styles.label}>{t.adminUserForm.surname}</Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder={t.adminUserForm.surname}
      />

      <Text style={styles.label}>{t.adminUserForm.email}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={t.adminUserForm.email}
        keyboardType="email-address"
      />

      <Text style={styles.label}>{t.adminUserForm.department}</Text>
      <Picker
        selectedValue={departmentId}
        onValueChange={(itemValue) => setDepartmentId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label={t.adminUserForm.selectDepartment} value="" />
        {departments.map((dept) => (
          <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.adminUserForm.role}</Text>
      <Picker
        selectedValue={roleId}
        onValueChange={(itemValue) => setRoleId(itemValue)}
        style={styles.picker}
      >
        {roles.map((roleItem) => (
          <Picker.Item key={roleItem.value} label={roleItem.label} value={roleItem.value} />
        ))}
      </Picker>

      <View style={styles.switchRow}>
        <Text style={styles.label}>{t.adminUserForm.isActiveLabel}</Text>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: '#767577', true: '#4b5c75' }}
          thumbColor={isActive ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

              <Button title={t.adminUserForm.save} onPress={handleSave} color="#4b5c75" />
      </ScrollView>
    </KeyboardAvoidingView>
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
