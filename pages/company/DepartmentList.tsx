import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import api from '../../services/api';

interface Department {
  id: number;
  name: string;
  company: { id: number };
}

const DepartmentList = ({ companyId }: { companyId: number }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/api/departments');
      const filtered = res.data.filter((d: Department) => d.company.id === companyId);
      setDepartments(filtered);
    } catch (err) {
      console.error('Departmanlar alınamadı', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async () => {
    if (!nameInput.trim()) return;

    if (editingId === null) {
      // Ekleme işlemi
      try {
        await api.post('/api/departments', {
          name: nameInput,
          companyId,
          departmentTypeId: 1,
          townId: 1,
          addressDetail: 'Merkez',
        });
        setNameInput('');
        fetchDepartments();
      } catch (err) {
        Alert.alert('Hata', 'Departman eklenemedi');
      }
    } else {
      // Güncelleme işlemi
      try {
        await api.put('/api/departments', {
          id: editingId,
          name: nameInput,
          companyId,
          departmentTypeId: 1,
          townId: 1,
          addressDetail: 'Merkez',
        });
        setNameInput('');
        setEditingId(null);
        fetchDepartments();
      } catch (err) {
        Alert.alert('Hata', 'Departman güncellenemedi');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/department/delete/${id}`);
      fetchDepartments();
    } catch (err) {
      Alert.alert('Hata', 'Silinemedi');
    }
  };

  const startEditing = (item: Department) => {
    setNameInput(item.name);
    setEditingId(item.id);
  };

  return (
    <View>
      <Text style={styles.subtitle}>Departmanlar</Text>

      <FlatList
        data={departments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(item)}
              >
                <Text style={{ color: 'white' }}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: 'white' }}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TextInput
        value={nameInput}
        onChangeText={setNameInput}
        placeholder="Yeni departman adı"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSave} style={styles.addButton}>
        <Text style={styles.addButtonText}>{editingId ? 'Güncelle' : 'Ekle'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DepartmentList;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#4b5c75',
    padding: 6,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#4b5c75',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
