import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Button = ({onPress, loading=false,text}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(7),
        borderWidth: moderateScale(1),
        backgroundColor: '#5683f6',
        width: '40%',
      }}>
      {loading ? (
        <ActivityIndicator size={'small'} color={'white'} />
      ) : (
        <Text
          style={{
            fontWeight: '700',
            fontSize: moderateScale(13),
            color: 'white',
          }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
