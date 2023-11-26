import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux'
import { store } from './src/redux/store';
import AppStack from './src/AppStack';
import { navigationRef } from './src/navigation/RootNavigation';
import AppContainer from './src/AppContainer';

const App = () => {

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <AppContainer />
      </NavigationContainer>
    </Provider>
  );
}

export default App;