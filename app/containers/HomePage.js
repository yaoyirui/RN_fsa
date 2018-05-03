/**
 * Created by yaoyirui on 2017/9/1.
 */
import React, {Component} from 'react'
import {
  StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, ScrollView, ToastAndroid
} from 'react-native'
import {connect} from 'react-redux'

import {createAction, NavigationActions} from '../utils'
import {runAfterInteractionsWithToast} from '../utils/interactionManagerUtils'

var width = Dimensions.get('window').width;

@connect(({app}) => app)
class HomePage extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarLabel: '首页',
    tabBarIcon: ({focused, tintColor}) =>
      <Image
        style={[styles.icon, {tintColor: focused ? tintColor : 'gray'}]}
        source={require('../images/house.png')}
      />,
  }

  constructor(props) {
    super(props);
    this.onPressToBusinessPage = this.onPressToBusinessPage.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(createAction('app/queryHomePageInfoEffect')({dispatch: this.props.dispatch}));
  }

  onPressToBusinessPage = (routeName) => {
    runAfterInteractionsWithToast(() => {
      if (this.props.customerBasicInfo.customerId === -1) {
        this.props.dispatch(NavigationActions.navigate({routeName: 'CustomerSearch'}));
        ToastAndroid.show('请先选择客户！', ToastAndroid.SHORT);
      } else {
        this.props.dispatch(NavigationActions.navigate({routeName: routeName}));
      }
    })
  }

  render() {
    const {dispatch} = this.props;
    const {operatorName, slogan} = this.props.loginData.jsonData || {operatorName: '', slogan};
    const homePageInfoArray = this.props.homePageInfo.length > 0 ? this.props.homePageInfo : [{
      name: '当天业务受理数',
      num: 0,
      units: '元'
    }, {name: '当天缴费金额', num: 0, units: '金额'}, {name: '当天客户建档数', num: 0, units: '户'}];


    let date = new Date();

    let timeStr = date.getHours() > 0 && date.getHours() <= 12 ? '上午' : '下午';

    return (
      <View style={styles.container}>
        <View style={styles.viewTop}><Image
          style={styles.leftIcon}
          source={require('../images/iv_main_title_left.png')}
        /></View>
        <View style={styles.viewSecond}>

          <View style={styles.viewSecondInnerLeft}>
            <TouchableOpacity onPress={() => {
              runAfterInteractionsWithToast(() => {
                dispatch(NavigationActions.navigate({routeName: 'MineCenter'}));
              })
            }}>
              <Image
                style={styles.imageInViewSecondInnerleft}
                source={require('../images/iv_home_tip.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.viewSecondInnerRight}>
            <Text style={styles.textInViewSecondInnerRight1}>{operatorName + '，' + timeStr + '好！'}</Text>
            <Text style={styles.textInViewSecondInnerRight2}>{slogan}</Text>
          </View>
        </View>
        <View style={styles.viewThree}>
          <View style={styles.viewThreeInnerleft}>
            <Text style={styles.textViewThreeStyle}>{homePageInfoArray[0].name}</Text>
            <Text style={styles.textViewThreeStyleCenterBlack}>{homePageInfoArray[0].num}</Text>
            <Text style={styles.textViewThreeStyleCenter}>{homePageInfoArray[0].units}</Text>
          </View>
          <View style={styles.viewThreeInnerRight}>
            <View style={styles.viewThreeInnerRightTop}>
              <Text style={styles.textViewThreeStyle}>{homePageInfoArray[1].name}</Text>
              <Text style={styles.textViewThreeStyleCenterBlack}>{homePageInfoArray[1].num}</Text>
              <Text style={styles.textViewThreeStyleCenter}>{homePageInfoArray[1].units}</Text>
            </View>
            <View style={styles.viewThreeInnerRightBottom}>
              <Text style={styles.textViewThreeStyle}>{homePageInfoArray[2].name}</Text>
              <Text style={[styles.textViewThreeStyleCenterBlack, {marginLeft: 17}]}>{homePageInfoArray[2].num}</Text>
              <Text style={styles.textViewThreeStyleCenter}>{homePageInfoArray[2].units}</Text>
            </View>
          </View>
        </View>
        <View style={styles.viewFour}>
          <Text style={styles.textInViewFour}>{'常用功能'}</Text>
        </View>

        <ScrollView>
          <View style={styles.viewFive}>
            <TouchableOpacity onPress={() => {
              this.onPressToBusinessPage('CustomerCreate')
            }}>
              <View style={styles.viewFiveInner}>
                <View style={styles.viewFiveInnerLeft}>
                  <Image
                    style={styles.imageInViewFiveInner}
                    source={require('../images/drag_customer_file.png')}
                  />
                  <Text style={styles.textInViewFiveInnerLeft}>{'客户建档'}</Text>
                </View>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/arrow_right.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.onPressToBusinessPage('PaymentAmount')
            }}>
              <View style={styles.viewFiveInner}>
                <View style={styles.viewFiveInnerLeft}>
                  <Image
                    style={styles.imageInViewFiveInner}
                    source={require('../images/drag_payment.png')}
                  />
                  <Text style={styles.textInViewFiveInnerLeft}>{'预存缴费'}</Text>
                </View>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/arrow_right.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.onPressToBusinessPage('EquipSale')
            }}>
              <View style={styles.viewFiveInner}>
                <View style={styles.viewFiveInnerLeft}>
                  <Image
                    style={styles.imageInViewFiveInner}
                    source={require('../images/drag_sale.png')}
                  />
                  <Text style={styles.textInViewFiveInnerLeft}>{'周边销售'}</Text>
                </View>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/arrow_right.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.onPressToBusinessPage('CheckAccount')
            }}>
              <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
                <View style={styles.viewFiveInnerLeft}>
                  <Image
                    style={styles.imageInViewFiveInner}
                    source={require('../images/drag_check_account.png')}
                  />
                  <Text style={styles.textInViewFiveInnerLeft}>{'轧账'}</Text>
                </View>
                <Image
                  style={styles.imageInViewFiveInner}
                  source={require('../images/arrow_right.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'center'
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
    fontSize: 18,
    marginLeft: 40
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
  viewThree: {
    marginTop: 20,
    height: 160,
    width: width,
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white'
  },
  viewThreeInnerleft: {
    height: 160,
    width: width * 0.5,
    borderRightWidth: borderWhith,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
  },
  viewThreeInnerRight: {
    height: 160,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
  },
  viewThreeInnerRightTop: {
    height: 80,
    borderBottomWidth: borderWhith,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
  },
  viewThreeInnerRightBottom: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
  },
  textViewThreeStyle: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 10
  },
  textViewThreeStyleCenter: {
    fontSize: 14,
    marginTop: 30,
    alignSelf: 'center'
  },
  textViewThreeStyleCenterBlack: {
    fontSize: 20,
    color: 'black',
    marginLeft: 30,
    marginRight: 5,
    marginTop: 30,
    alignSelf: 'center'
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
  },
})

export default HomePage
