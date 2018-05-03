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
import ModalSearchEquip from "./ModalSearchEquip"
import ModalOperationSuccess from "./ModalOperationSuccess"
import ModalEquipSaleConfirm from "./ModalEquipSaleConfirm"
import ModalEquipSaleOrderProductModify from "./ModalEquipSaleOrderProductModify"
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import PayMethod from './PayMethod'
import {checkProductsAndReturnRequestBodyForEquipSale} from "../utils/checkProductsAndReturnRequestBody"

var width = Dimensions.get('window').width;

@connect(({app, customer, equip}) => {
  return {
    operatorCode: app.operCode,
    customerId: customer.customerDetail.id,
    ...equip,
    ...app,
    ...customer
  }
})
class EquipSale extends PureComponent {

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
    this.props.dispatch(createAction('equip/chooseProducts')());
    this.props.dispatch(createAction('equip/hideChoosenProduct')());
  }


  onPressToChooseProducts = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('equip/cleanProductList')())
      this.props.dispatch(createAction('equip/openChooseProductModal')())
    })
  }

  onPressToModifyProduct = (product) => {
    this.props.dispatch(createAction('equip/getModifyProductId')({productId: product.productId}));
    this.props.dispatch(createAction('equip/openModifyChooseProductModal')());
  }

  onPressToRemoveProduct = (product) => {
    this.props.dispatch(createAction('equip/removeProductAsy')({
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
      this.props.dispatch(createAction('equip/reset')());
      this.props.dispatch(NavigationActions.back());
    })
  }

  onPressToOrder = () => {
    const {chooseProducts, calculate, customerId, dispatch} = this.props;
    const requestBody = checkProductsAndReturnRequestBodyForEquipSale(chooseProducts)
    dispatch(createAction('equip/orderPeripheralEquip')({
      requestBody: JSON.stringify(requestBody),
      payMethodId: this.state.choosenPayMethodId,
      devOperatorCode: this.state.devCode,
      savingFee: this.state.totalFee - calculate.totalFee,
      remark: this.state.remark,
      payOrNot: 1,
      dispatch
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
      this.props.dispatch(createAction('equip/openOrderProductConfirmModal')({
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


  onAmountEndEdit = () => {
    this.setState({'totalFee': this.state.totalFee})
  }

  renderChooseProducts = () => {
    const products = this.props.chooseProducts;
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
                    style={styles.textInViewSixInnerLeft}>{'订购数量:' + product.orderNum + '  订购费用:￥' + productAmount}</Text>
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


  renderOrderProductBottom = () => {
    const {showChoosenProduct, chooseProducts, calculate, actualAmount} = this.props;
    if (showChoosenProduct && chooseProducts && chooseProducts.length > 0) {
      if (calculate && calculate.totalFee !== undefined) {
        return <View>
          <View style={styles.viewSeven}>
            <Text style={styles.textInViewSevenInner}>费用</Text>
            <Text style={styles.textInViewSevenInner}>{'合计 ￥' + calculate.totalFee}</Text>
          </View>
          <View style={styles.viewEight}>
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
            <TouchableOpacity onPress={this.onPressToOrderProductConfirm}>
              <View style={styles.viewButtonConfirm}>
                <Text style={styles.textConfirmStyle}>确定</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      }
    }
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
    const {choosenPayMethodId} = this.state
    if (loginData && loginData.jsonData && loginData.jsonData.payMethodIds) {
      const params = {loginData, choosenPayMethodId, onPressToChoosePayMethod: this.onPressToChoosePayMethod}
      return <PayMethod {...params}/>
    }
  }

  render() {
    const {
      operatorCode,
      showOrderProductConfirmModal,
      params,
      calculate,
      chooseProducts,
      customerBasicInfo,
      balanceMoney,
      dispatch
    } = this.props;
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
          <Text style={styles.topTextStyle}>{'周边设备销售'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
            <CustomerBasicMessagePage/>
            <View style={styles.viewThree}/>
            {this.renderChooseProducts()}
          </ScrollView>
        </View>
        <ModalSearchEquip/>
        <ModalEquipSaleOrderProductModify/>
        <ModalEquipSaleConfirm showOrderProductConfirmModal={showOrderProductConfirmModal} dispatch={dispatch}
                               params={params} calculate={calculate} chooseProducts={chooseProducts}
                               chooseCustomer={{...customerBasicInfo}}
        />
        <ModalOperationSuccess successTitleText='周边资源销售' showAccount={true} account={balanceMoney}
                               goBack={this.goBack}/>
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
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
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
    borderBottomColor: borderColor
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


export default EquipSale
