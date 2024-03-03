import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'
import { store } from './src/redux/store';
import { navigationRef } from './src/navigation/RootNavigation';
import AppContainer from './src/AppContainer';
import SplashScreen from 'react-native-splash-screen'

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  },[])
  
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <AppContainer />
      </NavigationContainer>
    </Provider>
  );
}

export default App;