import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'
import { store } from './src/redux/store';
import AppStack from './src/AppStack';
import { navigationRef } from './src/navigation/RootNavigation';

const App = () => {

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <AppStack />
      </NavigationContainer>
    </Provider>
  );
}

export default App;