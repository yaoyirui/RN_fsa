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
  TextInput,
  ScrollView,
  ToastAndroid
} from 'react-native'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import CustomerBasicMessagePage from "./CustomerBasicMessagePage"
import ModalSubscribers from "./ModalSubscribers"
import ModalSearchProducts from "./ModalSearchProducts"
import ModalModifyChoosenProduct from "./ModalModifyChoosenProduct"
import ModalOrderProductSuccess from "./ModalOrderProductSuccess"
import ModalOrderProductConfirm from "./ModalOrderProductConfirm"
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import payMethodMap from '../utils/payMethods'
import {checkProductsAndReturnRequestBody} from "../utils/checkProductsAndReturnRequestBody"

var width = Dimensions.get('window').width;

@connect(({app, customer, product}) => {
  return {
    operatorCode: app.operCode,
    customerId: customer.customerDetail.id,
    ...product,
    ...app,
    ...customer
  }
})
class OrderProduct extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isDeductionBalance: false,
      remark: '',
      totalFee: 0,
      choosenPayMethodId: '',
      choosenPayMethodName: '',
      devCode: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(createAction('product/chooseProducts')());
    this.props.dispatch(createAction('product/hideChoosenProduct')());
    this.props.dispatch(createAction('product/queryCanBeAcceptSubscribers')({
      customerId: this.props.customerBasicInfo.customerId,
      dispatch: this.props.dispatch
    }));
  }

  onPressToChooseSubscribers = () => {
    this.props.dispatch(createAction('product/queryCanBeAcceptSubscribers')({
      customerId: this.props.customerId,
      dispatch: this.props.dispatch
    }))
    if (this.props.subscribers && this.props.subscribers.length > 0) {
      this.props.dispatch(createAction('product/openChooseSubscriberModal')())
    }
  }


  onPressToChooseProducts = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('product/cleanProductList')())
      this.props.dispatch(createAction('product/openChooseProductModal')())
    })
  }

  onPressToModifyProduct = (product) => {
    this.props.dispatch(createAction('product/getModifyProductId')({productId: product.productId}));
    this.props.dispatch(createAction('product/openModifyChooseProductModal')());
  }

  onPressToRemoveProduct = (product) => {
    this.props.dispatch(createAction('product/removeProductAsy')({
      chooseProductTmp: product,
      dispatch: this.props.dispatch
    }));
  }

  onPressToChoosePayMethod = (payMethodId, payMethodName) => {
    runAfterInteractionsBasic(() => {
      this.setState({choosenPayMethodId: payMethodId, choosenPayMethodName: payMethodName})
      this.refs.textInputAmount.blur()
    })
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('product/reset')());
      this.props.dispatch(NavigationActions.back());
    })
  }

  onPressToOrder = () => {
    const {chooseSubscriber, chooseProducts, calculate, customerId} = this.props;
    const requestBody = checkProductsAndReturnRequestBody(chooseProducts)
    this.props.dispatch(createAction('product/orderServiceProduct')({
      subscriberId: chooseSubscriber.subscriberId,
      requestBody: JSON.stringify(requestBody),
      payMethodId: this.state.choosenPayMethodId,
      devOperatorCode: this.state.devCode,
      savingFee: this.state.totalFee - calculate.totalFee,
      remark: this.state.remark,
      payOrNot: 1,
      derateBalanceFee: calculate.derateBalanceFee,
      isDerateBalanceFee: this.state.isDeductionBalance ? 1 : 0,
      dispatch: this.props.dispatch
    }));
    this.props.dispatch(createAction('customer/queryCustomerByIdOut')({customerId}));
  }

  onPressToOrderProductConfirm = () => {
    this.refs.textInputAmount.blur();
    const {actualAmount} = this.props;
    this.setState({
      totalFee: this.state.totalFee === 0 ? actualAmount : this.state.totalFee
    }, () => {
      if (!this.state.choosenPayMethodId) {
        ToastAndroid.show('请选择支付方式！', ToastAndroid.SHORT);
        return;
      }
      if (this.state.totalFee === null || this.state.totalFee === undefined) {
        ToastAndroid.show('请输入实缴金额！', ToastAndroid.SHORT);
        return;
      }
      if (parseInt(this.state.totalFee, 10) < 0) {
        ToastAndroid.show('实缴金额必须大于等于0！', ToastAndroid.SHORT);
        return;
      }
      if (this.state.totalFee < actualAmount) {
        ToastAndroid.show('实缴金额必须大于' + actualAmount + '！', ToastAndroid.SHORT);
        return;
      }
      this.props.dispatch(createAction('product/openOrderProductConfirmModal')({
        params: {
          choosenPayMethodName: this.state.choosenPayMethodName,
          remark: this.state.remark,
          devCode: this.state.devCode,
          totalFee: this.state.totalFee,
          onPressToOrder: this.onPressToOrder
        }
      }));
    })
  }

  renderChooseSubscriber = () => {
    const {
      chooseSubscriber,
      subscribers
    } = this.props;
    const businessType = (chooseSubscriber.businessTypeId === 2 ? '数字电视业务用户' : (chooseSubscriber.businessTypeId === 1 ? '数据业务用户' : '其他'))
    const status = (chooseSubscriber.statusId === 0 ? '有效' : (chooseSubscriber.statusId === 1 ? '暂停' : (chooseSubscriber.statusId === 2 ? '罚停' : '其他')))
    if (subscribers && subscribers.length > 0) {
      if (chooseSubscriber) {
        return <View style={styles.viewFive}>
          <TouchableOpacity onPress={() => {
            this.onPressToChooseSubscribers()
          }}>
            <View style={styles.viewFiveInner}>
              <View style={styles.viewFiveInnerLeft}>
                <Text
                  style={styles.textInViewFiveInnerLeft}>{businessType + '(终端号:' + chooseSubscriber.terminalNum + ')'}</Text>
              </View>
              <View style={styles.viewFiveInnerRight}>
                <Text style={styles.textInViewFiveInnerRight}>{status}</Text>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/arrow_right.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
            <View style={styles.viewFiveInnerLeft}>
              <Text style={styles.textInViewFiveInnerLeft}>{'智能卡号 ' + chooseSubscriber.serviceStr}</Text>
            </View>
          </View>
        </View>
      }
    } else {
      return <View style={styles.viewFour}>
        <Text style={styles.textInViewFour}>{'无可选用户'}</Text>
      </View>
    }
  }

  onAmountEndEdit = () => {
    this.setState({'totalFee': this.state.totalFee})
  }

  renderChooseProducts = () => {
    const {
      subscribers
    } = this.props
    const products = this.props.chooseProducts;
    if (subscribers && subscribers.length > 0) {
      return <View style={{backgroundColor: 'white'}}>
        <View style={[styles.viewFive, {height: 40}]}>
          <TouchableOpacity onPress={() => {
            this.onPressToChooseProducts()
          }}>
            <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
              <View style={styles.viewFiveInnerLeft}>
                <Text style={styles.textInViewFiveInnerLeft}>{'选择订购的产品'}</Text>
              </View>
              <View>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/add_press.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderChoosenProductsBottom(products)}
        <View style={styles.viewThree}/>
        {this.renderOrderProductBottom()}
      </View>
    }
    return <View/>
  }

  renderChoosenProductsBottom = (products) => {
    const {showChoosenProduct, calculate} = this.props;
    if (showChoosenProduct && products && products.length > 0) {
      return products.map((product, index) => {
        if (product.choosen) {
          let productAmount = 0;
          if (calculate.productFeeInfos) {
            calculate.productFeeInfos.forEach((productInnerCalculate) => {
              if (product.productId === productInnerCalculate.productId) {
                productAmount = productInnerCalculate.fee;
              }
            })
          }
          return product.pricePlans ? product.pricePlans.map((pricePlan, index) => {
            if (pricePlan && pricePlan.choosen) {
              return <View key={index} style={styles.viewSix}>
                <View style={styles.viewSixInnerLeft}>
                  <Text
                    style={styles.textInViewSixInnerLeft}>{product.productName + '--' + pricePlan.pricePlanName}</Text>
                  <Text
                    style={styles.textInViewSixInnerLeft}>{'订购周期(月):' + product.choosenOrderCycle + '  订购费用:￥' + productAmount}</Text>
                </View>
                <View style={styles.viewSixInnerRight}>
                  <TouchableOpacity onPress={() => {
                    this.onPressToModifyProduct(product)
                  }}>
                    <Image
                      style={styles.imageInViewFiveInner}
                      source={require('../images/edit.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.onPressToRemoveProduct(product)
                  }}>
                    <Image
                      style={styles.imageInViewFiveInner}
                      source={require('../images/delete.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }
          }) : <View/>
        }
      })
    }
  }

  renderShowChangeDeductionBalance = (savingFee, totalFee) => {
    if (savingFee > 0) {
      return <TouchableOpacity onPress={() => {
        this.changeDeductionBalance(savingFee, totalFee)
      }}>
        <View style={[styles.viewEightInner]}>
          <Text style={[styles.textInViewEight, {color: 'black'}]}>{'预存费用是否扣减帐户余额'}</Text>
          {this.renderChooseImage()}
        </View>
      </TouchableOpacity>
    }

  }
  renderOrderProductBottom = () => {
    const {showChoosenProduct, chooseProducts, calculate, customerBasicInfo, actualAmount} = this.props;
    if (showChoosenProduct && chooseProducts && chooseProducts.length > 0) {
      if (calculate && calculate.totalFee !== undefined) {
        return <View><View style={styles.viewSeven}>
          <View style={styles.viewSevenInnerLeft}>
            <Text style={styles.textInViewSevenInner}>费用</Text>
          </View>
          <View style={styles.viewSevenInnerRight}>
            <Text style={styles.textInViewSevenInner}>{'预存费用 ￥' + calculate.savingFee}</Text>
            <Text style={styles.textInViewSevenInner}>{'产品费用 ￥' + calculate.productFee}</Text>
            <Text style={styles.textInViewSevenInner}>{'合计 ￥' + calculate.totalFee}</Text>
          </View>
        </View>
          <View style={styles.viewThree}/>
          <View style={styles.viewEight}>
            <Text style={styles.textInViewEight}>{'帐户扣减 ￥' + calculate.accoutFee}</Text>
            <Text style={styles.textInViewEight}>{'帐户余额 ￥' + customerBasicInfo.accountBalance}</Text>
            {this.renderShowChangeDeductionBalance(calculate.savingFee, calculate.totalFee)}
            <View style={[styles.viewEightInner, {justifyContent: 'flex-start'}]}>
              <Text style={[styles.textInViewEight]}>{'实缴金额'}</Text>
              <TextInput
                ref={'textInputAmount'}
                style={styles.textInputStyle}
                keyboardType={'numeric'}
                placeholder='请输入'
                underlineColorAndroid="transparent"
                blurOnSubmit={true}
                defaultValue={actualAmount + ''}
                onChangeText={(text) => this.setState({'totalFee': parseFloat(text)})}
                onEndEditing={this.onAmountEndEdit}
              />
            </View>
          </View>
          <View style={styles.viewFour}>
            <Text style={styles.textInViewFour}>{'选择支付方式'}</Text>
          </View>
          <View style={styles.viewPayMethods}>
            {this.renderPayMethods()}
          </View>
          <View style={styles.viewThree}/>
          <View style={styles.viewNine}>
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
          <View style={styles.viewTen}>
            <TouchableOpacity onPress={() => {
              runAfterInteractionsBasic(() => {
                this.onPressToOrderProductConfirm()
              })
            }}>
              <View style={styles.viewButtonConfirm}>
                <Text style={styles.textConfirmStyle}>确定</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      }
    }
  }


  changeDeductionBalance = (savingFee, totalFee) => {
    const {customerBasicInfo, actualAmount} = this.props;
    runAfterInteractionsBasic(() => {
      this.setState({
        isDeductionBalance: !this.state.isDeductionBalance
      }, () => {
        if (this.state.isDeductionBalance) {
          this.props.dispatch(createAction('product/changeActualAmount')({actualAmount: (customerBasicInfo.accountBalance > savingFee ? (totalFee - savingFee) : (totalFee - customerBasicInfo.accountBalance))}))
          this.setState({
            totalFee: (customerBasicInfo.accountBalance > savingFee ? (totalFee - savingFee) : (totalFee - customerBasicInfo.accountBalance))
          })
        } else {
          this.props.dispatch(createAction('product/changeActualAmount')({actualAmount: totalFee}))
          this.setState({
            totalFee
          })
        }
      })
    })
  }

  renderChooseImage = () => {
    if (this.state.isDeductionBalance) {
      return <Image
        style={styles.imageInViewFiveInner}
        source={require('../images/selected.png')}
      />
    }
    return <Image
      style={styles.imageInViewFiveInner}
      source={require('../images/unselected.png')}
    />
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
              this.onPressToChoosePayMethod(payMethodId, payMethod)
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

  render() {
    const {
      operatorCode,
      subscribers,
      showSubscribersModal,
      showOrderProductConfirmModal,
      params,
      calculate,
      chooseProducts,
      chooseSubscriber,
      dispatch
    } = this.props;
    this.state.devCode = operatorCode;
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
          <Text style={styles.topTextStyle}>{'订购产品'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
            <CustomerBasicMessagePage/>
            <View
              style={[styles.viewOneInner,
                {
                  borderTopWidth: 0.4,
                  borderColor: '#C0C0C0',
                  marginLeft: 0,
                  paddingLeft: 20
                }]}>
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
            <View style={styles.viewFour}>
              <Text style={styles.textInViewFour}>{'选择订购产品的用户'}</Text>
            </View>
            {this.renderChooseSubscriber()}
            <View style={styles.viewThree}/>
            {this.renderChooseProducts()}
          </ScrollView>
        </View>
        <ModalSubscribers subscribers={subscribers} showSubscribersModal={showSubscribersModal}/>
        <ModalSearchProducts/>
        <ModalModifyChoosenProduct/>
        <ModalOrderProductConfirm showOrderProductConfirmModal={showOrderProductConfirmModal} dispatch={dispatch}
                                  params={params} calculate={calculate} chooseProducts={chooseProducts}
                                  chooseSubscriber={chooseSubscriber}/>
        <ModalOrderProductSuccess goBack={this.goBack}/>
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
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 20,
    borderColor: borderColor,
    borderBottomWidth: borderWhith
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
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5'
  },
  textInViewFour: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  viewFive: {
    height: 80,
    width: width,
    borderWidth: borderWhith,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white'
  },
  viewFiveInner: {
    height: 40,
    width: width - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignItems: 'center',
    borderBottomWidth: 0.4
  },
  viewFiveInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    alignSelf: 'center'
  },
  viewFiveInnerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center'
  },
  textInViewFiveInnerLeft: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  textInViewFiveInnerRight: {
    fontSize: 14,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  imageInViewFiveInner: {
    width: 25,
    height: 25
  },
  viewSix: {
    height: 50,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomColor: borderColor,
    alignItems: 'flex-start',
    borderBottomWidth: borderWhith
  },
  viewSixInnerLeft: {
    width: 210,
    height: 40,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderColor: borderColor,
    marginLeft: 10,
    marginTop: 5
  },
  viewSixInnerRight: {
    width: 65,
    height: 45,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10
  },
  textInViewSixInnerLeft: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 10
  },
  viewSeven: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor,
    padding: 10
  },
  viewSevenInnerLeft: {
    height: 70,
    width: (width / 2) - 30,
    flexDirection: 'column',
    marginLeft: 20
  },
  viewSevenInnerRight: {
    height: 70,
    width: (width / 2) - 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: 20
  },
  textInViewSevenInner: {
    fontSize: 17,
    color: 'grey'
  },
  viewEight: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor,
    paddingTop: 10
  },
  viewEightInner: {
    height: 40,
    width: width - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  textInViewEight: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 20
  },
  textInputStyle: {
    width: 220,
    height: 35
  },
  viewPayMethods: {
    flex: 1,
    borderWidth: borderWhith,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
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
  viewNine: {
    height: 50,
    width: width - 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    paddingLeft: 20
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
  viewTen: {
    height: 150,
    width: width,
    borderColor: borderColor,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith,
    alignItems: 'center',
    justifyContent: 'center',
  }
})


export default OrderProduct
