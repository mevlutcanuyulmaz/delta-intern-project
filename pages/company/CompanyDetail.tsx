import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import DepartmentList from './DepartmentList';

type CompanyDetailRouteProp = RouteProp<{ params: { id: number } }, 'params'>;

const CompanyDetail = () => {
  const { params } = useRoute<CompanyDetailRouteProp>();
  const companyId = params.id;
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ marginLeft: 15 }}
          >
            <Icon name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.companyDetail.title}</Text>

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
