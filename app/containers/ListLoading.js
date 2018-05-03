/**
 * Created by yaoyirui on 2017/9/14.
 */
import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

const ListLoading = ({loading}) => {
  if (loading) {
    return <View style={styles.viewLoading}>
      <ActivityIndicator size="large" color="red"/>
      <Text style={styles.text}>加载中...</Text>
    </View>
  }
  return <View/>
}

const styles = StyleSheet.create({

  viewLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    height: 100
  },
  text: {
    color: "black",
    fontSize: 20,
    alignSelf: 'center'
  }
});

export default ListLoading;
