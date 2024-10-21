import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import TextAreaExample from './TextAreaExample'; // パスは実際の構造に合わせて調整してください
import { GAMBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const App = () => {
  // const adUnitId = "ca-app-pub-3940256099942544/9214589741"; // 取得した広告ユニットIDをここに入れます
  const adUnitId = "ca-app-pub-2383157187090434/7837379645"; // 取得した広告ユニットIDをここに入れます

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TextAreaExample />
      <View style={styles.adContainer}>
        <GAMBannerAd
          unitId={adUnitId}
          sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(error) => {
            console.error('Ad failed to load: ', error);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  adContainer: {
    margin: 10,
  },
});

export default App;
