import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/auth/LoginScreen';
import { AdminBottomTabs, ManagerBottomTabs, UserBottomTabs } from './BottomTabs';
import UserForm from '../pages/admin/UserForm';
import DepartmentTypeList from '../pages/admin/DepartmentTypeList';
import DepartmentTypeForm from '../pages/admin/DepartmentTypeForm';
import CompanyTypeList from '../pages/admin/CompanyTypeList';
import CompanyTypeForm from '../pages/admin/CompanyTypeForm';
import RegionList from '../pages/admin/RegionList';
import RegionForm from '../pages/admin/RegionForm';
import CityList from '../pages/admin/CityList';
import CityForm from '../pages/admin/CityForm';
import TownList from '../pages/admin/TownList';
import TownForm from '../pages/admin/TownForm';
import CompanyForm from '../pages/company/CompanyForm';
import CreateCompany from '../pages/company/CreateCompany';
import CompanyDetail from '../pages/company/CompanyDetail';
import DepartmentDetailPage from '../pages/company/DepartmentDetail';
import ActivationScreen from '../pages/auth/ActivationScreen';
import ForgotPassword from '../pages/auth/ForgotPasswordScreen';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import UserDashboard from '../pages/user/UserDashboard';
import UserCompanyInfo from '../pages/user/UserCompanyInfo';
import ManagerUserList from '../pages/manager/ManagerUserList';
import ManagerCompanyList from '../pages/manager/ManagerCompanyList';
import ManagerProfile from '../pages/manager/ManagerProfile';
import UserProfile from '../pages/user/UserProfile';
import { useLanguage } from '../localization';

const Stack = createNativeStackNavigator();
export const AppNavigator = () => {
  const { t } = useLanguage();
  return (
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
        <Stack.Screen name="UserForm" component={UserForm} options={{ title: t.navigation.userForm }} />
        <Stack.Screen name="DepartmentTypeList" component={DepartmentTypeList} options={{ title: t.navigation.departmentTypeList }} />
        <Stack.Screen name="DepartmentTypeForm" component={DepartmentTypeForm} options={{ title: t.navigation.departmentTypeForm }} />
        <Stack.Screen name="CompanyTypeList" component={CompanyTypeList} options={{ title: t.navigation.companyTypeList }} />
        <Stack.Screen name="CompanyTypeForm" component={CompanyTypeForm} options={{ title: t.navigation.companyTypeForm }} />
        <Stack.Screen name="RegionList" component={RegionList} options={{ title: t.navigation.regionList }} />
        <Stack.Screen name="RegionForm" component={RegionForm} options={{ title: t.navigation.regionForm }} />
        <Stack.Screen name="CityList" component={CityList} options={{ title: t.navigation.cityList }} />
        <Stack.Screen name="CityForm" component={CityForm} options={{ title: t.navigation.cityForm }} />
        <Stack.Screen name="TownList" component={TownList} options={{ title: t.navigation.townList }} />
        <Stack.Screen name="TownForm" component={TownForm} options={{ title: t.navigation.townForm }} />
        <Stack.Screen name="CompanyForm" component={CompanyForm} options={{ title: t.navigation.companyForm }} />
        <Stack.Screen name="CreateCompany" component={CreateCompany} options={{ title: t.navigation.createCompany }} />
        <Stack.Screen name="CompanyDetail" component={CompanyDetail} options={{ title: t.navigation.companyDetail }} />
        <Stack.Screen name="DepartmentDetail" component={DepartmentDetailPage} options={{ title: t.navigation.departmentDetail }} />
    <Stack.Screen name="Activation" component={ActivationScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ title: t.navigation.managerDashboard }} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ title: t.navigation.userDashboard }} />
        <Stack.Screen name="UserCompanyInfo" component={UserCompanyInfo} options={{ title: t.navigation.companyInfo }} />
        <Stack.Screen name="ManagerUserList" component={ManagerUserList} options={{ title: t.navigation.managerUserList }} />
        <Stack.Screen name="ManagerCompanyList" component={ManagerCompanyList} options={{ title: t.navigation.managerCompanyList }} />
    <Stack.Screen name="ManagerBottomTabs" component={ManagerBottomTabs} options={{ headerShown: false }} />
    <Stack.Screen name="UserBottomTabs" component={UserBottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ManagerProfile" component={ManagerProfile} options={{ title: t.navigation.profile }} />
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: t.navigation.profile }} />
    </Stack.Navigator>
  );
};