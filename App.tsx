import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/auth/LoginScreen';
import  { AdminBottomTabs, ManagerBottomTabs, UserBottomTabs } from './navigation/BottomTabs';
import UserForm from './pages/admin/UserForm';
import DepartmentTypeList from './pages/admin/DepartmentTypeList';
import DepartmentTypeForm from './pages/admin/DepartmentTypeForm';
import RegionList from './pages/admin/RegionList';
import RegionForm from './pages/admin/RegionForm';
import CityList from './pages/admin/CityList';
import CityForm from './pages/admin/CityForm';
import TownList from './pages/admin/TownList';
import TownForm from './pages/admin/TownForm';
import CompanyForm from './pages/company/CompanyForm';
import CreateCompany from './pages/company/CreateCompany';
import CompanyDetail from './pages/company/CompanyDetail';
import DepartmentDetailPage from './pages/company/DepartmentDetail';
import ActivationScreen from './pages/auth/ActivationScreen';
import ForgotPassword from './pages/auth/ForgotPasswordScreen';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import UserDashboard from './pages/user/UserDashboard';
import UserCompanyInfo from './pages/user/UserCompanyInfo';
import ManagerUserList from './pages/manager/ManagerUserList';
import ManagerCompanyList from './pages/manager/ManagerCompanyList';
import ManagerProfile from './pages/manager/ManagerProfile';
import UserProfile from './pages/user/UserProfile';
import { LanguageProvider } from './localization';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: [
    'myapp://', 
    'https://frontend-url',
    'http://frontend-url'
  ],
  config: {
    screens: {
      Login: 'login',
      Activation: 'activate',
    }
  }
};

const App = () => {
  return (
    <LanguageProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4b5c75',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Tabs" component={AdminBottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="UserForm" component={UserForm} options={{ title: 'Kullanıcı Formu' }} />
          <Stack.Screen name="DepartmentTypeList" component={DepartmentTypeList} options={{ title: 'Departman Türleri' }} />
          <Stack.Screen name="DepartmentTypeForm" component={DepartmentTypeForm} options={{ title: 'Departman Türü Formu' }} />
          <Stack.Screen name="RegionList" component={RegionList} options={{ title: 'Bölge Yönetimi' }} />
          <Stack.Screen name="RegionForm" component={RegionForm} options={{ title: 'Bölge Formu' }} />
          <Stack.Screen name="CityList" component={CityList} options={{ title: 'Şehir Yönetimi' }} />
          <Stack.Screen name="CityForm" component={CityForm} options={{ title: 'Şehir Formu' }} />
          <Stack.Screen name="TownList" component={TownList} options={{ title: 'İlçe Yönetimi' }} />
          <Stack.Screen name="TownForm" component={TownForm} options={{ title: 'İlçe Formu' }} />
          <Stack.Screen name="CompanyForm" component={CompanyForm} options={{ title: 'Şirket Formu' }} />
          <Stack.Screen name="CreateCompany" component={CreateCompany} options={{ title: 'Şirket Oluştur' }} />
          <Stack.Screen name="CompanyDetail" component={CompanyDetail} options={{ title: 'Şirket Detayı' }} />
          <Stack.Screen name="DepartmentDetail" component={DepartmentDetailPage} options={{ title: 'Departman Detayı' }} />
          <Stack.Screen name="Activation" component={ActivationScreen} options={{ title: 'Hesap Aktivasyonu' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Şifre Sıfırlama' }} />
          <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ title: 'Yönetici Paneli' }} />
          <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: 'Kullanıcı Paneli' }} />
          <Stack.Screen name="UserCompanyInfo" component={UserCompanyInfo} options={{ title: 'Şirket Bilgileri' }} />
          <Stack.Screen name="ManagerUserList" component={ManagerUserList} options={{ title: 'Kullanıcı Listesi' }} />
          <Stack.Screen name="ManagerCompanyList" component={ManagerCompanyList} options={{ title: 'Şirket Listesi' }} />
          <Stack.Screen name="ManagerBottomTabs" component={ManagerBottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="UserBottomTabs" component={UserBottomTabs} options={{ headerShown: false }} />
          
        
          <Stack.Screen 
            name="ManagerProfile" 
            component={ManagerProfile} 
            options={{ title: 'Profil' }}
          />
          <Stack.Screen 
            name="UserProfile" 
            component={UserProfile} 
            options={{ title: 'Profil' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;
