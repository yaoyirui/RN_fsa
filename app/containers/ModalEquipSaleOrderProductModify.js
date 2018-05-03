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
  Platform,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import {checkProductsAndReturnRequestBodyForEquipSale} from "../utils/checkProductsAndReturnRequestBody"

const {width, height} = Dimensions.get('window')

@connect(({customer, app, payment, equip}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment,
      ...equip
    }
  }
)
class ModalEquipSaleOrderProductModify extends Component {

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
    this.props.dispatch(createAction('equip/closeModifyChooseProductModal')())
  }

  calculateServiceProductsFee = () => {
    const requestBody = checkProductsAndReturnRequestBodyForEquipSale(this.props.chooseProducts);
    if (requestBody && requestBody.length > 0) {
      this.closeModifyChooseProductModal();
      this.props.dispatch(createAction('equip/showChoosenProduct')())
      this.props.dispatch(createAction('equip/calculatePeripheralEquipsFee')({
        requestBody: JSON.stringify(requestBody),
        dispatch: this.props.dispatch
      }))
    }
  }

  choosePricePlan = (product, pricePlan) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('equip/choosePricePlan')({
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
          <TouchableOpacity onPress={this.calculateServiceProductsFee}>
            <Text
              style={[styles.textInViewProductDetailChooseTop, {color: '#00CED1'}]}>{'确定'}</Text>
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

  renderOrderNum = (product) => {
    return <View style={styles.viewOrderNum}>
      <View style={[styles.viewProductDetailPricePlanTop, {width: 60}]}>
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
      <View style={{height: 29, width: 29, borderColor, borderWidth: 1}}>
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

const borderWidth = 0.4;
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
    borderColor,
    borderTopWidth: borderWidth,
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
    borderColor
  },
  viewFour: {
    height: 40,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 0,
    borderBottomWidth: borderWidth,
    borderColor
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
    borderWidth,
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
    borderWidth,
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
  viewOrderNum: {
    width: 215,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageInViewOrderMum: {
    width: 30,
    height: 30
  }
})

export default ModalEquipSaleOrderProductModify
