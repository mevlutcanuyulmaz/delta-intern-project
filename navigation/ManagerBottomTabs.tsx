import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import ManagerUserList from '../pages/manager/ManagerUserList';
import ManagerProfile from '../pages/manager/ManagerProfile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const ManagerBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4b5c75',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ManagerDashboard"
        component={ManagerDashboard}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ManagerUserList"
        component={ManagerUserList}
        options={{
          title: 'Kullanıcılar',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ManagerProfile"
        component={ManagerProfile}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ManagerBottomTabs;