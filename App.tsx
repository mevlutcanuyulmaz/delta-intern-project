import React, { useEffect } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { LanguageProvider } from './localization';
import { OneSignal } from 'react-native-onesignal';
import { AppNavigator } from './navigation/AppNavigator';
import { Linking } from 'react-native';

const linking: LinkingOptions<any> = {
  prefixes: [
    'deltacompanyapp://',
    'https://delta-app.com',
    'http://localhost:5173',
    'http://localhost:5173/'
  ],
  config: {
    screens: {
      Login: 'login',
      Activation: {
        path: 'activate',
        parse: {
          token: (token: string) => `${token}`,
        },
      },
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => `${token}`,
        },
      },
    }
  }
};

const App = () => {
  useEffect(() => {
    OneSignal.initialize('5463a6aa-f037-4a2a-955c-aa3c4c35c54a');
    OneSignal.Notifications.requestPermission(false);

    // Deep linking debug için
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
    };

    // İlk açılışta URL kontrol et
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        handleDeepLink(url);
      }
    });

    // URL değişikliklerini dinle
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('URL changed:', url);
      handleDeepLink(url);
    });

    return () => {
      subscription?.remove();
    };
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
