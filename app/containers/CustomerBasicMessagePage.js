/**
 * Created by yaoyirui on 2017/11/1.
 */
import React, {PureComponent} from 'react'
import {StyleSheet, View, Dimensions, Text, TouchableOpacity, TextInput, Platform} from 'react-native'
import {connect} from 'react-redux'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import {createAction, NavigationActions} from '../utils'

var width = Dimensions.get('window').width;

@connect(({customer, app}) => {
    return {
      ...customer, ...app
    }
  }
)
class CustomerBasicMessagePage extends PureComponent {


  onPressToOpenCustomerDetailModal = () => {
    const {customerId} = this.props.customerBasicInfo;
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/queryCustomerByIdOut')({customerId}));
      this.props.dispatch(createAction('customer/openCustomerDetail')())
    })
  }

  onPressToPaymentPage = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(NavigationActions.navigate({routeName: 'PaymentAmount'}));
    })
  }

  renderChargeButton = () => {
    if (!(this.props.showChargeHref === false)) {
      return <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 50
      }
      }><TouchableOpacity onPress={this.onPressToPaymentPage}><Text
        style={[styles.textInViewOneInnerRight, {
          color: '#00CED1'
        }]}>预存缴费</Text></TouchableOpacity></View>
    } else {
      return <View/>
    }

  }

  render() {
    const {customerBasicInfo, customerDetail} = this.props;
    return (
      <View style={styles.viewOne}>
        <View style={styles.viewOneInner}>
          <Text style={styles.textInViewOneInnerLeft}>{'客户名称   '}</Text>
          <Text
            style={styles.textInViewOneInnerRight}>{customerBasicInfo.customerName + '(' + customerDetail.customerCode + ')'}</Text>
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
          {this.renderChargeButton()}
        </View>
      </View>
    )
  }
}

const borderWidth = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({
  viewOne: {
    height: 160,
    width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor,
    borderBottomWidth: borderWidth
  },
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 20
  },
  textInViewOneInnerLeft: {
    fontSize: 15,
    color: 'grey'
  },
  textInViewOneInnerRight: {
    fontSize: 16,
    color: 'black'
  },
  textInputStyle: {
    height: 35,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  }
})

export default CustomerBasicMessagePage
