import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Qrscan = ({onPress}) => {
  return (
    <View style={styles.firstIndexRootView}>
      <View style={styles.rootView}>
        <Text style={styles.headingText}>Scan QR Code</Text>
        <Text style={styles.text}>
          You can scan cards continuously , when your desire data show on screen
          press tab to store your data and data will be save on scanned cards
          tab
        </Text>
      </View>
      <Image source={require('../assets/qcode.png')} style={styles.image} />
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.touchableStyle,
          backgroundColor: '#5683f6',
        }}>
        <Text
          style={{
            ...styles.toggleText,
            color: 'white',
          }}>
          Scan Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Qrscan;
const styles = StyleSheet.create({
  touchableStyle: {
    width: moderateScale(140),
    paddingVertical: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(7),
    //   height:50
  },
  rootView: {
    width: '90%',
    borderRadius: moderateScale(6),
    backgroundColor: '#eff0f3',
    padding: moderateScale(10),
    marginTop: moderateScale(25),
  },
  toggleText: {
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
  headingText: {
    color: '#151515',
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: moderateScale(10),
  },
  text: {
    color: '#151515',
    fontSize: moderateScale(14),
    fontWeight: '400',
    textAlign: 'center',
  },
  image: {
    width: moderateScale(250),
    height: moderateScale(250),
    marginVertical: moderateScale(20),
  },
  firstIndexRootView: {
    marginTop: moderateScale(15),
    flex: 1,
    alignItems: 'center',
  },
});
