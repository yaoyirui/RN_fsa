/**
 * Created by yaoyirui on 2017/10/25.
 */

import React from 'react';
import {Modal, ActivityIndicator} from 'antd-mobile';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const LoadingInnerModal = () =>
  <View style={styles.innerModal}>
    <View style={styles.viewInnerModal}>
      <ActivityIndicator size={"large"} color={"red"}/>
      <Text style={styles.text}>加载中...</Text>
    </View>
  </View>

const styles = StyleSheet.create({

  innerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 160
  },
  viewInnerModal: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 5
  },
  text: {
    color: "black",
    fontSize: 20,
    marginBottom: 3
  }
});

export default LoadingInnerModal;
