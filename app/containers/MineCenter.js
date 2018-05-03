/**
 * Created by yaoyirui on 2017/9/6.
 */
import React, {PureComponent} from 'react'
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {NavigationActions} from '../utils'
import {runAfterInteractionsWithToast} from "../utils/interactionManagerUtils";

var width = Dimensions.get('window').width;

@connect(({app}) => app)
class MineCenter extends PureComponent {

  static navigationOptions = {
    title: 'Mine',
    tabBarLabel: '我的',
    tabBarIcon: ({focused, tintColor}) =>
      <Image
        style={[styles.icon, {tintColor: focused ? tintColor : 'gray'}]}
        source={require('../images/me_press.png')}
      />,
  }

  onPressToBusinessPage = (routeName) => {
    if (routeName === 'Login') {
      try {
        this.props.dispatch(createAction('app/logout')());
      } catch (e) {
      }
      this.props.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: routeName})],
      }));
    } else {
      this.props.dispatch(NavigationActions.navigate({routeName: routeName}));
    }
  }

  render() {
    const {operatorName, operatorCode} = this.props.loginData.jsonData || {operatorName: '', operatorCode: ''};
    return (
      <View style={styles.container}>
        <View style={styles.viewTop}><Text style={styles.topTextStyle}>{'个人中心'}</Text></View>
        <View style={styles.viewSecond}>
          <View style={styles.viewSecondInnerLeft}>
            <Image
              style={styles.imageInViewSecondInnerleft}
              source={require('../images/iv_home_tip.png')}
            />
          </View>
          <View style={styles.viewSecondInnerRight}>
            <Text style={styles.textInViewSecondInnerRight1}>{operatorName + '|' + operatorCode}</Text>
          </View>
        </View>
        <View style={styles.viewFour}/>
        <View style={styles.viewFive}>
          <TouchableOpacity onPress={() => {
            this.onPressToBusinessPage('PasswordModify')
          }}>
            <View style={styles.viewFiveInner}>
              <View style={styles.viewFiveInnerLeft}>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/mine_change_pwd.png')}
                />
                <Text style={styles.textInViewFiveInnerLeft}>{'修改密码'}</Text>
              </View>
              <Image
                style={styles.imageInViewFiveInner}
                source={require('../images/arrow_right.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            ToastAndroid.show('当前已是最新版本', ToastAndroid.SHORT);
          }}>
            <View style={styles.viewFiveInner}>
              <View style={styles.viewFiveInnerLeft}>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/mine_system_update.png')}
                />
                <Text style={styles.textInViewFiveInnerLeft}>{'检查更新'}</Text>
              </View>
              <Image
                style={styles.imageInViewFiveInner}
                source={require('../images/arrow_right.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            runAfterInteractionsWithToast(() => {
              this.props.dispatch(createAction('app/clearCache')())
              ToastAndroid.show('清除缓存成功', ToastAndroid.SHORT);
            })
          }}>
            <View style={styles.viewFiveInner}>
              <View style={styles.viewFiveInnerLeft}>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/mine_clear_cache.png')}
                />
                <Text style={styles.textInViewFiveInnerLeft}>{'清除缓存'}</Text>
              </View>
              <Image
                style={styles.imageInViewFiveInner}
                source={require('../images/arrow_right.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.onPressToBusinessPage('Login')
          }}>
            <View style={styles.viewFiveInner}>
              <View style={styles.viewFiveInnerLeft}>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/mine_quit_cur_user.png')}
                />
                <Text style={styles.textInViewFiveInnerLeft}>{'注销'}</Text>
              </View>
              <Image
                style={styles.imageInViewFiveInner}
                source={require('../images/arrow_right.png')}
              />
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
    backgroundColor: '#F5F5F5'
  },
  viewTop: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewSecond: {
    height: 100,
    backgroundColor: '#f34236',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  viewSecondInnerLeft: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  viewSecondInnerRight: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 20
  },
  icon: {
    width: 32,
    height: 32,
  },
  leftIcon: {
    width: 130,
    height: 40,
    marginTop: 5,
    marginBottom: 5
  },
  imageInViewSecondInnerleft: {
    width: 60,
    height: 60,
    marginLeft: 30
  },
  topTextStyle: {
    fontSize: 18
  },
  textInViewSecondInnerRight1: {
    fontSize: 18,
    color: 'white',
    marginLeft: 20
  },
  textInViewSecondInnerRight2: {
    fontSize: 10,
    color: '#DCDCDC',
    marginLeft: 20
  },
  viewFour: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  textInViewFour: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  viewFive: {
    height: 160,
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
  },
})

export default MineCenter
