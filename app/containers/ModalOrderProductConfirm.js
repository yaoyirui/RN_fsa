/**
 * Created by yaoyirui on 2017/11/16.
 */
import React from 'react';
import Modal from 'react-native-modalbox';

import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import {createAction} from '../utils'
import OrderProductConfirm from './OrderProductConfirm'
import OrderProductConfirmSFC from './OrderProductConfirmSFC'

var width = Dimensions.get('window').width

function ModalOrderProductConfirm({showOrderProductConfirmModal, chooseSubscriber, chooseProducts, calculate, params, dispatch}) {
  const closeModal = () => {
    dispatch(createAction('product/closeOrderProductConfirmModal')())
  }
  return <Modal style={styles.modal}
                position={'center'}
                isOpen={showOrderProductConfirmModal}
                swipeToClose={false}
                animationDuration={0}
                onClose={closeModal}
  >
    <View style={{flex: 1, width: width - 20}}>
      <View style={styles.viewTop}>
        <View style={styles.viewTopBetween}/>
        <View style={styles.viewTopCenter}>
          <Text style={styles.textInTopView}>确认订购产品</Text>
        </View>
        <View style={styles.viewTopBetween}>
          <TouchableOpacity onPress={() => {
            closeModal()
          }}>
            <Image
              style={styles.ic_icon}
              source={require('../images/del.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
        <OrderProductConfirmSFC params={params} chooseSubscriber={chooseSubscriber} chooseProducts={chooseProducts}
                                calculate={calculate}/>
      </ScrollView>
    </View>
  </Modal>
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    height: 450,
    width: width - 20,
    borderRadius: 7,
    paddingBottom: 7
  },
  textInTopView: {
    fontSize: 20,
    alignSelf: 'center'
  },
  viewTop: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    width: width - 10,
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewTopBetween: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingRight: 10
  },
  viewTopCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 2,
  },
  ic_icon: {
    width: 35,
    height: 35
  },
});

export default ModalOrderProductConfirm;
