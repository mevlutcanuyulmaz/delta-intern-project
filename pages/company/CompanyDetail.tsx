import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import DepartmentList from './DepartmentList';

type CompanyDetailRouteProp = RouteProp<{ params: { id: number } }, 'params'>;

const CompanyDetail = () => {
  const { params } = useRoute<CompanyDetailRouteProp>();
  const companyId = params.id;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏢 Şirket Detay Sayfası</Text>

      <DepartmentList companyId={companyId} />
    </View>
  );
};

export default CompanyDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
});
