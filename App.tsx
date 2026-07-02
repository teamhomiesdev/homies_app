import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppNavigator from './src/navigation/AppNavigator';
import { store, persistor } from './src/redux/store';

// Import Toast and the global ref registration helper
import { Toast, registerToastRef } from './src/components/Toast/Toast';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <View style={styles.container}>
              {/* Core Application Navigation Stack */}
              <AppNavigator />

              {/* Global Toast Component Mount Point */}
              <Toast ref={(ref) => registerToastRef(ref)} />
            </View>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Ensures consistent theme base styling
  },
});