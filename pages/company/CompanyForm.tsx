import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, TextInput, Text, Switch, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

type CompanyFormProps = {
  route: RouteProp<{ params: { companyId: number } }, 'params'>;
};

const CompanyForm = () => {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const { params } = useRoute<CompanyFormProps['route']>();
  const companyId = params.companyId;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addressDetail, setAddressDetail] = useState('');
  const [town, setTown] = useState<{
    id: number;
    name: string;
    city: string | null;
    region: string | null;
  } | null>(null);
  const [towns, setTowns] = useState<{ id: number; name: string }[]>([]);
  
  // Yeni state'ler
  const [regions, setRegions] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginLeft: 15 }}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleLogout = () => {
    // Çıkış işlemi burada yapılacak
    navigation.navigate('Login');
  };

  // Şirket bilgilerini çek
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/api/companies/${companyId}`);
        const data = response.data;
        setName(data.name);
        setShortName(data.shortName);
        setActive(data.active);
        setAddressDetail(data.addressDetail || '');
        setTown(data.town || null);
        
        // Eğer town bilgisi varsa, ilgili bölge ve şehir bilgilerini de set et
        if (data.town) {
          try {
            // İlçe detayını çek
            const townResponse = await api.get(`/api/location/town/${data.town.id}`);
            const townDetail = townResponse.data;
            
            // Bölgeleri çek
            const regionResponse = await api.get('/api/location/region');
            const regionList = regionResponse.data;
            setRegions(regionList);
            
            // Bölge eşleşmesini bul
            const matchedRegion = regionList.find((r: any) => r.name === townDetail.region);
            if (matchedRegion) {
              setSelectedRegion(matchedRegion.id);
              
              // Şehirleri çek (bölgeye göre filtrelenmiş)
              try {
                const cityResponse = await api.get(`/api/location/city?regionId=${matchedRegion.id}`);
                setCities(cityResponse.data);
                
                // Şehir eşleşmesini bul
                const matchedCity = cityResponse.data.find((c: any) => c.name === townDetail.city);
                if (matchedCity) {
                  setSelectedCity(matchedCity.id);
                  
                  // İlçeleri çek (şehre göre filtrelenmiş)
                  try {
                    const townListResponse = await api.get(`/api/location/town?cityId=${matchedCity.id}`);
                    setTowns(townListResponse.data);
                  } catch (err) {
                    // Filtreleme desteklenmiyorsa tüm ilçeleri çek
                    const allTownsResponse = await api.get('/api/location/town');
                    setTowns(allTownsResponse.data);
                  }
                }
              } catch (err) {
                // Filtreleme desteklenmiyorsa tüm şehirleri çek
                const allCitiesResponse = await api.get('/api/location/city');
                setCities(allCitiesResponse.data);
                
                const matchedCity = allCitiesResponse.data.find((c: any) => c.name === townDetail.city);
                if (matchedCity) {
                  setSelectedCity(matchedCity.id);
                }
              }
            }
          } catch (townError) {
            console.error(t.companyForm.districtDetailsError, townError);
          }
        }
      } catch (error) {
        Alert.alert(t.common.error, t.companyForm.companyInfoError);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  // İlçeleri çek (başlangıçta boş liste)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('Token bulunamadı, ilçe verisi çekilemedi');
          return;
        }

        // Eğer bölgeler henüz yüklenmemişse (şirket verisi yoksa), bölgeleri çek
        if (regions.length === 0) {
          try {
            const regionResponse = await api.get('/api/location/region');
            setRegions(regionResponse.data);
          } catch (err) {
            console.error(t.companyForm.regionsError, err);
          }
        }
      } catch (err) {
        console.error('Başlangıç verileri alınamadı', err);
      }
    };

    // Sadece regions boşsa çek
    if (regions.length === 0) {
      fetchInitialData();
    }
  }, [regions]);

  // Bölge değiştiğinde şehirleri çek
  const handleRegionChange = async (regionId: number) => {
    setSelectedRegion(regionId);
    setSelectedCity(undefined); // Şehir seçimini sıfırla
    setTown(null); // İlçe seçimini sıfırla
    setTowns([]); // İlçe listesini temizle
    
    try {
      const response = await api.get(`/api/location/city?regionId=${regionId}`);
      setCities(response.data);
    } catch (err) {
      console.error(t.companyForm.citiesError, err);
      // Eğer filtreleme desteklenmiyorsa tüm şehirleri çek ve client-side filtrele
      try {
        const allCitiesResponse = await api.get('/api/location/city');
        const allCities = allCitiesResponse.data;
        // Burada bölgeye göre filtreleme yapılabilir (API'den gelen veriye göre)
        setCities(allCities);
      } catch (err2) {
        console.error(t.companyForm.allCitiesError, err2);
      }
    }
  };

  // Şehir değiştiğinde ilçeleri çek
  const handleCityChange = async (cityId: number) => {
    setSelectedCity(cityId);
    setTown(null); // İlçe seçimini sıfırla
    
    try {
      const response = await api.get(`/api/location/town?cityId=${cityId}`);
      setTowns(response.data);
    } catch (err) {
      console.error(t.companyForm.districtsError, err);
      // Eğer filtreleme desteklenmiyorsa tüm ilçeleri çek ve client-side filtrele
      try {
        const allTownsResponse = await api.get('/api/location/town');
        const allTowns = allTownsResponse.data;
        // Burada şehre göre filtreleme yapılabilir (API'den gelen veriye göre)
        setTowns(allTowns);
      } catch (err2) {
        console.error(t.companyForm.allDistrictsError, err2);
      }
    }
  };

  // İlçe değişince detaylarını getir (şehir ve bölge)
  const handleTownChange = async (townId: number) => {
    try {
      const response = await api.get(`/api/location/town/${townId}`);
      setTown(response.data);
    } catch (err) {
      console.error(t.companyForm.districtDetailsError, err);
      setTown(null);
    }
  };

const handleUpdate = async () => {
  try {
    const payload = {
      id: companyId,
      name,
      shortName,
      active,
      addressDetail,
      townId: town?.id || 1, // 🔧 İlçe seçilmemişse 1 gönder
    };

    console.log("📤 Gönderilen payload:", payload);
    console.log("🏢 Mevcut town:", town);
    console.log("🌍 Seçilen bölge:", selectedRegion);
    console.log("🏙️ Seçilen şehir:", selectedCity);

    const response = await api.put('/api/companies', payload);
    console.log("✅ Şirket güncellendi:", response.data);
    
    Alert.alert(t.common.success, t.companyForm.updateSuccess, [
      {
        text: t.common.ok,
        onPress: () => {
          // Güncelleme sonrası sayfayı yeniden yükle
          setLoading(true);
          // fetchCompany fonksiyonunu tekrar çağır
           const refetchCompany = async () => {
             try {
               const response = await api.get(`/api/companies/${companyId}`);
               const data = response.data;
               setName(data.name);
               setShortName(data.shortName);
               setActive(data.active);
               setAddressDetail(data.addressDetail || '');
               setTown(data.town || null);
               
               console.log("🔄 Yeniden yüklenen şirket verisi:", data);
               
               // Eğer town bilgisi varsa, ilgili bölge ve şehir bilgilerini de set et
               if (data.town && data.town.id) {
                 try {
                   // Önce tüm bölgeleri çek
                   const regionResponse = await api.get('/api/location/region');
                   const regionList = regionResponse.data;
                   setRegions(regionList);
                   
                   // Tüm şehirleri çek
                   const allCitiesResponse = await api.get('/api/location/city');
                   const allCities = allCitiesResponse.data;
                   
                   // Tüm ilçeleri çek
                   const allTownsResponse = await api.get('/api/location/town');
                   const allTowns = allTownsResponse.data;
                   setTowns(allTowns);
                   
                   // Seçili ilçeyi bul
                   const selectedTownData = allTowns.find((t: any) => t.id === data.town.id);
                   console.log("🏘️ Seçili ilçe verisi:", selectedTownData);
                   
                   if (selectedTownData) {
                     // Bu ilçenin hangi şehirde olduğunu bul
                     const townCity = allCities.find((c: any) => c.name === selectedTownData.city);
                     console.log("🏙️ İlçenin şehri:", townCity);
                     
                     if (townCity) {
                       setSelectedCity(townCity.id);
                       
                       // Şehre göre filtrelenmiş şehirleri set et
                       const cityRegion = regionList.find((r: any) => r.name === selectedTownData.region);
                       console.log("🌍 Şehrin bölgesi:", cityRegion);
                       
                       if (cityRegion) {
                         setSelectedRegion(cityRegion.id);
                         
                         // Bölgeye göre filtrelenmiş şehirleri set et
                         const filteredCities = allCities.filter((c: any) => c.region === cityRegion.name);
                         setCities(filteredCities);
                         
                         // Şehre göre filtrelenmiş ilçeleri set et
                         const filteredTowns = allTowns.filter((t: any) => t.city === townCity.name);
                         setTowns(filteredTowns);
                       }
                     }
                   }
                 } catch (locationError) {
                   console.error('Lokasyon bilgileri alınamadı', locationError);
                 }
               } else {
                 // Town bilgisi yoksa sadece bölgeleri yükle
                 try {
                   const regionResponse = await api.get('/api/location/region');
                   setRegions(regionResponse.data);
                 } catch (regionError) {
                   console.error('Bölgeler alınamadı', regionError);
                 }
               }
             } catch (error) {
               console.error('Şirket bilgisi yeniden alınamadı', error);
             } finally {
               setLoading(false);
             }
           };
          
          refetchCompany();
        }
      }
    ]);
  } catch (error: any) {
    console.error("❌ Güncelleme hatası:", error.response?.data || error.message);
    Alert.alert(t.common.error, t.companyForm.updateError);
  }
};

  if (loading) return <ActivityIndicator size="large" color="#4b5c75" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t.companyForm.companyName}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>{t.companyForm.shortName}</Text>
      <TextInput style={styles.input} value={shortName} onChangeText={setShortName} />

      <Text style={styles.label}>{t.companyForm.addressDetail}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={addressDetail}
        onChangeText={setAddressDetail}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>{t.companyForm.region}</Text>
      <Picker
        selectedValue={selectedRegion}
        onValueChange={handleRegionChange}
      >
        <Picker.Item label={t.companyForm.selectRegion} value={undefined} />
        {regions.map((region, index) => (
          <Picker.Item key={`region-${region.id}-${index}`} label={region.name} value={region.id} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.companyForm.city}</Text>
      <Picker
        selectedValue={selectedCity}
        onValueChange={handleCityChange}
        enabled={selectedRegion !== undefined}
      >
        <Picker.Item label={t.companyForm.selectCity} value={undefined} />
        {cities.map((city, index) => (
          <Picker.Item key={`city-${city.id}-${index}`} label={city.name} value={city.id} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.companyForm.district}</Text>
      <Picker
        selectedValue={town?.id}
        onValueChange={handleTownChange}
        enabled={selectedCity !== undefined}
      >
        <Picker.Item label={t.companyForm.selectDistrict} value={undefined} />
        {towns.map((t, index) => (
          <Picker.Item key={`town-${t.id}-${index}`} label={t.name} value={t.id} />
        ))}
      </Picker>

      <View style={styles.switchRow}>
        <Text style={styles.label}>{t.companyForm.active}</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <Button title={t.common.save} onPress={handleUpdate} color="#4b5c75" />
    </ScrollView>
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    padding: 8,
    marginTop: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
});

export default CompanyForm;
