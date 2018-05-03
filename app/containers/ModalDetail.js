/**
 * Created by yaoyirui on 2017/9/20.
 */
import React from 'react';
import Modal from 'react-native-modalbox';
import {createAction} from '../utils'
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import {runAfterInteractionsBasic} from '../utils/interactionManagerUtils'

import CustomerDetailInnerPage from './CustomerDetailInnerPage';

var width = Dimensions.get('window').width


const ModalDetail = ({isOpenModal, dispatch}) => {
  const closeModal = () => {
    runAfterInteractionsBasic(() => {
      dispatch(createAction('customer/closeCustomerDetail')())
    })
  }
  return <Modal style={styles.modal}
                position={'center'}
                isOpen={isOpenModal}
                swipeToClose={false}
                animationDuration={0}
                backdropPressToClose={false}
  >
    <View style={{flex: 1, width: width - 10}}>
      <View style={styles.viewTop}>
        <View style={styles.viewTopBetween}/>
        <View style={styles.viewTopCenter}>
          <Text style={styles.textInTopView}>客户详情</Text>
        </View>
        <View style={styles.viewTopBetween}>
          <TouchableOpacity onPress={closeModal}>
            <Image
              style={styles.ic_icon}
              source={require('../images/del.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
        <CustomerDetailInnerPage/>
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
    height: 550,
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
    height: 50,
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

export default ModalDetail;
