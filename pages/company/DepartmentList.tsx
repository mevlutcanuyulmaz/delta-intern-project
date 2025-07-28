import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { DepartmentInfo, Town } from '../../types/types';

const DepartmentList = ({ companyId }: { companyId: number }) => {
  const navigation = useNavigation();
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [addressDetailInput, setAddressDetailInput] = useState('');
  const [selectedTownId, setSelectedTownId] = useState<number>(1);
  const [towns, setTowns] = useState<Town[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/api/departments');
      const filtered = res.data.filter((d: DepartmentInfo) => d.company?.id === companyId);
      setDepartments(filtered);
    } catch (err) {
      console.error('Departmanlar alınamadı', err);
    }
  };

  const fetchTowns = async () => {
    try {
      const response = await api.get('/api/location/town');
      setTowns(response.data);
    } catch (err) {
      console.error('İlçeler alınamadı', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchTowns();
  }, []);

  const openModal = () => {
    setNameInput('');
    setAddressDetailInput('');
    setSelectedTownId(1);
    setEditingId(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNameInput('');
    setAddressDetailInput('');
    setSelectedTownId(1);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      Alert.alert('Hata', 'Departman adı boş olamaz');
      return;
    }
    if (!addressDetailInput.trim()) {
      Alert.alert('Hata', 'Adres detayı boş olamaz');
      return;
    }

    if (editingId === null) {
      // Ekleme işlemi
      try {
        await api.post('/api/departments', {
          name: nameInput,
          companyId,
          departmentTypeId: 1,
          townId: selectedTownId,
          addressDetail: addressDetailInput,
        });
        closeModal();
        fetchDepartments();
        Alert.alert('Başarılı', 'Departman başarıyla eklendi');
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
          townId: selectedTownId,
          addressDetail: addressDetailInput,
        });
        closeModal();
        fetchDepartments();
        Alert.alert('Başarılı', 'Departman başarıyla güncellendi');
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

  const startEditing = (item: DepartmentInfo) => {
    setNameInput(item.name || '');
    // Not: DepartmentInfo interface'inde addressDetail ve townId yok, 
    // bu yüzden varsayılan değerler kullanıyoruz
    setAddressDetailInput('');
    setSelectedTownId(1);
    setEditingId(item.id || 0);
    setModalVisible(true);
  };

  const navigateToDepartmentDetail = (departmentId: number) => {
    navigation.navigate('DepartmentDetail', { departmentId });
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Departmanlar</Text>
        <TouchableOpacity onPress={openModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Departman Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={departments}
        keyExtractor={(item) => (item.id || 0).toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.departmentName}>{item.name}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigateToDepartmentDetail(item.id || 0)}
              >
                <Text style={styles.buttonText}>Detay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(item)}
              >
                <Text style={styles.buttonText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id || 0)}
              >
                <Text style={styles.buttonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Departman Düzenle' : 'Yeni Departman Ekle'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Departman Adı</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Departman adı girin"
              style={styles.input}
            />

            <Text style={styles.label}>İlçe Seçin</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTownId}
                onValueChange={(itemValue) => setSelectedTownId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="İlçe seçin..." value={0} />
                {towns.map((town) => (
                  <Picker.Item key={town.id} label={town.name} value={town.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Adres Detayı</Text>
            <TextInput
              value={addressDetailInput}
              onChangeText={setAddressDetailInput}
              placeholder="Adres detayı girin"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Güncelle' : 'Ekle'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DepartmentList;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginVertical: 8,
  },
  picker: {
    height: 50,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailButton: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4b5c75',
    padding: 8,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4b5c75',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
