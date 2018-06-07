/**
 * Created by yaoyirui on 2018/2/4.
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
import ModalSearchProductsForNewInstall from "./ModalSearchProductsForNewInstall"
import ModalModifyChoosenProductForNewInstall from "./ModalModifyChoosenProductForNewInstall"
import ModalSubscriberTypeChoose from "./ModalSubscriberTypeChoose"
import ModalChoosePhysicProducts from "./ModalChoosePhysicProducts"
import ModalOperationSuccess from "./ModalOperationSuccess"
import PayMethod from './PayMethod'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'

var width = Dimensions.get('window').width;

@connect(({app, customer, newInstall}) => {
  return {
    operatorCode: app.operCode,
    customerId: customer.customerDetail.id,
    ...app,
    ...customer,
    ...newInstall
  }
})
class NewInstall extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isDeductionBalance: false,
      remark: '',
      totalFee: 0,
      choosenPayMethodId: '',
      choosenPayMethodName: '',
      devCode: '',
      smartCardNumber: '',
      stbNumber: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(createAction('newInstall/reset')());
    this.props.dispatch(createAction('newInstall/queryNewInstallBasicInfo')({
      businessId: 2,
      dispatch: this.props.dispatch
    }));
  }

  onPressToChooseSubscriberTypes = () => {
    const {newInstallBasicInfo, dispatch} = this.props;
    const {newInstallDto} = newInstallBasicInfo;
    if (newInstallDto.subscriberTypes && newInstallDto.subscriberTypes.length > 0) {
      dispatch(createAction('newInstall/openChooseSubscriberTypeModal')())
    }
  }


  onPressToChooseProducts = () => {
    try {
      this.refs.textInputSmartCard.blur();
      this.refs.textInputStb.blur();
    } catch (e) {
    }
    console.log(this.state.smartCardNumber + ':' + this.props.smartCardNumber);
    if (!this.state.smartCardNumber && !this.props.smartCardNumber) {
      ToastAndroid.show('请输入智能卡号', ToastAndroid.SHORT);
      return;
    }
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/cleanProductList')())
      this.props.dispatch(createAction('newInstall/openChooseProductModal')())
    })
  }

  onPressToModifyProduct = (product) => {
    this.props.dispatch(createAction('newInstall/getModifyProductId')({productId: product.productId}));
    this.props.dispatch(createAction('newInstall/openModifyChooseProductModal')());
  }

  onPressToRemoveProduct = (product) => {
    this.props.dispatch(createAction('newInstall/removeProductAsy')({
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
      this.props.dispatch(createAction('newInstall/reset')());
      this.props.dispatch(NavigationActions.back());
    })
  }

  onPressToOrderProductConfirm = () => {
    this.refs.textInputAmount.blur();
    const {actualAmount, calculate} = this.props;
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
      this.props.dispatch(createAction('newInstall/newInstallAccept')({
        requestBody: {
          payMethodId: this.state.choosenPayMethodId,
          devOperatorCode: this.state.devCode,
          remark: this.state.remark,
          payOrNot: 1,
          derateBalanceFee: calculate.derateBalanceFee,
          isDerateBalanceFee: this.state.isDeductionBalance ? 1 : 0
        },
        businessId: 2,
        savingFee: this.state.totalFee - calculate.totalFee,
        dispatch: this.props.dispatch,
      }));
    })
  }


  onCodeEndEdit = (type) => {
    const {dispatch, smartCardNumber, stbNumber} = this.props;
    let scObj = null;
    let stbObj = null;
    const resources = [];
    if (this.state.smartCardNumber) {
      scObj = {resourceTypeId: 1, resourceNum: this.state.smartCardNumber}
      resources.push(scObj)
    }
    if (this.state.stbNumber) {
      stbObj = {resourceTypeId: 2, resourceNum: this.state.stbNumber}
      resources.push(stbObj)
    }
    dispatch(createAction('newInstall/setResources')({
      resources
    }))
    dispatch(createAction('newInstall/confirmNumber')({
      smartCardNumber: type === 1 ? this.state.smartCardNumber : smartCardNumber,
      stbNumber: type === 2 ? this.state.stbNumber : stbNumber
    }));
  }

  dispatchToBarcode = (type) => {
    this.refs.textInputStb.blur();
    this.refs.textInputSmartCard.blur();
    this.props.dispatch(NavigationActions.navigate({routeName: 'BarcodeTest', params: {type}}));
  }

  renderChoosenPhysicProducts = (resourceTypeId) => {
    const {physicProducts, smartCardNumber, stbNumber} = this.props;

    if (physicProducts && physicProducts.length > 0) {
      let chooseProduct = null;
      let choosen = false;
      for (let i = 0; i < physicProducts.length; i++) {
        const product = physicProducts[i];

        if ((resourceTypeId === product.resourceTypeId) && product.choosen) {
          choosen = true;
          chooseProduct = product;
        }
      }
      if (choosen) {
        const pricePlans = chooseProduct.pricePlans;
        return <View
          style={[styles.viewFiveInner, {height: 80, flexDirection: 'column', justifyContent: 'flex-start'}]}>
          <View style={[styles.viewFiveInner, {width: width - 60}]}>
            <Text style={styles.textInViewFiveInnerLeft}>{chooseProduct.productName}</Text>
          </View>
          <View style={[styles.viewFiveInner, {width: width - 60}]}>
            <Text style={styles.textInViewFiveInnerLeft}>{pricePlans.map((pricePlan, index) => {
              if (pricePlan.choosen) {
                return pricePlan.pricePlanName
              }
            })}</Text>
          </View>
        </View>
      } else {
        if (resourceTypeId === 1) {
          return <View style={styles.viewFiveInner}>
            <View style={styles.viewFiveInnerLeft}>
              <Text style={styles.textInViewFiveInnerLeft}>{'智能卡号 '}</Text>
              <TextInput
                ref={'textInputSmartCard'}
                style={styles.textInputStyle}
                placeholder='请输入'
                underlineColorAndroid="transparent"
                defaultValue={smartCardNumber}
                onChangeText={(text) => this.setState({'smartCardNumber': text})}
                onEndEditing={() => {
                  this.onCodeEndEdit(1)
                }}
              />
            </View>
            <View style={styles.viewFiveInnerRight}>
              <TouchableOpacity onPress={() => {
                this.dispatchToBarcode(1);
              }}>
                <Image
                  style={[styles.imageInViewFiveInner, {marginRight: 10}]}
                  source={require('../images/scan.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        } else if (resourceTypeId === 2) {
          return <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
            <View style={styles.viewFiveInnerLeft}>
              <Text style={styles.textInViewFiveInnerLeft}>{'机顶盒号 '}</Text>
              <TextInput
                ref={'textInputStb'}
                style={styles.textInputStyle}
                placeholder='请输入'
                underlineColorAndroid="transparent"
                defaultValue={stbNumber}
                onChangeText={(text) => this.setState({'stbNumber': text})}
                onEndEditing={() => {
                  this.onCodeEndEdit(2)
                }}
              />
            </View>
            <View style={styles.viewFiveInnerRight}>
              <TouchableOpacity onPress={() => {
                this.dispatchToBarcode(2);
              }}>
                <Image
                  style={[styles.imageInViewFiveInner, {marginRight: 10}]}
                  source={require('../images/scan.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      }
    } else {
      if (resourceTypeId === 1) {
        return <View style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'智能卡号 '}</Text>
            <TextInput
              ref={'textInputSmartCard'}
              style={styles.textInputStyle}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              defaultValue={smartCardNumber}
              onChangeText={(text) => this.setState({'smartCardNumber': text})}
              onEndEditing={() => {
                this.onCodeEndEdit(1)
              }}
            />
          </View>
          <View style={styles.viewFiveInnerRight}>
            <TouchableOpacity onPress={() => {
              this.dispatchToBarcode(1);
            }}>
              <Image
                style={[styles.imageInViewFiveInner, {marginRight: 10}]}
                source={require('../images/scan.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      } else if (resourceTypeId === 2) {
        return <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'机顶盒号 '}</Text>
            <TextInput
              ref={'textInputStb'}
              style={styles.textInputStyle}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              defaultValue={stbNumber}
              onChangeText={(text) => this.setState({'stbNumber': text})}
              onEndEditing={() => {
                this.onCodeEndEdit(2)
              }}
            />
          </View>
          <View style={styles.viewFiveInnerRight}>
            <TouchableOpacity onPress={() => {
              this.dispatchToBarcode(2);
            }}>
              <Image
                style={[styles.imageInViewFiveInner, {marginRight: 10}]}
                source={require('../images/scan.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      }
    }
    return <View/>
  }

  renderBasicInfos = () => {
    const {
      newInstallBasicInfo,
      chooseSubscriberType
    } = this.props;
    const {newInstallDto} = newInstallBasicInfo;
    if (newInstallDto.subscriberTypes && newInstallDto.subscriberTypes.length > 0) {
      if (chooseSubscriberType.id !== -1) {
        return <View style={[styles.viewFive, {height: 200}]}>
          <TouchableOpacity onPress={() => {
            this.onPressToChooseSubscriberTypes()
          }}>
            <View style={styles.viewFiveInner}>
              <View style={styles.viewFiveInnerLeft}>
                <Text
                  style={styles.textInViewFiveInnerLeft}>{'用户类型 '}</Text>
                <Text
                  style={[styles.textInViewFiveInnerLeft, {color: 'black'}]}>{chooseSubscriberType.name}</Text>
              </View>
              <View style={styles.viewFiveInnerRight}>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/arrow_right.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
          {this.renderChoosenPhysicProducts(1)}
          {this.renderChoosenPhysicProducts(2)}
        </View>
      }
    } else {
      return <View style={styles.viewFour}>
        <Text style={styles.textInViewFour}>{'无可选用户类型'}</Text>
      </View>
    }
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
          if (calculate.productDtos) {
            calculate.productDtos.forEach((productInnerCalculate) => {
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
            <Text style={styles.textInViewEight}>{'帐户扣减 ￥' + (!calculate.accoutFee ? 0 : calculate.accoutFee)}</Text>
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


  changeDeductionBalance = (savingFee, totalFee) => {
    const {customerBasicInfo, actualAmount} = this.props;
    runAfterInteractionsBasic(() => {
      this.setState({
        isDeductionBalance: !this.state.isDeductionBalance
      }, () => {
        if (this.state.isDeductionBalance) {
          this.props.dispatch(createAction('newInstall/changeActualAmount')({actualAmount: (customerBasicInfo.accountBalance > savingFee ? (totalFee - savingFee) : (totalFee - customerBasicInfo.accountBalance))}))
          this.setState({
            totalFee: (customerBasicInfo.accountBalance > savingFee ? (totalFee - savingFee) : (totalFee - customerBasicInfo.accountBalance))
          })
        } else {
          this.props.dispatch(createAction('newInstall/changeActualAmount')({actualAmount: totalFee}))
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
    const {choosenPayMethodId} = this.state;
    if (loginData && loginData.jsonData && loginData.jsonData.payMethodIds) {
      const params = {loginData, choosenPayMethodId, onPressToChoosePayMethod: this.onPressToChoosePayMethod}
      return <PayMethod {...params}/>
    }
  }

  render() {
    const {
      operatorCode,
      balanceMoney,
      serviceStr
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
          <Text style={styles.topTextStyle}>{'电视新装'}</Text>
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
              <Text style={[styles.textInViewFour, {marginLeft: 20}]}>{'用户信息'}</Text>
            </View>
            {this.renderBasicInfos()}
            <View style={styles.viewThree}/>
            {this.renderChooseProducts()}
          </ScrollView>
        </View>
        <ModalSearchProductsForNewInstall/>
        <ModalModifyChoosenProductForNewInstall/>
        <ModalSubscriberTypeChoose/>
        <ModalOperationSuccess successTitleText='装机' showAccount={true} account={balanceMoney}
                               successText={`用户服务号码：${serviceStr}`}
                               goBack={this.goBack}/>
        <ModalChoosePhysicProducts/>
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


export default NewInstall
