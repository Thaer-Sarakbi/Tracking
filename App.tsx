import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'
import { store } from './src/redux/store';
import AppStack from './src/AppStack';

const App = () => {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </Provider>
  );
}

export default App;