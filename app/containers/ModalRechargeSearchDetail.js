/**
 * Created by yaoyirui on 2018/1/26.
 */
/**
 * Created by yaoyirui on 2017/10/26.
 */

import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import payMethodMap from '../utils/payMethods'

@connect(({payment}) => {
    return {
      ...payment
    }
  }
)
class ModalRechargeSearchDetail extends PureComponent {


  closeRechargeSearchDetailModal = () => {
    this.props.dispatch(createAction('payment/closeRechargeSearchDetailModal')())
  }

  render() {

    const {
      rechargeDetail
    } = this.props;


    return (
      <Modal style={styles.modal}
             visible={this.props.showRechargeSearchDetail}
             transparent={true}
             maskClosable={false}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>缴费详情</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeRechargeSearchDetailModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewOne}>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'客户名称 '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{rechargeDetail.customerName}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'客户编码   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{rechargeDetail.customerCode}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'缴费方式   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{payMethodMap.get(rechargeDetail.payMethodId + '')}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'缴费金额   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{rechargeDetail.paymentAmount}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'缴费日期   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{rechargeDetail.paymentTime}</Text>
            </View>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{'所办业务   '}</Text>
              <Text
                style={styles.textInViewOneInnerRight}>{rechargeDetail.businessName}</Text>
            </View>
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
    height: 340,
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
    height: 330,
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
    color: 'grey',
    width: 70,
    justifyContent: 'flex-start'
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

export default ModalRechargeSearchDetail
