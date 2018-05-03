/**
 * Created by yaoyirui on 2018/2/6.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  ToastAndroid,
  FlatList,
  KeyboardAvoidingView
} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import {checkProductsAndReturnRequestBody} from "../utils/checkProductsAndReturnRequestBody"

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

@connect(({customer, app, payment, newInstall}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment,
      ...newInstall
    }
  }
)
class ModalSearchProductsForNewInstall extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      searchStr: ''
    };
  }

  onChooseProducts = () => {
    runAfterInteractionsBasic(() => {
      checkProductsAndReturnRequestBody(this.props.chooseProducts);
      this.closeChooseProductModal()
      // this.props.dispatch(createAction('newInstall/showChoosenProduct')())
      // this.props.dispatch(createAction('newInstall/calculateServiceProductsFee')({
      //   subscriberId: chooseSubscriber.subscriberId,
      //   requestBody: JSON.stringify(requestBody),
      //   dispatch: this.props.dispatch
      // }))
      this.props.dispatch(createAction('newInstall/queryPhysicalProduct')({
        dispatch: this.props.dispatch
      }))
    })
  }

  onSubmitEditing = () => {
    this.props.dispatch(createAction('newInstall/showProductList')())
    this.props.dispatch(createAction('newInstall/queryCanBeOrderServiceProducts')({
      queryStr: this.state.searchStr,
      dispatch: this.props.dispatch
    }))
  }

  onPressToOpenProduct = (product) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/openProductDetail')({productDetail: product}))
    })
  }

  closeChooseProductModal = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('newInstall/closeChooseProductModal')())
    })
  }

  checkChoosenProduct = (product) => {
    const {ordermodeid, choosenOrderCycle, pricePlans, productName, componets} = product;
    let choosenPricePlanOrNot = false
    for (let j = 0; j < pricePlans.length; j++) {
      const pricePlan = pricePlans[j];
      if (pricePlan.choosen) {
        choosenPricePlanOrNot = true;
      }
    }
    if (!choosenPricePlanOrNot) {
      ToastAndroid.show('产品\"' + productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
      return false;
    }
    if (ordermodeid === 2 && !choosenOrderCycle) {
      ToastAndroid.show('产品\"' + productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
      return false;
    }
    if (componets && componets.length > 0) {
      let choosenComponentCount = 0;
      for (let i = 0; i < componets.length; i++) {
        const {componentDetails, minChoosenProCount, maxChoosenProCount, componentName, choosen} = componets[i];
        if (choosen) {
          choosenComponentCount++;
          let choosenProInComCount = 0;
          for (let j = 0; j < componentDetails.length; j++) {
            const productInComponent = componentDetails[j];
            const {priceplans, choosen, productName, orderModeId, choosenOrderCycle} = productInComponent;
            if (choosen) {
              choosenProInComCount++;
              let choosenPricePlanInComCount = 0;
              for (let k = 0; k < priceplans.length; k++) {
                if (priceplans[k].choosen) {
                  choosenPricePlanInComCount++;
                }
              }
              if (choosenPricePlanInComCount === 0) {
                ToastAndroid.show('包内产品\"' + productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
                return false;
              }
              if (orderModeId === 2 && choosenOrderCycle) {
                ToastAndroid.show('包内产品\"' + productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
                return false;
              }
            }
          }
          if (choosenProInComCount < minChoosenProCount || choosenProInComCount > maxChoosenProCount) {
            ToastAndroid.show('包\"' + componentName + '\"可选产品数量范围为：' + minChoosenProCount + '~' + maxChoosenProCount + '！', ToastAndroid.SHORT);
            return false;
          }
        }
      }
      if (choosenComponentCount === 0) {
        ToastAndroid.show('套餐产品\"' + productName + '\"没有选择包！', ToastAndroid.SHORT);
        return false;
      }
    }
    return true;
  }

  addProduct = (product) => {
    if (this.checkChoosenProduct(product)) {
      runAfterInteractionsWithToast(() => {
        this.props.dispatch(createAction('newInstall/addProduct')({chooseProductTmp: product}))
      })
    }
  }

  removeProduct = (product) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/removeProduct')({chooseProductTmp: product}))
    })
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

  renderUpOrDown = (product) => {
    if (product && !product.openDetail) {
      return <Image
        style={styles.imageInViewInner}
        source={require('../images/arrow_right.png')}
      />
    }
    return <Image
      style={styles.imageInViewInner}
      source={require('../images/down.png')}
    />
  }

  renderProducts = () => {
    const {products, showProductList, count} = this.props;
    if (showProductList) {
      return <FlatList
        ref={'productsFl'}
        data={products}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._itemSeparatorComponent}
        onEndReachedThreshold={0.1}
        initialNumToRender={12}
        showsVerticalScrollIndicator={true}
        onEndReached={(info) => {
          if (count > 12) {
            this.props.dispatch(createAction('newInstall/queryCanBeOrderServiceProductsForPage')({
              queryStr: this.state.searchStr,
              start: products.length,
              row: 12,
              dispatch: this.props.dispatch
            }))
          }
        }}
      />
    }

  }

  _renderItem = ({item}) => (
    <View style={{justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => {
        this.onPressToOpenProduct(item)
      }}>
        <View style={styles.viewFour}>
          <View style={styles.viewInViewFourInnerLeft}>
            <Text style={styles.textInViewFourAndFiveStyle}>{item.productName}</Text>
          </View>
          {this.renderUpOrDown(item)}
        </View>
      </TouchableOpacity>
      {this.renderProductDetail(item)}
    </View>
  );

  _itemSeparatorComponent = () => {
    return <View style={{
      height: 0.5,
      width: width - 40, backgroundColor: 'grey',
      marginRight: 5
    }}/>
  }

  _keyExtractor = (item, index) => item.productId;

  renderProductDetail = (product) => {
    if (product.openDetail) {
      return <View style={styles.viewProductDetail}>
        <View style={styles.viewProductDetailPricePlanTop}>
          <Text style={styles.textInViewProductDetailChooseTop}>价格计划</Text>
          <TouchableOpacity onPress={() => {
            if (product.choosen) {
              this.removeProduct(product)
            } else {
              this.addProduct(product)
            }
          }}>
            <Text
              style={[styles.textInViewProductDetailChooseTop, {color: '#00CED1'}]}>{product.choosen ? '移除' : '确定'}</Text>
          </TouchableOpacity>
        </View>
        {this.renderPricePlans(product, product.pricePlans)}
        {this.renderValidDurations(product)}
        {this.renderComponents(product, product.components)}
      </View>
    }
    return <View/>
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


  renderPricePlans = (product, pricePlans) => {
    if (pricePlans && pricePlans.length > 0) {
      return pricePlans.map((pricePlan, index) => {
        if (pricePlan.choosen) {
          return <TouchableOpacity key={index} onPress={() => this.choosePricePlan(product, pricePlan)}><View
            key={index}
            style={styles.viewButtonPricePlanChoosen}>
            <Text style={styles.textInViewButtonPricePlan}>{pricePlan.pricePlanName}</Text>
          </View></TouchableOpacity>
        } else {
          return <TouchableOpacity key={index} onPress={() => this.choosePricePlan(product, pricePlan)}><View
            style={styles.viewButtonPricePlan}>
            <Text style={[styles.textInViewButtonPricePlan, {color: 'red'}]}>{pricePlan.pricePlanName}</Text>
          </View></TouchableOpacity>
        }
      })
    }
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

  renderValidDurations = (product) => {
    const ordermodeid = product.ordermodeid;
    const validdurationid = product.orderCycles;
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
            }}>
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

  renderButtons = () => {
    const {products, showProductList} = this.props;
    let choosenCount = 0;
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (product.choosen) {
          choosenCount++
        }
      });
    }
    if (showProductList && products && products.length > 0) {
      return <View style={styles.viewTwo}>
        <TouchableOpacity onPress={() => {
          this.closeChooseProductModal()
        }}>
          <View style={styles.viewButton1}>
            <Text style={styles.text1Style}>返回</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onChooseProducts}>
          <View style={styles.viewButton2}>
            <Text style={styles.text2Style}>{choosenCount === 0 ? '订购' : '订购(' + choosenCount + ')'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    }
  }

  render() {

    const {showProductsModal} = this.props;

    return (
      <Modal style={styles.modal}
             visible={showProductsModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeChooseProductModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={[styles.textInputViewStyle, styles.textInputViewStyleCode]}>
              <TouchableOpacity onPress={this.onSubmitEditing}>
                <View style={styles.view_icon_style}>
                  <Image
                    style={styles.ic_icon}
                    source={require('../images/search.png')}
                  />
                </View>
              </TouchableOpacity>
              <TextInput
                ref={'textInputSearch'}
                style={styles.textInputStyle}
                placeholder='输入产品或价格计划名称'
                returnKeyType='search'
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({'searchStr': text})}
                onSubmitEditing={this.onSubmitEditing}
              />

            </View>
          </View>
          <View style={styles.viewOne}>
            {this.renderProducts()}
          </View>
          {this.renderButtons()}
        </View>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 150,
    width: 280
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
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
    marginLeft: 60,
    marginRight: 60,
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
    width: 170,
    height: 35,
    marginTop: 3,
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
    width: 260,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewInViewFourInnerLeft: {
    height: 50,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
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

export default ModalSearchProductsForNewInstall
