/**
 * Created by yaoyirui on 2017/11/17.
 */
import React from 'react'
import {StyleSheet, View, Dimensions, Text, TouchableOpacity} from 'react-native'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'

var width = Dimensions.get('window').width;

const renderChooseProducts = (products, calculate, params) => {

  return <View style={{flex: 1, backgroundColor: 'white'}}>
    <View style={styles.viewFour}>
      <Text style={styles.textInViewFour}>{'订购的产品列表'}</Text>
    </View>
    {renderChoosenProductsBottom(products, calculate)}
    <View style={styles.viewThree}/>
    {renderOrderProductBottom(calculate, params)}
  </View>


}

const renderChoosenProductsBottom = (products, calculate) => {
  if (products && products.length > 0) {
    return products.map((product, index) => {
      if (product.choosen) {
        return product.pricePlans ? product.pricePlans.map((pricePlan, indexPR) => {
          if (pricePlan.choosen) {
            let productAmount = 0;
            if (calculate.productFeeInfos) {
              calculate.productFeeInfos.forEach((productInnerCalculate) => {
                if (product.productId === productInnerCalculate.productId) {
                  productAmount = productInnerCalculate.fee;
                }
              })
            }
            return <View key={index} style={styles.viewSix}>
              <View style={styles.viewSixInner}>
                <Text
                  style={styles.textInViewSixInner}>{product.productName + '--' + pricePlan.pricePlanName}</Text>
                <Text
                  style={styles.textInViewSixInner}>{'订购周期(月):' + product.choosenOrderCycle + '  订购费用:￥' + productAmount}</Text>
              </View>
            </View>
          }
        }) : <View/>
      }
    })
  }
}

const renderOrderProductBottom = (calculate, params) => {
  return <View style={styles.viewSeven}>
    <View style={styles.viewSevenInnerLeft}>
      <Text style={styles.textInViewSevenInner}>费用</Text>
    </View>
    <View style={styles.viewSevenInnerRight}>
      <Text style={styles.textInViewSevenInner}>{'￥' + calculate.accoutFee}</Text>
      <Text style={styles.textInViewSevenInner}>{'合计 ￥' + calculate.totalFee}</Text>
      <Text style={styles.textInViewSevenInner}>{'实际缴费金额 ￥' + params.totalFee}</Text>
    </View>
  </View>

}


const renderChooseSubscriber = (chooseSubscriber) => {

  const businessType = (chooseSubscriber.businessTypeId === 2 ? '数字电视业务用户' : (chooseSubscriber.businessTypeId === 1 ? '数据业务用户' : '其他'))
  const status = (chooseSubscriber.statusId === 0 ? '有效' : (chooseSubscriber.statusId === 1 ? '暂停' : (chooseSubscriber.statusId === 2 ? '罚停' : '其他')))

  return <View style={styles.viewFive}>
    <View style={styles.viewFiveInner}>
      <View style={styles.viewFiveInnerLeft}>
        <Text
          style={styles.textInViewFiveInnerLeft}>{businessType + '(终端号:' + chooseSubscriber.terminalNum + ')'}</Text>
      </View>
      <View style={styles.viewFiveInnerRight}>
        <Text style={styles.textInViewFiveInnerRight}>{status}</Text>
      </View>
    </View>
    <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
      <View style={styles.viewFiveInnerLeft}>
        <Text style={styles.textInViewFiveInnerLeft}>{'智能卡号 ' + chooseSubscriber.serviceStr}</Text>
      </View>
    </View>
  </View>
}

function OrderProductConfirmSFC({chooseSubscriber, chooseProducts, calculate, params}) {

  return (
    <View style={styles.container}>
      {renderChooseProducts(chooseProducts, calculate, params)}
      <View style={styles.viewFour}>
        <Text style={styles.textInViewFour}>{'对应的用户'}</Text>
      </View>
      {renderChooseSubscriber(chooseSubscriber)}
      <View style={[styles.viewOne, {borderBottomWidth: 0}]}>
        <View style={styles.viewOneInner}>
          <Text style={styles.textInViewOneInnerLeft}>{'支付方式   '}</Text>
          <Text style={styles.textInViewOneInnerRight}>{params.choosenPayMethodName}</Text>
        </View>
        <View style={styles.viewOneInner}>
          <Text style={styles.textInViewOneInnerLeft}>{'发展人工号   '}</Text>
          <Text
            style={styles.textInViewOneInnerRight}>{params.devCode}</Text>
        </View>
        <View style={styles.viewOneInner}>
          <Text style={styles.textInViewOneInnerLeft}>{'备注   '}</Text>
          <Text
            style={styles.textInViewOneInnerRight}>{params.remark}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={() => {
          runAfterInteractionsBasic(() => {
            params.onPressToOrder()
          })
        }}>
          <View style={styles.viewButtonConfirm}>
            <Text style={styles.textConfirmStyle}>确定</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
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
    width: width - 20,
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
    marginBottom: 30
  },
  textConfirmStyle: {
    fontSize: 18,
    color: 'white'
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
    width: width - 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderColor: borderColor,
    borderBottomWidth: borderWhith,
    paddingLeft: 15
  },
  textInViewFour: {
    fontSize: 15,
    color: 'black',
    marginLeft: 10,
    alignSelf: 'center'
  },
  viewFive: {
    height: 80,
    width: width - 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white',
    borderBottomWidth: borderWhith
  },
  viewFiveInner: {
    height: 40,
    width: width - 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignItems: 'center',
    borderBottomWidth: 0.4,
    paddingLeft: 10,
    paddingRight: 10
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
  viewSix: {
    // height: 50,
    width: width - 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderBottomColor: borderColor,
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: borderWhith
  },
  viewSixInner: {
    width: width - 20,
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderBottomColor: borderColor,
    borderBottomWidth: borderWhith,
    marginLeft: 10,
    marginRight: 10
  },
  textInViewSixInner: {
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
    width: ((width - 20) / 2) - 30,
    flexDirection: 'column',
    marginLeft: 20
  },
  viewSevenInnerRight: {
    height: 70,
    width: ((width - 20) / 2) - 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: 20
  },
  textInViewSevenInner: {
    fontSize: 17,
    color: 'grey'
  },
})

export default OrderProductConfirmSFC;
