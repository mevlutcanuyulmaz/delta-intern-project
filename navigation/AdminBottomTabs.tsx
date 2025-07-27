import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CompanyList from '../pages/company/CompanyList';
import UserList from '../pages/admin/UserList';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4b5c75',
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Icon name="crown-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CompanyList"
        component={CompanyList}
        options={{
          title: 'Şirketler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="UserList"
        component={UserList}
        options={{
          title: 'Kullanıcılar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
