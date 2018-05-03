/**
 * Created by yaoyirui on 2017/11/1.
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
import {
  checkProductsAndReturnRequestBody,
  checkProductsAndReturnRequestBodyForEquipSale
} from "../utils/checkProductsAndReturnRequestBody"

const {width, height} = Dimensions.get('window')

const borderWidth = 0.4;
const borderColor = '#C0C0C0';

@connect(({customer, app, payment, equip}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment,
      ...equip
    }
  }
)
class ModalSearchEquip extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      searchStr: ''
    };
  }

  onChooseProducts = () => {
    runAfterInteractionsBasic(() => {
      const requestBody = checkProductsAndReturnRequestBodyForEquipSale(this.props.chooseProducts);
      if (requestBody && requestBody.length > 0) {
        this.closeChooseProductModal()
        this.props.dispatch(createAction('equip/showChoosenProduct')())
        this.props.dispatch(createAction('equip/calculatePeripheralEquipsFee')({
          requestBody: JSON.stringify(requestBody),
          dispatch: this.props.dispatch
        }))
      }
    })
  }

  onSubmitEditing = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('equip/showProductList')())
      this.props.dispatch(createAction('equip/queryCanBeOrderPeripheralEquips')({
        queryStr: this.state.searchStr,
        dispatch: this.props.dispatch
      }))
    })
  }

  onPressToOpenProduct = (product) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('equip/openProductDetail')({productDetail: product}))
    })
  }

  closeChooseProductModal = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('equip/closeChooseProductModal')())
    })
  }

  checkChoosenProduct = (product) => {
    const {pricePlans, productName} = product;
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
    return true;
  }

  addProduct = (product) => {
    if (this.checkChoosenProduct(product)) {
      runAfterInteractionsWithToast(() => {
        this.props.dispatch(createAction('equip/addProduct')({chooseProductTmp: product}))
      })
    }
  }

  removeProduct = (product) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('equip/removeProduct')({chooseProductTmp: product}))
    })
  }

  choosePricePlan = (product, pricePlan) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('equip/choosePricePlan')({
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
    const {products, showProductList, count, dispatch} = this.props;
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
            dispatch(createAction('equip/queryCanBeOrderPeripheralEquipsForPage')({
              queryStr: this.state.searchStr,
              start: products.length,
              row: 12,
              dispatch
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

  _keyExtractor = (item, index) => item.productId + '';

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
        {this.renderOrderNum(product)}
      </View>
    }
    return <View/>
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

  renderOrderNum = (product) => {
    return <View style={styles.viewOrderNum}>
      <View style={[styles.viewProductDetailPricePlanTop, {width: 80}]}>
        <Text style={styles.textInViewProductDetailChooseTop}>订购数量</Text>
      </View><View style={{
      flexDirection: 'row',
      width: 130,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center'
    }}><TouchableOpacity onPress={() => {
      this.props.dispatch(createAction('equip/changeOrderNum')({
        orderNum: -1,
        productId: product.productId
      }))
    }}>
      <Image
        style={styles.imageInViewOrderMum}
        source={require('../images/minus.png')}
      /></TouchableOpacity>
      <View style={{
        height: 29, width: 29, borderColor, borderWidth: 1, flexDirection: 'row', justifyContent: 'center'
      }}>
        <TextInput
          ref={'textInputNum'}
          style={[styles.textInputStyle, {width: 30}]}
          multiline={true}
          keyboardType={'numeric'}
          underlineColorAndroid="transparent"
          defaultValue={product.orderNum + ''}
          onEndEditing={() => this.onNumEndEdit(product)}
        />
      </View>
      <TouchableOpacity onPress={() => {
        this.props.dispatch(createAction('equip/changeOrderNum')({
          orderNum: 1,
          productId: product.productId
        }))
      }}>
        <Image
          style={styles.imageInViewOrderMum}
          source={require('../images/plus.png')}
        />
      </TouchableOpacity></View></View>
  }

  onNumEndEdit = (product) => {
    this.props.dispatch(createAction('equip/changeOrderNum')({
      orderNum: product.orderNum,
      productId: product.productId
    }))
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
    borderTopWidth: borderWidth,
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
    height: 30
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
    borderBottomWidth: borderWidth,
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
    width: 220,
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
    borderWidth: borderWidth,
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
  viewOrderNum: {
    width: 215,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    borderWidth: borderWidth,
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
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor
  },
  imageInViewOrderMum: {
    width: 30,
    height: 30
  },
})

export default ModalSearchEquip
