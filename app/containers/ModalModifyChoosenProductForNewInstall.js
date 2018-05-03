/**
 * Created by yaoyirui on 2018/2/8.
 */
/**
 * Created by yaoyirui on 2017/11/13.
 */
import React, {Component} from 'react';
import {Modal} from 'antd-mobile';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ToastAndroid,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

@connect(({customer, app, payment, newInstall}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment,
      ...newInstall
    }
  }
)
class ModalModifyChoosenProductForNewInstall extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchStr: '',
      choosenPro: [{
        productId: -1,
        pricePlanId: -1,
        orderCycles: '',
        componentsParams: [
          {
            componentId: -1,
            products: [{
              productId: -1,
              pricePlanId: -1,
              orderCycles: '',
            }]
          }
        ]
      }]
    };
  }


  closeModifyChooseProductModal = () => {
    this.props.dispatch(createAction('newInstall/closeModifyChooseProductModal')())
  }

  checkAndReturnChoosenProducts = () => {
    const products = this.props.chooseProducts;
    if (products && products.length > 0) {
      let choosenProductOrNot = false
      let choosenPricePlanOrNot = false
      let choosenOrderCycleOrNot = false
      let requestBody = [];
      for (let i = 0; i < products.length; i++) {
        const requestBodyInnerObj = {};
        const product = products[i];
        const ordermodeid = product.ordermodeid;
        const choosenOrderCycle = product.choosenOrderCycle;

        if (product.choosen) {
          choosenProductOrNot = true;
          requestBodyInnerObj.productId = product.productId;
          if (ordermodeid === 2 && choosenOrderCycle) {
            choosenOrderCycleOrNot = true;
          }
          if (choosenOrderCycle) {
            requestBodyInnerObj.orderCycles = choosenOrderCycle;
          }
          const pricePlans = product.pricePlans;
          for (let j = 0; j < pricePlans.length; j++) {
            const pricePlan = pricePlans[j];
            if (pricePlan.choosen) {
              choosenPricePlanOrNot = true;
              requestBodyInnerObj.pricePlanId = pricePlan.pricePlanId;
            }
          }
          if (!choosenPricePlanOrNot) {
            ToastAndroid.show('产品\"' + product.productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
            return false;
          }
          if (ordermodeid === 2 && !choosenOrderCycle) {
            ToastAndroid.show('产品\"' + product.productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
            return false;
          }
        }
        if (requestBodyInnerObj.productId) {
          requestBody.push(requestBodyInnerObj);
        }
      }
      if (!choosenProductOrNot) {
        ToastAndroid.show('请选择产品！', ToastAndroid.SHORT);
        return false;
      } else {
        return requestBody;
      }
    } else {
      ToastAndroid.show('没有可用产品！', ToastAndroid.SHORT);
      return false;
    }
  }

  calculateServiceProductsFee = () => {
    const requestBody = this.checkAndReturnChoosenProducts();
    if (requestBody && requestBody.length > 0) {
      const {chooseSubscriber} = this.props;
      this.closeModifyChooseProductModal();
      this.props.dispatch(createAction('newInstall/showChoosenProduct')())
      this.props.dispatch(createAction('newInstall/calculateServiceProductsFee')({
        subscriberId: chooseSubscriber.subscriberId,
        requestBody: JSON.stringify(requestBody),
        dispatch: this.props.dispatch
      }))
    }
  }

  chooseValidDuration = (product, validDuration) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/chooseOrderCycle')({
        productId: product.productId,
        validDuration: validDuration
      }))
    })
  }

  choosePricePlan = (product, pricePlan) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/choosePricePlan')({
        productId: product.productId,
        pricePlanId: pricePlan.pricePlanId
      }))
    })
  }

  renderProducts = (choosenProductId) => {
    const products = this.props.chooseProducts;
    if (products && products.length > 0) {
      return products.map((product, index) => {
        if (choosenProductId === product.productId) {
          return <View key={index} style={{borderBottomWidth: 1, borderColor: '#C0C0C0'}}>
            {this.renderProductDetail(product)}
            {this.renderComponents(product, product.componets)}
          </View>
        }
      })
    }
  }

  renderProductDetail = (product) => {
    if (product.openDetail) {
      return <View style={styles.viewProductDetail}>
        <View style={styles.viewProductDetailPricePlanTop}>
          <Text style={styles.textInViewProductDetailChooseTop}>价格计划</Text>
          <TouchableOpacity onPress={() => this.calculateServiceProductsFee()}>
            <Text
              style={[styles.textInViewProductDetailChooseTop, {color: '#00CED1'}]}>{'确定'}</Text>
          </TouchableOpacity>
        </View>
        {this.renderPricePlans(product, product.pricePlans)}
        {this.renderValidDurations(product)}
      </View>
    }
    return <View/>
  }


  renderPricePlans = (product, pricePlans) => {
    if (pricePlans && pricePlans.length > 0) {
      return pricePlans.map((pricePlan, index) => {
        if (pricePlan && pricePlan.choosen) {
          return <TouchableOpacity key={index} onPress={() => this.choosePricePlan(product, pricePlan)}><View
            style={styles.viewButtonPricePlanChoosen}>
            <Text style={styles.textInViewButtonPricePlan}>{pricePlan && pricePlan.pricePlanName}</Text>
          </View></TouchableOpacity>
        } else {
          return <TouchableOpacity key={index} onPress={() => this.choosePricePlan(product, pricePlan)}><View
            style={styles.viewButtonPricePlan}>
            <Text
              style={[styles.textInViewButtonPricePlan, {color: 'red'}]}>{pricePlan && pricePlan.pricePlanName}</Text>
          </View></TouchableOpacity>
        }
      })
    }
  }

  renderValidDurations = (product) => {
    const ordermodeid = product.ordermodeid;
    const validdurationid = product.validdurationid;
    const choosenOrderCycle = product.choosenOrderCycle;
    let validdurationViewArray = [];
    if (ordermodeid === 2 || ordermodeid === 3) {
      if (validdurationid) {
        validdurationViewArray = validdurationid.split(',');
      }
      return <View style={styles.viewValidDuration}>
        <View style={styles.viewProductDetailPricePlanTop}>
          <Text style={styles.textInViewProductDetailChooseTop}>订购周期/月</Text>
        </View>
        <View style={styles.viewValidDurationBottom}>
          {validdurationViewArray ? validdurationViewArray.map((validduration, index) => {
            if (choosenOrderCycle === validduration) {
              return <TouchableOpacity key={index}
                                       onPress={() => this.chooseValidDuration(product, validduration)}><View
                key={index}
                style={styles.viewButtonValidDurationChoosen}><Text
                style={[styles.textInViewButtonValidDuration, {color: 'white'}]}>{validduration}</Text></View></TouchableOpacity>
            } else {
              return <TouchableOpacity key={index}
                                       onPress={() => this.chooseValidDuration(product, validduration)}><View
                style={styles.viewButtonValidDuration}><Text
                style={styles.textInViewButtonValidDuration}>{validduration}</Text></View></TouchableOpacity>
            }

          }) : <View/>}
        </View>
      </View>
    }
    return <View/>
  }

  renderComponents = (packageProduct, componets) => {
    if (componets && componets.length > 0) {
      return <View style={[styles.viewValidDuration, {borderBottomWidth: borderWhith, borderBottomColor: borderColor}]}>
        <View style={styles.viewProductDetailPricePlanTop}>
          <Text style={styles.textInViewProductDetailChooseTop}>包信息</Text>
        </View>
        {
          componets.map((componet, index) => {
            return <View key={index} style={[styles.viewValidDuration, {
              borderBottomWidth: borderWhith,
              borderBottomColor: borderColor
            }]}>
              <View style={[styles.viewComponetDetailTop, {height: 35}]}>
                <Text style={styles.textInViewProductDetailChooseTop}>{componet.componentName}</Text>
                <Text
                  style={styles.textInViewProductDetailChooseTop}>{'可选数量：' + componet.orderminvalue + '~' + componet.ordermaxvalue}</Text>
              </View>
              {this.renderProductInComponent(packageProduct, componet)}
            </View>
          })
        }
      </View>
    }
  }

  renderProductInComponent = (packageProduct, component) => {
    const componentDetails = component.componentDetails;
    if (componentDetails && componentDetails.length > 0) {
      return componentDetails.map((productInComponent, index) => {
        return <View key={index} style={{flex: 1}}>
          <View style={[styles.viewComponetDetailTop, {width: 195, height: 35}]}>
            <View style={{flex: 1}}>
              <Text style={styles.textInViewProductDetailChooseTop}>{productInComponent.productName}</Text>
            </View>
            <View><TouchableOpacity onPress={() => {
              this.onPressChooseProductInComponent(packageProduct, component, productInComponent)
            } }>
              {this.renderChooseOrNot(productInComponent)}
            </TouchableOpacity></View>
          </View>
          {this.renderProductDetailInComponent(packageProduct, component, productInComponent)}
        </View>
      })
    }
    return <View/>
  }

  renderChooseOrNot = (productInComponent) => {
    if (productInComponent.isRequired) {
      return <Image
        style={[styles.ic_icon, {width: 20, height: 20}]}
        source={require('../images/selected.png')}
      />
    } else {
      if (productInComponent.choosen) {
        return <Image
          style={[styles.ic_icon, {width: 20, height: 20}]}
          source={require('../images/selected.png')}
        />
      }
      return <Image
        style={[styles.ic_icon, {width: 20, height: 20}]}
        source={require('../images/unselected.png')}
      />
    }
  }

  onPressChooseProductInComponent = (packageProduct, component, product) => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('newInstall/addOrRemoveProductInComponent')({
        packageProductId: packageProduct.productId,
        componentId: component.componentId,
        productId: product.productId
      }))
    })
  }

  renderProductDetailInComponent = (packageProduct, component, product) => {
    return <View style={[styles.viewProductDetail, {width: 195}]}>
      <View style={[styles.viewProductDetailPricePlanTop, {width: 195}]}>
        <Text style={styles.textInViewProductDetailChooseTop}>价格计划</Text>
      </View>
      {this.renderPricePlansInComponent(packageProduct, component, product, product.priceplans)}
      {this.renderValidDurationsInComponent(packageProduct, component, product)}
    </View>
  }

  renderPricePlansInComponent = (packageProduct, component, product, pricePlans) => {
    if (pricePlans && pricePlans.length > 0) {
      return pricePlans.map((pricePlan, index) => {
        if (pricePlan.choosen) {
          return <TouchableOpacity key={index}
                                   onPress={() => this.choosePricePlanInComponent(packageProduct, component, product, pricePlan)}><View
            key={index}
            style={[styles.viewButtonPricePlanChoosen, {width: 170, height: 40}]}>
            <Text style={styles.textInViewButtonPricePlan}>{pricePlan.pricePlanName}</Text>
          </View></TouchableOpacity>
        } else {
          return <TouchableOpacity key={index}
                                   onPress={() => this.choosePricePlanInComponent(packageProduct, component, product, pricePlan)}><View
            style={[styles.viewButtonPricePlan, {width: 170, height: 40}]}>
            <Text style={[styles.textInViewButtonPricePlan, {color: 'red'}]}>{pricePlan.pricePlanName}</Text>
          </View></TouchableOpacity>
        }
      })
    }
  }

  choosePricePlanInComponent = (packageProduct, component, product, pricePlan) => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('newInstall/choosePricePlanInComponent')({
        packageProductId: packageProduct.productId,
        componentId: component.componentId,
        productId: product.productId,
        pricePlanId: pricePlan.pricePlanId
      }));
    });
  }

  renderValidDurationsInComponent = (packageProduct, component, product) => {
    const ordermodeid = product.orderModeId;
    const validdurationid = product.validDurationId;
    let validdurationViewArray = [];
    if (ordermodeid === 2 || ordermodeid === 3) {
      if (validdurationid) {
        validdurationViewArray = validdurationid.split(',');
      }
      return <View style={[styles.viewValidDuration, {width: 200}]}>
        <View style={[styles.viewProductDetailPricePlanTop, {width: 200}]}>
          <Text style={styles.textInViewProductDetailChooseTop}>订购周期/月</Text>
        </View>
        {this.renderValidDurationsDetailInComponent(packageProduct, component, product, validdurationViewArray)}
      </View>
    }
    return <View/>
  }

  renderValidDurationsDetailInComponent = (packageProduct, component, product, validdurationViewArray) => {
    if (packageProduct.orderModeConId) {
      return <View style={styles.viewProductDetailPricePlanTop}>
        <Text style={[styles.textInViewProductDetailChooseTop, {marginLeft: 10}]}>同套餐订购周期</Text>
      </View>
    } else {
      return <View style={styles.viewValidDurationBottom}>
        {validdurationViewArray ? validdurationViewArray.map((validduration, index) => {
          if (product.choosenOrderCycle === validduration) {
            return <TouchableOpacity key={index}
                                     onPress={() => this.chooseValidDurationInComponent(packageProduct, component, product, validduration)}><View
              key={index}
              style={styles.viewButtonValidDurationChoosen}><Text
              style={[styles.textInViewButtonValidDuration, {color: 'white'}]}>{validduration}</Text></View></TouchableOpacity>
          } else {
            return <TouchableOpacity key={index}
                                     onPress={() => this.chooseValidDurationInComponent(packageProduct, component, product, validduration)}><View
              style={styles.viewButtonValidDuration}><Text
              style={styles.textInViewButtonValidDuration}>{validduration}</Text></View></TouchableOpacity>
          }
        }) : <View/>}
      </View>
    }
  }

  chooseValidDurationInComponent = (packageProduct, component, product, validDuration) => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('newInstall/chooseOrderCycleInComponent')({
        packageProductId: packageProduct.productId,
        componentId: component.componentId,
        productId: product.productId,
        validDuration: validDuration
      }))
    })
  }


  render() {

    const {showModifyProductsModal, modifyProductId} = this.props;

    return (
      <Modal style={styles.modal}
             visible={showModifyProductsModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeModifyChooseProductModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>编辑产品信息</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeModifyChooseProductModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewOne}>
            <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
              {this.renderProducts(modifyProductId)}
            </ScrollView>
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
    height: height - 250,
    width: 280
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    width: 280,
    paddingBottom: 20
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
    height: height - 290,
    width: 280,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    alignItems: 'center'
  },
  viewTwo: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textInViewOneInner: {
    fontSize: 15,
    color: 'grey'
  },
  textInputViewStyle: {
    width: 220,
    height: 35,
    borderColor: 'grey',
    paddingRight: 10,
    paddingLeft: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'center',
    alignItems: 'center'
  },
  textInputViewStyleCode: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  textInputStyle: {
    width: 200,
    height: 35,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
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
    width: 120,
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
  viewProductDetail: {
    width: 250,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewFour: {
    height: 40,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 0,
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewInViewFourInnerLeft: {
    height: 50,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  imageInViewInner: {
    width: 30,
    height: 30
  },
  viewProductDetailPricePlanTop: {
    width: 215,
    height: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInViewProductDetailChooseTop: {
    fontSize: 15,
    color: 'grey'
  },
  viewButtonPricePlan: {
    width: 200,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWhith,
    borderColor: 'red',
    margin: 2
  },
  viewButtonPricePlanChoosen: {
    width: 200,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  textInViewButtonPricePlan: {
    fontSize: 15,
    color: 'white'
  },
  viewValidDuration: {
    width: 215,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  viewValidDurationBottom: {
    width: 235,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  viewButtonValidDuration: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWhith,
    borderColor: 'red',
    margin: 2
  },
  viewButtonValidDurationChoosen: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  textInViewButtonValidDuration: {
    fontSize: 15,
    color: 'red'
  },
  viewComponetDetailTop: {
    width: 205,
    height: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor
  }
})

export default ModalModifyChoosenProductForNewInstall
