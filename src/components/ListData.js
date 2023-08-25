import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {MemoizedRenderData} from './MemoizedData';

const ListData = ({data=[]}) => {
  const renderItem = ({item, index}) => {
    return <MemoizedRenderData item={item} />;
  };
  return (
    <View style={{marginTop: moderateScale(15), flex: 1, height: '75%'}}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={7}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        renderItem={(item, index) => renderItem(item, index)}
        ListEmptyComponent={() => {
          return (
            <View style={styles.nodata}>
              <Text>No data available</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ListData;
const styles = StyleSheet.create({
   
    nodata: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
   
  });
