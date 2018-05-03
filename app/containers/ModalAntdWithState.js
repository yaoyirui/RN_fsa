/**
 * Created by yaoyirui on 2017/11/7.
 */
import React, {PureComponent} from 'react';
import {Modal, ActivityIndicator} from 'antd-mobile';
import {StyleSheet, View, Text} from 'react-native'


class ModalAntdWithState extends PureComponent {

  static showOrClose = (callback) => {
    callback.call();
  }

  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  render() {

    return (
      <Modal ref={'modalLoading'}
             style={styles.modal}
             visible={this.state.visible}
             transparent={true}
             maskClosable={false}
      >
        <View style={styles.viewInnerModal}>
          <ActivityIndicator size={"large"} color={"red"}/>
          <Text style={styles.text}>加载中...</Text>
        </View>

      </Modal>
    )
  }
}


const styles = StyleSheet.create({

  modal: {
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

export default ModalAntdWithState;
