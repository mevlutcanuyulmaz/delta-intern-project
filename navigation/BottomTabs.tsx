import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import CompanyList from '../pages/company/CompanyList';
import UserList from '../pages/admin/UserList';

// Manager pages
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import ManagerUserList from '../pages/manager/ManagerUserList';
import ManagerProfile from '../pages/manager/ManagerProfile';

// User pages
import UserDashboard from '../pages/user/UserDashboard';
import UserCompanyInfo from '../pages/user/UserCompanyInfo';
import UserProfile from '../pages/user/UserProfile';

const Tab = createBottomTabNavigator();

interface BottomTabsProps {
  userRole: 'admin' | 'manager' | 'user';
}

const BottomTabs: React.FC<BottomTabsProps> = ({ userRole }) => {
  const { t } = useLanguage();
  
  const commonScreenOptions = {
    tabBarActiveTintColor: '#4b5c75',
    tabBarInactiveTintColor: 'gray',
    headerShown: true,
    headerStyle: {
      backgroundColor: '#4b5c75',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold' as 'bold',
    },
  };

  if (userRole === 'admin') {
    return (
      <Tab.Navigator screenOptions={commonScreenOptions}>
        <Tab.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            title: t.bottomTabs.admin,
            tabBarIcon: ({ color, size }) => (
              <IoniconsIcon name="crown-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="CompanyList"
          component={CompanyList}
          options={{
            title: t.bottomTabs.companies,
            tabBarIcon: ({ color, size }) => (
              <IoniconsIcon name="business-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="UserList"
          component={UserList}
          options={{
            title: t.bottomTabs.users,
            tabBarIcon: ({ color, size }) => (
              <IoniconsIcon name="people-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  if (userRole === 'manager') {
    return (
      <Tab.Navigator screenOptions={commonScreenOptions}>
        <Tab.Screen
          name="ManagerDashboard"
          component={ManagerDashboard}
          options={{
            title: t.bottomTabs.home,
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ManagerUserList"
          component={ManagerUserList}
          options={{
            title: t.bottomTabs.users,
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-group" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ManagerProfile"
          component={ManagerProfile}
          options={{
            title: t.bottomTabs.profile,
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-circle" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // userRole === 'user'
  return (
    <Tab.Navigator screenOptions={commonScreenOptions}>
      <Tab.Screen
        name="UserDashboard"
        component={UserDashboard}
        options={{
          title: t.bottomTabs.home,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="UserCompanyInfo"
        component={UserCompanyInfo}
        options={{
          title: t.bottomTabs.companyInfo,
          tabBarIcon: ({ color, size }) => (
            <Icon name="office-building" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: t.bottomTabs.profile,
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Backward compatibility exports
export const AdminBottomTabs = () => <BottomTabs userRole="admin" />;
export const ManagerBottomTabs = () => <BottomTabs userRole="manager" />;
export const UserBottomTabs = () => <BottomTabs userRole="user" />;

export default BottomTabs;