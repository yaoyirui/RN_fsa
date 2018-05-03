/**
 * Created by yaoyirui on 2017/10/26.
 */

import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'

@connect(({customer, app, payment}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment
    }
  }
)
class ModalRechargeSuccess extends PureComponent {


  closeRechargeSuccessModal = () => {
    this.props.dispatch(createAction('payment/closeRechargeSuccessModal')())
  }

  render() {

    const {
      customerBasicInfo, goBack
    } = this.props;
    const {
      payAmount
    } = this.props.params


    return (
      <Modal style={styles.modal}
             visible={this.props.showChargeSuccess}
             transparent={true}
             maskClosable={false}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>缴费成功</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeRechargeSuccessModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewOne}>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'您已为客户 '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{customerBasicInfo.customerName}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'成功缴费   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{payAmount}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'帐户余额   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{customerBasicInfo.accountBalance}</Text>
            </View>
          </View>
          <View style={styles.viewOneBottom}>
            <TouchableOpacity onPress={() => {
              goBack()
              this.closeRechargeSuccessModal()
            }}>
              <View style={styles.viewButton1}>
                <Text style={styles.text1Style}>返回业务首页</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.closeRechargeSuccessModal}>
              <View style={styles.viewButton2}>
                <Text style={styles.text2Style}>继续缴费</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 270,
    width: 260
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textInTopView: {
    fontSize: 20,
    alignSelf: 'center'
  },
  viewTop: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    width: 260
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
  viewOne: {
    height: 130,
    width: 260,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: borderWhith,
    marginTop: 10,
    borderTopWidth: borderWhith
  },
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 30
  },
  textInViewOneInnerLeft: {
    fontSize: 15,
    color: 'grey'
  },
  textInViewOneInnerRight: {
    fontSize: 16,
    color: 'black'
  },
  viewButton1: {
    width: 120,
    height: 45,
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 2
  },
  viewButton2: {
    width: 90,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1Style: {
    fontSize: 18,
    color: 'red'
  },
  text2Style: {
    fontSize: 18,
    color: 'white'
  },
  viewOneBottom: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
})

export default ModalRechargeSuccess
