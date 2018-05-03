/**
 * Created by lion on 2017/8/27.
 */
import React from 'react';
import Modal from 'react-native-modalbox';

import {
  StyleSheet,
  Text,
  ActivityIndicator
} from 'react-native';

const ModalBasic = ({isOpenModal}) =>
  <Modal style={styles.modal} position={"center"} isOpen={isOpenModal}
         animationDuration={0} backButtonClose={true} backdropPressToClose={false}>
    <ActivityIndicator
      color="red"
      size="large"
    />
    <Text style={styles.text}>加载中...</Text>
  </Modal>

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
    width: 200,
    padding: 38
  },
  text: {
    color: "black",
    fontSize: 20,
    alignSelf: 'center'
  }
});

export default ModalBasic;
