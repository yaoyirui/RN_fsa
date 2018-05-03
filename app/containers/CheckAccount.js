/**
 * Created by yaoyirui on 2017/9/8.
 */

import WelcomeText from "react-native/local-cli/templates/HelloNavigation/views/welcome/WelcomeText.android";

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  FlatList,
  ToastAndroid,
  DatePickerAndroid
} from 'react-native'

import Toast from 'antd-mobile/lib/toast'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import {
  runAfterInteractionsWithToast,
  runAfterInteractionsBasic
} from '../utils/interactionManagerUtils'
import checkAccountMap from '../utils/checkAccountMap'
import ModalOperationFail from "./ModalOperationFail"
import ModalOperationSuccess from "./ModalOperationSuccess"


var width = Dimensions.get('window').width;


@connect(({app, check}) => {
  return {
    ...app,
    operatorCode: app.operCode,
    ...check
  }
})
class CheckAccount extends Component {

  componentDidMount() {
    this.props.dispatch(createAction('check/queryCheckAccount')());
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('check/reset')())
      this.props.dispatch(NavigationActions.back())
    })
  }

  checkAccount = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('check/checkAccount')())
    })
  }

  renderCheckAcountDate = () => {
    const {queryCheckAccountsResults} = this.props;
    const keys = Object.keys(queryCheckAccountsResults);
    return keys.map((key, index) => {
      if (key === 'checkAccountDate') {
        return <View key={index} style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>轧账日期</Text>
            <Text style={styles.textInViewFiveInnerLeft}>{queryCheckAccountsResults[key]}</Text>
          </View>
        </View>
      }
    })
  }

  renderCheckAcount = () => {
    const {queryCheckAccountsResults} = this.props;
    const keys = Object.keys(queryCheckAccountsResults);
    return keys.map((key, index) => {
      const checkAccountName = checkAccountMap.get(key);
      if (checkAccountName && key !== 'checkAccountDate') {
        return <View key={index} style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{checkAccountName + '  '}</Text>
            <Text style={[styles.textInViewFiveInnerLeft, {color: 'red'}]}>{'￥' + queryCheckAccountsResults[key]}</Text>
          </View>
        </View>
      }
    })
  }

  renderCheckAcountTotal = () => {
    const {queryCheckAccountsResults} = this.props;
    const keys = Object.keys(queryCheckAccountsResults);
    let account = 0;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== 'checkAccountDate' && keys[i] !== 'operatorCode' && keys[i] !== 'operatorName') {
        account += queryCheckAccountsResults[keys[i]];
      }
    }

    return <View style={styles.viewFiveInner}>
      <View style={styles.viewFiveInnerLeft}>
        <Text style={[styles.textInViewFiveInnerLeft, {color: 'black'}]}>总金额</Text>
        <Text style={[styles.textInViewFiveInnerLeft, {color: 'red'}]}>{'￥' + account}</Text>
      </View>
    </View>

  }

  render() {
    const {operatorCode, queryCheckAccountsResults} = this.props;
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
          <Text style={styles.topTextStyle}>{'轧账'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        {this.renderCheckAcountDate()}
        {this.renderCheckAcount()}
        {this.renderCheckAcountTotal()}
        <View style={styles.viewFourOpenInnerBottom}>
          <TouchableOpacity onPress={() => {
            ToastAndroid.show('查询费用明细', ToastAndroid.SHORT);
          }}>
            <View style={styles.queryViewButtonStyle}>
              <Text style={{fontSize: 18, color: 'white'}}>{'费用明细'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.checkAccount}>
            <View
              style={[styles.queryViewButtonStyle, {backgroundColor: 'white', borderColor: 'red', borderWidth: 1}]}>
              <Text style={{fontSize: 18, color: 'red'}}>{'确认轧账'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ModalOperationSuccess successTitleText='轧账' successText='轧账成功' goBack={this.goBack}/>
        <ModalOperationFail failTitleText='轧账'/>
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
    width: width,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    paddingLeft: 30
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
  viewFourOpenInnerBottom: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    padding: 40,
    backgroundColor: '#F5F5F5'
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  queryViewButtonStyle: {
    width: 120,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFive: {
    flex: 1,
    width: width,
    borderWidth: borderWhith,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white'
  },
  viewFiveInner: {
    height: 40,
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignSelf: 'center',
    borderBottomWidth: 0.4
  },
  viewFiveInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    alignSelf: 'center'
  },
  textInViewFiveInnerLeft: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  imageInViewFiveInner: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  }
})

export default CheckAccount
