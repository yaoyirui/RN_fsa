/**
 * Created by yaoyirui on 2017/9/5.
 */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import ModalBasic from './ModalBasic'
import CustomerDetail from "./CustomerDetailInnerPage";
import {runAfterInteractionsWithToast} from '../utils/interactionManagerUtils'

var width = Dimensions.get('window').width;

@connect(({app, customer}) => {
  return {
    operatorCode: app.operCode,
    customerDetail: customer.customerDetail
  }
})
class CustomerDetailScreen extends PureComponent {

  constructor(props) {
    super(props);
  }

  goBack = () => {
    this.props.dispatch(NavigationActions.navigate({routeName: 'CustomerSearch'}));
  }

  confirmCustomer = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('product/reset')());
      this.props.dispatch(createAction('customer/reset')());
      this.props.dispatch(createAction('app/confirmCustomer')({
        customerBasicInfo: {
          customerId: this.props.customerDetail.id,
          customerName: this.props.customerDetail.customerName,
          contactPhone: this.props.customerDetail.contactPhone,
          addressStr: this.props.customerDetail.addressName,
          accountBalance: this.props.customerDetail.accountBalance
        }
      }));
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'HomeNavigator'})],
      })
      this.props.dispatch(NavigationActions.navigate({routeName: 'BusinessChoosePage'}));
    })
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
          <Text style={styles.topTextStyle}>{'客户详情'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
          <CustomerDetail/>
        </ScrollView>
        <View style={styles.viewFour}>
          <TouchableOpacity onPress={this.goBack}>
            <View style={styles.viewFourInner}>
              <Text style={{color: 'white', fontSize: 15}}>重新查询</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.confirmCustomer}>
            <View style={[styles.viewFourInner, {backgroundColor: 'red'}]}>
              <Text style={{color: 'white', fontSize: 15}}>确定客户</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  viewFourInner: {
    height: 50,
    width: width * 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
})

export default CustomerDetailScreen
