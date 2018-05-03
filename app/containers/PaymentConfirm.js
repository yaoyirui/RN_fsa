/**
 * Created by yaoyirui on 2017/9/21.
 */
import React, {PureComponent} from 'react'
import {StyleSheet, View, Dimensions, Text, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'

var width = Dimensions.get('window').width;

@connect(({customer, app}) => {
    return {
      ...customer, customerBasicInfo: app.customerBasicInfo
    }
  }
)
class PaymentConfirm extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {

    const {
      customerBasicInfo,
      customerDetail
    } = this.props;
    const {
      choosePayMethodName,
      payAmount,
      remark,
      devCode,
      onPressToCharge
    } = this.props.params

    return (
      <View style={styles.container}>
        <View style={styles.viewOne}>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'客户名称   '}</Text>
            <Text style={styles.textInViewOneInnerRight}>{customerBasicInfo.customerName}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'联系电话   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{customerDetail.contactPhone + ' ' + customerDetail.mobilePhoneNum}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'联系地址   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{customerDetail.addressName}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'帐户余额   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{customerBasicInfo.accountBalance}</Text>
          </View>
        </View>
        <View style={[styles.viewOne, {borderBottomWidth: 0}]}>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'支付方式   '}</Text>
            <Text style={styles.textInViewOneInnerRight}>{choosePayMethodName}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'缴费金额   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{payAmount}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'发展人工号   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{devCode}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'备注   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{remark}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={onPressToCharge}>
            <View style={styles.viewButtonConfirm}>
              <Text style={styles.textConfirmStyle}>确定</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  viewOne: {
    height: 160,
    width: width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: borderWhith,
    paddingLeft: 50
  },
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  textInViewOneInnerLeft: {
    fontSize: 15,
    color: 'grey'
  },
  textInViewOneInnerRight: {
    fontSize: 16,
    color: 'black'
  },
  viewButtonConfirm: {
    width: width - 60,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textConfirmStyle: {
    fontSize: 18,
    color: 'white'
  },
})

export default PaymentConfirm
