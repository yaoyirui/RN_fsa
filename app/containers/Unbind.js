/**
 * Created by yaoyirui on 2018/1/30.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  ScrollView,
  Image
} from 'react-native'
import {connect} from 'react-redux'
import CustomerBasicMessagePage from "./CustomerBasicMessagePage"
import ModalValidateSubscribers from "./ModalValidateSubscribers"
import ModalOperationFail from "./ModalOperationFail"
import ModalOperationSuccess from "./ModalOperationSuccess"
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import {createAction, NavigationActions} from '../utils'

const width = Dimensions.get('window').width;

@connect(({app, pms}) => {
  return {...app, operatorCode: app.operCode, ...pms}
})
class Unbind extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(createAction('pms/queryValidSubscribers')({
      customerId: this.props.customerBasicInfo.customerId,
      dispatch: this.props.dispatch
    }));
  }

  onPressToChooseSubscribers = () => {
    this.props.dispatch(createAction('pms/queryValidSubscribers')({
      customerId: this.props.customerBasicInfo.customerId,
      dispatch: this.props.dispatch
    }))
    if (this.props.subscribers && this.props.subscribers.length > 0) {
      this.props.dispatch(createAction('pms/showOrCloseChooseSubscriberModal')({showChooseSubscriberModal: true}))
    }
  }

  onPressToRefresh = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('pms/unbind')({subscriberId: this.props.chooseSubscriber.subscriberId}));
    })
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(NavigationActions.back());
    })
  }

  renderChooseSubscriber = () => {
    const {
      chooseSubscriber,
      subscribers
    } = this.props;
    const businessType = (chooseSubscriber.businessTypeId === 2 ? '数字电视业务用户' : (chooseSubscriber.businessTypeId === 1 ? '数据业务用户' : '其他'))
    const status = (chooseSubscriber.statusId === 0 ? '有效' : (chooseSubscriber.statusId === 1 ? '暂停' : (chooseSubscriber.statusId === 2 ? '罚停' : '其他')))
    if (subscribers && subscribers.length > 0) {
      if (chooseSubscriber) {
        return <View style={{flex: 1}}>
          <View style={styles.viewFour}>
            <Text style={styles.textInViewFour}>选择清除绑定的用户</Text>
          </View>
          <View style={styles.viewFive}>
            <TouchableOpacity onPress={() => {
              this.onPressToChooseSubscribers()
            }}>
              <View style={styles.viewFiveInner}>
                <View style={styles.viewFiveInnerLeft}>
                  <Text
                    style={styles.textInViewFiveInnerLeft}>{businessType + '(终端号:' + chooseSubscriber.terminalNum + ')'}</Text>
                </View>
                <View style={styles.viewFiveInnerRight}>
                  <Text style={styles.textInViewFiveInnerRight}>{status}</Text>
                  <Image
                    style={styles.imageInViewFiveInner}
                    source={require('../images/arrow_right.png')}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
              <View style={styles.viewFiveInnerLeft}>
                <Text style={styles.textInViewFiveInnerLeft}>{'智能卡号 ' + chooseSubscriber.serviceStr}</Text>
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={this.onPressToRefresh}>
              <View style={styles.viewButtonConfirm}>
                <Text style={styles.textConfirmStyle}>清除绑定</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      }
    } else {
      return <View style={styles.viewFour}>
        <Text style={styles.textInViewFour}>{'无可选用户'}</Text>
      </View>
    }
  }

  render() {
    const {
      operatorCode
    } = this.props;
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
          <Text style={styles.topTextStyle}>清除绑定</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <CustomerBasicMessagePage showChargeHref={false}/>
        {this.renderChooseSubscriber()}
        <ModalValidateSubscribers/>
        <ModalOperationSuccess successText='清除绑定成功' goBack={this.goBack}/>
        <ModalOperationFail/>
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
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 20,
    borderColor: borderColor,
    borderBottomWidth: borderWhith
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
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5'
  },
  textInViewFour: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  viewFive: {
    height: 80,
    width: width,
    borderWidth: borderWhith,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white'
  },
  viewFiveInner: {
    height: 40,
    width: width - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignItems: 'center',
    borderBottomWidth: 0.4
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
  imageInViewFiveInner: {
    width: 25,
    height: 25
  },
  viewButtonConfirm: {
    width: width - 30,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  textConfirmStyle: {
    fontSize: 18,
    color: 'white'
  }
})

export default Unbind;
