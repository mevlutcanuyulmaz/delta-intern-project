import React, { useEffect } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { LanguageProvider } from './localization';
import { OneSignal } from 'react-native-onesignal';
import { AppNavigator } from './navigation/AppNavigator';

const linking: LinkingOptions<any> = {
  prefixes: [
    'myapp://', 
    'https://frontend-url',
    'http://frontend-url',
    'http://localhost:5173'
  ],
  config: {
    screens: {
      Login: 'login',
      Activation: 'activate',
    }
  }
};

const App = () => {
  useEffect(() => {
    OneSignal.initialize('5463a6aa-f037-4a2a-955c-aa3c4c35c54a');
    OneSignal.Notifications.requestPermission(false);
  }, []);

  return (
    <LanguageProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
};

export default App;
