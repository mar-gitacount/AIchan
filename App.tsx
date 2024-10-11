import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import TextAreaExample from './TextAreaExample'; // パスは実際の構造に合わせて調整してください

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TextAreaExample />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
});

export default App;