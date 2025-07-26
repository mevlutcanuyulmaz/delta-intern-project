import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/auth/LoginScreen';
import BottomTabs from './navigation/BottomTabs';
import UserForm from './pages/user/UserForm';
import CompanyForm from './pages/company/CompanyForm';
import CreateCompany from './pages/company/CreateCompany';
import CompanyDetail from './pages/company/CompanyDetail';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
<NavigationContainer>
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Tabs" component={BottomTabs} options={{ headerShown: false }} />
    <Stack.Screen name="UserForm" component={UserForm} options={{ title: 'Kullanıcı Formu' }} />
    <Stack.Screen name="CompanyForm" component={CompanyForm} options={{ title: 'Şirket Formu' }} />
    <Stack.Screen name="CreateCompany" component={CreateCompany} options={{ title: 'Şirket Oluştur' }} />
    <Stack.Screen name="CompanyDetail" component={CompanyDetail} options={{ title: 'Şirket Detayı' }} />



  </Stack.Navigator>
</NavigationContainer>

  );
};

export default App;
