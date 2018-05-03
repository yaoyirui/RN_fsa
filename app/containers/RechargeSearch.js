/**
 * Created by yaoyirui on 2017/12/5.
 */

import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView
} from 'react-native'

import Toast from 'antd-mobile/lib/toast'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import payMethodMap from '../utils/payMethods'
import ModalRechargeSearchDetail from "./ModalRechargeSearchDetail"
import ListLoading from './ListLoading'
import {
  runAfterInteractionsWithToast,
  runAfterInteractionsWithLoading,
  runAfterInteractionsBasic
} from '../utils/interactionManagerUtils'

import {getDateModal} from '../utils/chooseDateModal'

var width = Dimensions.get('window').width;


@connect(({app, payment}) => {
  return {
    ...app,
    operatorCode: app.operCode,
    ...payment
  }
})
class RechargeSearch extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      customerName: '',
      contractPhone: '',
      startDate: '',
      endDate: '',
      choosenPayMethodId: '-1',
      start: 0
    };
  }

  componentDidMount() {
    const date = new Date();
    this.props.dispatch(createAction('payment/setQueryDate')({
      startDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      endDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
    }));
    this.props.dispatch(createAction('payment/checkAccountBillListBetweenDate')({
      ...this.state,
      startDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      endDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      payMethodId: this.state.choosenPayMethodId,
      dispatch: this.props.dispatch
    }));
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('payment/reset')())
      this.props.dispatch(NavigationActions.back())
    })
  }

  onPressToOpenQueryCondition = () => {
    this.refs.paymentsFl ? this.refs.paymentsFl.scrollToIndex({viewPosition: 0, index: 0}) : null;
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('payment/openQueryCondition')())
    });
  }

  renderQueryConditionUpOrDown = () => {
    if (this.props.queryConditionOpen) {
      return <Image
        style={styles.imageInViewInner}
        source={require('../images/up.png')}
      />
    }
    return <Image
      style={styles.imageInViewInner}
      source={require('../images/down.png')}
    />
  }

  onPressToReQueryPayments = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('payment/checkAccountBillListBetweenDate')({
        ...this.state,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        payMethodId: this.state.choosenPayMethodId,
        showPayments: false,
        dispatch: this.props.dispatch
      }))
    })
  }

  onPressToReset = () => {
    this.setState({
      customerName: '',
      contractPhone: '',
      startDate: '',
      endDate: '',
      choosenPayMethodId: ''
    })
  }


  renderQueryCondition = () => {
    if (this.props.queryConditionOpen) {
      return <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}><View
        style={styles.viewFourOpen}>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'开始日期'}</Text>
          <TextInput
            ref={'startDate'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.props.startDate}
            underlineColorAndroid="transparent"
            onFocus={() => {
              getDateModal(this.props.dispatch, 'startDate', this.props.startDate)
              this.refs.startDate.blur();
            }}
            onChangeText={(text) => this.setState({'startDate': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'结束日期'}</Text>
          <TextInput
            ref={'endDate'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.props.endDate}
            underlineColorAndroid="transparent"
            onFocus={() => {
              getDateModal(this.props.dispatch, 'endDate', this.props.endDate)
              this.refs.endDate.blur();
            }}
            onChangeText={(text) => this.setState({'endDate': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'客户名称'}</Text>
          <TextInput
            ref={'customerName'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.customerName}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'customerName': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'联系电话'}</Text>
          <TextInput
            ref={'contractPhone'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.contractPhone}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'contractPhone': text})}
          />
        </View>
        <View style={styles.viewConditionTitle}>
          <Text style={styles.textInViewFour}>{'选择支付方式'}</Text>
        </View>
        <View style={styles.viewPayMethods}>
          {this.renderPayMethods()}
        </View>
        <View style={styles.viewFourOpenInnerBottom}>
          <TouchableOpacity onPress={this.onPressToReQueryPayments}>
            <View style={styles.queryViewButtonStyle}>
              <Text style={{fontSize: 18, color: 'white'}}>{'查询'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressToReset}>
            <View
              style={[styles.queryViewButtonStyle, {backgroundColor: 'white', borderColor: 'red', borderWidth: 1}]}>
              <Text style={{fontSize: 18, color: 'red'}}>{'重置'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    }
    return <View/>
  }

  onPressToChoosePayMethod = (payMethodId) => {
    runAfterInteractionsBasic(() => {
      this.setState({choosenPayMethodId: payMethodId})
    })
  }

  renderPayMethods = () => {
    const {loginData} = this.props;
    const choosenPayMethodId = this.state.choosenPayMethodId
    if (loginData && loginData.jsonData && loginData.jsonData.payMethodIds) {
      const payMethodIdsArray = loginData.jsonData.payMethodIds.split(',');
      return payMethodIdsArray.map(
        (payMethodId, index) => {
          const payMethod = payMethodMap.get(payMethodId);
          if (payMethod) {
            return <TouchableOpacity key={index} onPress={() => {
              this.onPressToChoosePayMethod(payMethodId)
            }}>{
              index === payMethodIdsArray.length - 1 ?
                <View style={[styles.viewPayMethodsInner, {borderBottomWidth: 0}]}>
                  <View style={styles.viewPayMethodsInnerLeft}>
                    <Text style={styles.textInPayMethodsInnerLeft}>{payMethod}</Text>
                  </View>
                  {
                    choosenPayMethodId === payMethodId ?
                      <Image
                        style={styles.imageInViewPayMethodsInner}
                        source={require('../images/selected.png')}
                      /> : <View/>
                  }
                </View> : <View style={styles.viewPayMethodsInner}>
                <View style={styles.viewPayMethodsInnerLeft}>
                  <Text style={styles.textInPayMethodsInnerLeft}>{payMethod}</Text>
                </View>
                {
                  choosenPayMethodId === payMethodId ?
                    <Image
                      style={styles.imageInViewPayMethodsInner}
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

  onPressRenderItem = (item) => {
    // 查询缴费明细
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('payment/queryPaymentDetail')({
        id: item.id,
        dispatch: this.props.dispatch
      }));
    });
  }

  _renderItem = ({item}) => {
    const payMethodName = payMethodMap.get(item.payMethodId + '');
    return <TouchableOpacity
      key={item.id}
      onPress={() => this.onPressRenderItem(item)}><View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        borderBottomWidth: borderWhith,
        borderBottomColor: borderColor
      }}>
      <View style={[styles.viewRenderItemInViewFiveBottom, {paddingLeft: 10}]}>
        <View style={{width: width - 100, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={styles.textInRenderItemInnerTop}>{item.customerName}</Text>
          <Text
            style={styles.textInRenderItemInnerTop}>{payMethodName + '  ' + item.paymentAmount }</Text>
        </View>
        <Text style={styles.textInRenderItemInnerBottom}>{item.paymentTime}</Text>
      </View>
      <Image
        style={styles.imageInViewFiveInner}
        source={require('../images/arrow_right.png')}
      />
    </View>
    </TouchableOpacity>
  };

  renderQueryResult = ({checkAccountBills, showQueryResult}) => {
    if (showQueryResult) {
      return <ScrollView showsVerticalScrollIndicator={true} onMomentumScrollEnd={this._contentViewScroll}><View
        style={styles.viewFive}>
        <View style={styles.viewConditionTitle}>
          <View style={styles.viewConditionTitleInner}><Text style={styles.textInViewFour}>{'账目类型分类名称'}</Text></View>
          <View style={styles.viewConditionTitleInner}><Text style={styles.textInViewFour}>{'金额'}</Text></View>
        </View>
        {checkAccountBills.length > 0 ? checkAccountBills.map((checkAccountBill, index) => {
          return <View key={index} style={styles.viewFiveInner}>
            <View style={[styles.viewConditionTitleInner, {width: (width - 30) / 2}]}>
              <Text
                style={styles.textInViewFiveInner}>{checkAccountBill.billTypeName}</Text>
            </View>
            <View style={[styles.viewConditionTitleInner, {width: (width - 30) / 2}]}>
              <Text
                style={styles.textInViewFiveInner}>{'￥' + checkAccountBill.amount}</Text>
            </View>
          </View>
        }) : <View/>}
        {this.renderPayments(this.props)}
      </View>
      </ScrollView>
    }
    return <View/>
  }

  _contentViewScroll = (e: Object) => {
    const offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    const contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    const oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (((offsetY + oriageScrollHeight) > (contentSizeHeight - 10)) && this.props.showPayments && this.props.count > 12) {
      // ToastAndroid.show("滑动到底了", ToastAndroid.SHORT);
      this.props.dispatch(createAction('payment/queryPaymentsByConditions')({
        ...this.state,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        payMethodId: this.state.choosenPayMethodId === '-1' ? '' : this.state.choosenPayMethodId,
        start: this.props.recharges ? this.props.recharges.length : 0,
        row: 12,
        dispatch: this.props.dispatch
      }));
    }
  }

  onPressToQueryPayments = () => {
    this.props.dispatch(createAction('payment/queryPaymentsByConditions')({
      ...this.state,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      payMethodId: this.state.choosenPayMethodId === '-1' ? '' : this.state.choosenPayMethodId,
      start: 0,
      row: 12,
      dispatch: this.props.dispatch
    }))
  }

  renderPayments = ({showPayments, recharges, count}) => {
    if (showPayments) {
      return <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={[styles.viewSecond]}>
          <Text style={styles.textInViewSecond}>{`查询结果 ${count}个`}</Text>
        </View>
        {
          recharges.map((recharge, index) => {
            return this._renderItem({item: recharge})
          })
        }
      </View>
    } else {
      return <View style={styles.viewTen}>
        <TouchableOpacity onPress={this.onPressToQueryPayments}>
          <View style={styles.viewButtonConfirm}>
            <Text style={styles.textConfirmStyle}>查询缴费记录</Text>
          </View>
        </TouchableOpacity>
      </View>
    }
  }

  render() {
    const {operatorCode} = this.props;
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
          <Text style={styles.topTextStyle}>{'缴费查询'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <TouchableOpacity onPress={this.onPressToOpenQueryCondition}>
          <View style={styles.viewFour}>
            <View style={styles.viewInViewFourInnerLeft}>
              <Image
                style={styles.imageInViewInner}
                source={require('../images/search.png')}
              />
              <Text style={styles.textInViewFourAndFiveStyle}>{'查询条件'}</Text>
            </View>
            {this.renderQueryConditionUpOrDown()}
          </View>
        </TouchableOpacity>
        {this.renderQueryCondition()}
        {this.renderQueryResult(this.props)}
        <ModalRechargeSearchDetail/>
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
    width: width,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    paddingLeft: 30
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
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },

  viewInViewFourInnerLeft: {
    height: 50,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageInViewInner: {
    width: 30,
    height: 30
  },
  viewFourOpen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewFourOpenInner: {
    height: 50,
    width: width - 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewFourOpenInnerBottom: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    padding: 40,
    backgroundColor: '#F5F5F5'
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  textInputStyle: {
    height: 35,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  },
  queryViewButtonStyle: {
    width: 120,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFive: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  viewRenderItemInViewFiveBottom: {
    height: 50,
    width: width - 100,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  textInRenderItemInnerTop: {
    fontSize: 13,
    color: 'black'
  },
  textInRenderItemInnerBottom: {
    fontSize: 10,
    color: 'gray'
  },
  viewConditionTitle: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingLeft: 20
  },
  viewConditionTitleInner: {
    height: 40,
    width: width / 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    alignItems: 'center'
  },
  textInViewFour: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  viewPayMethods: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  viewPayMethodsInner: {
    height: 40,
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignSelf: 'center',
    borderBottomWidth: 0.4
  },
  viewPayMethodsInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    alignSelf: 'center'
  },
  textInPayMethodsInnerLeft: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  imageInViewPayMethodsInner: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  viewFiveInner: {
    height: 40,
    width: width - 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: 0.4,
    alignItems: 'center'
  },
  textInViewFiveInner: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 20
  },
  imageInViewFiveInner: {
    width: 25,
    height: 25
  },
  viewTen: {
    height: 150,
    width: width,
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonConfirm: {
    width: width - 80,
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

export default RechargeSearch
