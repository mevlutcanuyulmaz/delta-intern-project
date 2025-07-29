import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import api from '../../services/api';
import { DepartmentInfo, Town } from '../../types/types';
import { useLanguage } from '../../localization';

type DepartmentListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DepartmentList = ({ companyId }: { companyId: number }) => {
  const navigation = useNavigation<DepartmentListNavigationProp>();
  const { t } = useLanguage();
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
      console.error(t.departmentList.departmentsLoadError, err);
    }
  };

  const fetchTowns = async () => {
    try {
      const response = await api.get('/api/location/town');
      setTowns(response.data);
    } catch (err) {
      console.error(t.departmentList.districtsLoadError, err);
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
      Alert.alert(t.common.error, t.departmentList.nameRequired);
      return;
    }
    if (!addressDetailInput.trim()) {
      Alert.alert(t.common.error, t.departmentList.addressRequired);
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
        Alert.alert(t.common.success, t.departmentList.addSuccess);
      } catch (err) {
        Alert.alert(t.common.error, t.departmentList.addError);
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
        Alert.alert(t.common.success, t.departmentList.updateSuccess);
      } catch (err) {
        Alert.alert(t.common.error, t.departmentList.updateError);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/department/delete/${id}`);
      fetchDepartments();
    } catch (err) {
      Alert.alert(t.common.error, t.departmentList.deleteError);
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
        <Text style={styles.subtitle}>{t.departmentList.title}</Text>
        <TouchableOpacity onPress={openModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>{t.departmentList.addDepartment}</Text>
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
                <Text style={styles.buttonText}>{t.departmentList.detail}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(item)}
              >
                <Text style={styles.buttonText}>{t.departmentList.edit}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id || 0)}
              >
                <Text style={styles.buttonText}>{t.departmentList.delete}</Text>
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
                {editingId ? t.departmentList.editDepartment : t.departmentList.newDepartment}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{t.departmentList.departmentName}</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder={t.departmentList.departmentNamePlaceholder}
              style={styles.input}
            />

            <Text style={styles.label}>{t.departmentList.selectDistrict}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTownId}
                onValueChange={(itemValue) => setSelectedTownId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label={t.departmentList.selectDistrictPlaceholder} value={0} />
                {towns.map((town) => (
                  <Picker.Item key={town.id} label={town.name} value={town.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>{t.departmentList.addressDetail}</Text>
            <TextInput
              value={addressDetailInput}
              onChangeText={setAddressDetailInput}
              placeholder={t.departmentList.addressDetailPlaceholder}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  {editingId ? t.common.update : t.common.add}
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
