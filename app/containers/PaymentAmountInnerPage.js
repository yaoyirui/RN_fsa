/**
 * Created by yaoyirui on 2017/9/18.
 */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import payMethodMap from '../utils/payMethods'

import {runAfterInteractionsWithToast} from '../utils/interactionManagerUtils'


var width = Dimensions.get('window').width;

@connect(({customer, app}) => {
    return {
      ...customer,
      loginData: app.loginData,
      customerBasicInfo: app.customerBasicInfo
    }
  }
)
class PaymentAmountInnerPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      'payMethod_0': false,
      'payMethod_111': false,
      'payMethod_119': false,
      'payMethod_171': false,
      'payMethod_172': false,
      'payMethod_173': false,
      'choosePayMethod': '',
      'choosePayMethodName': '',
      'payAmount': '',
      'remark': '',
      'devCode': props.loginData.jsonData.operatorCode
    };
  }

  onPressToCharge = () => {
    const {onDemandOrNot, dispatch} = this.props;
    if (onDemandOrNot) {
      dispatch(createAction('payment/paymentCommitOnDemand')({
        customerId: this.props.customerDetail.id,
        payMethodId: this.state.choosePayMethod,
        paymentAmount: this.state.payAmount,
        devOperatorCode: this.state.devCode,
        remark: this.state.remark,
        dispatch
      }));
    } else {
      dispatch(createAction('payment/paymentCommit')({
        customerId: this.props.customerDetail.id,
        payMethodId: this.state.choosePayMethod,
        paymentAmount: this.state.payAmount,
        devOperatorCode: this.state.devCode,
        remark: this.state.remark,
        dispatch
      }));
    }
  }

  onPressToChargeConfirm = () => {
    if (!this.state.choosePayMethod) {
      ToastAndroid.show('请选择支付方式！', ToastAndroid.SHORT);
      return;
    }
    if (!this.state.payAmount) {
      ToastAndroid.show('请输入缴费金额！', ToastAndroid.SHORT);
      return;
    }
    if (parseInt(this.state.payAmount, 10) <= 0) {
      ToastAndroid.show('金额必须大于0！', ToastAndroid.SHORT);
      return;
    }
    this.props.dispatch(createAction('payment/openPaymentConfirm')({
      params: {
        choosePayMethodName: this.state.choosePayMethodName,
        payAmount: this.state.payAmount,
        remark: this.state.remark,
        devCode: this.state.devCode,
        onPressToCharge: this.onPressToCharge
      }
    }));
  }


  onPressToChoosePayMethod = (payMethodId, payMethodName) => {
    this.setState({
      'payMethod_0': false,
      'payMethod_111': false,
      'payMethod_119': false,
      'payMethod_171': false,
      'payMethod_172': false,
      'payMethod_173': false,
      'choosePayMethod': payMethodId,
      'choosePayMethodName': payMethodName
    }, () => {
      switch (payMethodId) {
        case '0':
          this.setState({'payMethod_0': true});
          break;
        case '111':
          this.setState({'payMethod_111': true});
          break;
        case '119':
          this.setState({'payMethod_119': true});
          break;
        case '171':
          this.setState({'payMethod_171': true});
          break;
        case '172':
          this.setState({'payMethod_172': true});
          break;
        case '173':
          this.setState({'payMethod_173': true});
          break;
        default:
          break;
      }
    })
  }

  onPressToOpenCustomerDetailModal = () => {
    runAfterInteractionsWithToast(this.openCustomerDetailModal)
  }

  openCustomerDetailModal = () => {
    this.props.dispatch(createAction('customer/openCustomerDetail')())
  }

  renderPayMethods = () => {
    const loginData = this.props.loginData;
    if (loginData && loginData.jsonData && loginData.jsonData.payMethodIds) {
      const payMethodIdsArray = loginData.jsonData.payMethodIds.split(',');
      return payMethodIdsArray.map(
        (payMethodId, index) => {
          const payMethod = payMethodMap.get(payMethodId);
          if (payMethodId !== '0' && payMethod) {
            return <TouchableOpacity key={index} onPress={() => {
              this.onPressToChoosePayMethod(payMethodId, payMethod)
            }}>{
              index === payMethodIdsArray.length - 1 ? <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
                <View style={styles.viewFiveInnerLeft}>
                  <Text style={styles.textInViewFiveInnerLeft}>{payMethod}</Text>
                </View>
                {
                  this.state['payMethod_' + payMethodId] ?
                    <Image
                      style={styles.imageInViewFiveInner}
                      source={require('../images/selected.png')}
                    /> : <View/>
                }
              </View> : <View style={styles.viewFiveInner}>
                <View style={styles.viewFiveInnerLeft}>
                  <Text style={styles.textInViewFiveInnerLeft}>{payMethod}</Text>
                </View>
                {
                  this.state['payMethod_' + payMethodId] ?
                    <Image
                      style={styles.imageInViewFiveInner}
                      source={require('../images/selected.png')}
                    /> : <View/>
                }
              </View>
            }
            </TouchableOpacity>
          }
        }
      )
    }

  }


  render() {
    const {customerBasicInfo, customerDetail} = this.props;
    const {operatorCode} = this.props.loginData.jsonData;
    return (
      <View style={styles.container}>
        <View style={styles.viewOne}>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'客户名称   '}</Text>
            <Text style={styles.textInViewOneInnerRight}>{customerDetail.customerName}</Text>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 50
            }
            }><TouchableOpacity onPress={this.onPressToOpenCustomerDetailModal}><Text
              style={[styles.textInViewOneInnerRight, {
                color: '#00CED1'
              }]}>{'详情'}</Text></TouchableOpacity></View>
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
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'发展人工号   '}</Text>
            <TextInput
              ref={'devCode'}
              style={styles.textInputStyle}
              defaultValue={operatorCode}
              multiline={true}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({'devCode': text})}
            />
          </View>
        </View>
        <View style={styles.viewFour}>
          <Text style={styles.textInViewFour}>{'选择支付方式'}</Text>
        </View>
        <View style={styles.viewFive}>
          {this.renderPayMethods()}
        </View>
        <View style={styles.viewSix}/>
        <View style={styles.viewSeven}>
          <Text style={styles.textInViewSecond}>{'缴 费 金 额'}</Text>
          <TextInput
            ref={'payAmount'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            keyboardType='numeric'
            onChangeText={(text) => {
              this.setState({'payAmount': text})
            }}
          />
        </View>
        <View style={styles.viewSix}/>
        <View style={styles.viewSeven}>
          <Text style={styles.textInViewSecond}>{'备 注'}</Text>
          <TextInput
            ref={'remark'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'remark': text})}
          />
        </View>
        <View style={styles.viewEight}>
          <TouchableOpacity onPress={this.onPressToChargeConfirm}>
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
    height: 200,
    width: width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: borderWhith,
    paddingLeft: 20
  },
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  viewTwo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith
  },
  textInViewOneInnerLeft: {
    fontSize: 15,
    color: 'grey'
  },
  textInViewOneInnerRight: {
    fontSize: 16,
    color: 'black'
  },
  viewTwoInnerBusiness: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  viewTwoInnerResource: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  viewTwoInnerProduct: {
    height: 60,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginRight: 20
  },
  textInViewTwoInnerBusiness: {
    fontSize: 14,
    color: 'grey'
  },
  textInViewTwoInnerResource: {
    fontSize: 14,
    color: 'black'
  },
  textInViewTwoInnerProductTop: {
    fontSize: 14,
    color: 'black'
  },
  textInViewTwoInnerProductBottom: {
    fontSize: 12,
    color: 'grey'
  },
  viewFour: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5'
  },
  textInViewFour: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 20,
    alignSelf: 'center'
  },
  viewFive: {
    flex: 1,
    width: width,
    borderWidth: borderWhith,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white'
  },
  viewFiveInner: {
    height: 40,
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignSelf: 'center',
    borderBottomWidth: 0.4
  },
  viewFiveInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    alignSelf: 'center'
  },
  textInViewFiveInnerLeft: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  imageInViewFiveInner: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  viewSix: {
    height: 10,
    width: width,
    borderColor: borderColor,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith
  },
  viewSeven: {
    height: 50,
    width: width - 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor
  },
  viewButtonConfirm: {
    width: width - 30,
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
  viewEight: {
    height: 150,
    width: width,
    borderColor: borderColor,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    height: 35,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  },
})

export default PaymentAmountInnerPage
