/**
 * Created by yaoyirui on 2017/9/1.
 */
import React, {PureComponent} from 'react'
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, ScrollView, ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import privilegesMap from '../utils/privileges'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'


var width = Dimensions.get('window').width;

@connect(({app, customer}) => {
  return {...app, ...customer}
})
class BusinessChoosePage extends PureComponent {
  static navigationOptions = {
    title: 'Business',
    tabBarLabel: 'Business',
    tabBarIcon: ({focused, tintColor}) =>
      <Image
        style={[styles.icon, {tintColor: focused ? tintColor : 'gray'}]}
        source={require('../images/business.png')}
      />,
  }


  onPressToBusinessPage = (routeName) => {
    runAfterInteractionsWithToast(() => {
      if (routeName !== 'CustomerSearch'
        && routeName !== 'CheckAccount'
        && routeName !== 'RechargeSearch'
        && routeName !== 'AcceptSearch'
        && routeName !== 'CustomerCreate'
        && this.props.customerBasicInfo.customerId === -1) {
        this.props.dispatch(NavigationActions.navigate({routeName: 'CustomerSearch'}));
        ToastAndroid.show('请先选择客户！', ToastAndroid.SHORT);
      } else {
        this.props.dispatch(NavigationActions.navigate({routeName}));
      }
    })
  }

  onPressToOpenCustomerDetailModal = () => {
    const {customerId} = this.props.customerBasicInfo;
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/queryCustomerByIdOut')({customerId}));
      this.props.dispatch(createAction('customer/openCustomerDetail')());
    })
  }

  renderPrivileges = () => {
    const {loginData} = this.props;
    if (loginData && loginData.jsonData && loginData.jsonData.privileges) {
      const privilegesArray = loginData.jsonData.privileges.split(',');
      return privilegesArray.map((privilege, index) => {
        const privilegeObj = privilegesMap.get(privilege);
        if (privilegeObj) {
          return <TouchableOpacity key={index} onPress={() =>
            this.onPressToBusinessPage(privilegeObj.screen)}>
            <View style={styles.viewFourInner}>
              <Image
                style={styles.imageInViewThreeInnerRight}
                source={privilegeObj.img}
              />
              <Text style={styles.textInViewFourInner}>{privilegeObj.name}</Text>
            </View>
          </TouchableOpacity>
        }
      })
    }

  }

  renderCustomerInfo = () => {
    if (this.props.customerBasicInfo.customerId === -1) {
      return <View style={[styles.viewThree, {justifyContent: 'center', height: 60}]}>
        <TouchableOpacity onPress={() =>
          this.onPressToBusinessPage('CustomerSearch')}>
          < View style={styles.customerSearchViewStyle}>
            <Image
              style={styles.imageInViewThreeInnerRight}
              source={require('../images/search.png')}
            />
            <Text style={{fontSize: 17}}>客户搜索</Text>
          </View>
        </TouchableOpacity>

      </View>
    } else {
      return <View style={styles.viewThree}>
        <TouchableOpacity onPress={this.onPressToOpenCustomerDetailModal}>
          <View style={styles.viewThreeInnerLeft}>
            <View style={styles.viewThreeInnerLeftTop}>
              <Text style={styles.textInViewThreeInnerLeftTop}>{this.props.customerBasicInfo.customerName}</Text>
              <Text style={[styles.textInViewThreeInnerLeftTop, {
                fontSize: 15,
                color: 'grey'
              }]}>{`  ${this.props.customerBasicInfo.contactPhone}`}</Text>
            </View>
            <View style={styles.viewThreeInnerLeftBottom}>
              <Text style={styles.textInViewViewThreeInner}>{this.props.customerBasicInfo.addressStr}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.onPressToBusinessPage('CustomerSearch')
        }}>
          <Image
            style={styles.imageInViewThreeInnerRight}
            source={require('../images/search.png')}
          />
        </TouchableOpacity>
      </View>
    }
  }

  render() {
    const {operatorCode} = this.props.loginData.jsonData || {operatorCode: ''};
    return (
      <View style={styles.container}>
        <View style={styles.viewTop}>
          <Text style={styles.topTextStyle}>{'业务'}</Text>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        {this.renderCustomerInfo()}
        <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
          <View style={styles.viewFour}>
            {this.renderPrivileges()}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const borderWidth = 0.4;
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
  viewTop: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor,
    borderBottomWidth: borderWidth
  },
  topTextStyle: {
    fontSize: 18
  },
  viewSecond: {
    height: 50,
    width: width - 40,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor,
    borderBottomWidth: borderWidth
  },
  textInViewViewSecond: {
    fontSize: 15,
    alignSelf: 'center'
  },
  viewThree: {
    height: 100,
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor,
    borderBottomWidth: borderWidth,
    padding: 20
  },
  viewThreeInnerLeft: {
    width: width * 0.5,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  viewThreeInnerLeftTop: {
    height: 50,
    width,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  viewThreeInnerLeftBottom: {
    height: 50,
    width,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  textInViewThreeInnerLeftTop: {
    fontSize: 20,
    alignSelf: 'flex-end',
    color: 'black'
  },
  textInViewViewThreeInner: {
    fontSize: 15,
    alignSelf: 'center',
    flexWrap: 'wrap'
  },
  imageInViewThreeInnerRight: {
    width: 30,
    height: 30
  },
  viewFour: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderColor,
    flexWrap: 'wrap'
    // borderBottomWidth: borderWhith
  },
  viewFourInner: {
    height: 100,
    width: width / 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor,
    borderWidth
  },
  textInViewFourInner: {
    fontSize: 15
  },
  customerSearchViewStyle: {
    width: width - 60,
    height: 40,
    flexDirection: 'row',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor,
    borderWidth: 2
  },
})

export default BusinessChoosePage
