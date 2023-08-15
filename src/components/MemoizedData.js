import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const RenderData = ({item}) => {
  return (
    <View style={styles.container}>
    <View style={{flexDirection:'row',alignItems:'center'}}>
    <Text style={{fontWeight:'600',color:'#151515',fontSize:moderateScale(15)}}>{'Code: '}</Text>
    <Text style={{fontWeight:'400',color:'#151515',fontSize:moderateScale(15)}}>{item?.code}</Text>
    </View>
    <View style={{flexDirection:'row',alignItems:'center'}}>
    <Text style={{fontWeight:'600',color:'#151515',fontSize:moderateScale(15)}}>{'Name: '}</Text>
    <Text style={{fontWeight:'400',color:'#151515',fontSize:moderateScale(15)}}>{item?.name}</Text>
    </View>
      
    </View>
  );
};

export const MemoizedRenderData = React.memo(RenderData);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1),
    borderColor: 'black',
    marginBottom: moderateScale(10),
  },
});
