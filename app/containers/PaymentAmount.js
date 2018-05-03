/**
 * Created by yaoyirui on 2017/9/8.
 */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import PaymentAmountInnerPage from "./PaymentAmountInnerPage";

import ModalPaymentConfirm from "./ModalPaymentConfirm";
import ModalRechargeSuccess from "./ModalRechargeSuccess";
import {NavigationActions} from "../utils";
import {runAfterInteractionsWithToast} from "../utils/interactionManagerUtils";

const {width} = Dimensions.get('window');

@connect(({app, customer, payment}) => {
  return {
    operatorCode: app.operCode,
    customerDetail: customer.customerDetail,
    ...payment
  }
})
class PaymentAmount extends PureComponent {

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(NavigationActions.back());
    })
  }


  render() {
    const {operatorCode, dispatch, openPaymentConfirmModal, params, onDemandOrNot} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.viewTop}>
          <View style={styles.viewInViewTopInnerLeft}>
            <TouchableOpacity onPress={this.goBack}>
              <Image
                style={styles.imageInTopViewInnerLeft}
                source={require('../images/back.png')}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.topTextStyle}>{(onDemandOrNot ? '按次点播' : '预存') + '缴费'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
          <PaymentAmountInnerPage onDemandOrNot={onDemandOrNot}/>
        </ScrollView>
        <ModalPaymentConfirm isOpenModal={openPaymentConfirmModal}
                             dispatch={dispatch}
                             params={{...params}}
                             onDemandOrNot={onDemandOrNot}
        />
        <ModalRechargeSuccess goBack={this.goBack}/>
      </View>
    )
  }
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  icon: {
    width: 32,
    height: 32,
  },
  imageInTopViewInnerLeft: {
    width: 20,
    height: 20
  },
  viewTop: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: borderColor,
    borderBottomWidth: borderWhith
  },
  viewInViewTopInnerLeft: {
    width: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewInViewTopInnerRight: {
    width: 30
  },
  topTextStyle: {
    fontSize: 18,
    marginLeft: 10
  },
  viewSecond: {
    height: 50,
    width: width - 40,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor
  },
  textInViewSecond: {
    fontSize: 15,
    alignSelf: 'center'
  },
  viewThree: {
    height: 10,
    borderColor: borderColor,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith
  },
  viewFour: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  viewFourInner: {
    height: 50,
    width: width * 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
})

export default PaymentAmount
