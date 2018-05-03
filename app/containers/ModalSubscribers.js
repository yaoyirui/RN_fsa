/**
 * Created by yaoyirui on 2017/11/1.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Dimensions, ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast} from '../utils/interactionManagerUtils'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

@connect(({customer, app, payment}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment
    }
  }
)
class ModalSubscribers extends PureComponent {

  onChooseSubscriber = (subscriber) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('product/chooseSubscriber')({chooseSubscriber: subscriber}))
    })
  }

  closeChooseSubscriberModal = () => {
    this.props.dispatch(createAction('product/closeChooseSubscriberModal')())
  }

  renderSubscribers = (subscribers) => {
    if (subscribers) {
      return subscribers.map((subscriber, index) => {
        let businessType = (subscriber.businessTypeId === 2 ? '数字电视业务用户' : (subscriber.businessTypeId === 1 ? '数据业务用户' : '其他'))
        let status = (subscriber.statusId === 0 ? '有效' : (subscriber.statusId === 1 ? '暂停' : (subscriber.statusId === 2 ? '罚停' : '其他')))
        let des = (subscriber.businessTypeId === 2 ? '智能卡号' : '服务号')
        return <TouchableOpacity key={index} onPress={() => {
          this.onChooseSubscriber(subscriber)
        } }><View style={styles.viewOneInner}>
          <View style={styles.viewOneInnerTop}>
            <Text style={styles.textInViewOneInner}>{businessType + '(终端号:' + subscriber.terminalNum + ')'}</Text>
            <Text style={styles.textInViewOneInner}>{status}</Text>
          </View>
          <View style={styles.viewOneInnerBottom}>
            <Text style={styles.textInViewOneInner}>{des + '    ' + subscriber.serviceStr}</Text>
          </View>
        </View>
        </TouchableOpacity>
      })
    }
  }

  render() {

    const {subscribers, showSubscribersModal} = this.props;


    return (
      <Modal style={styles.modal}
             visible={showSubscribersModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeChooseSubscriberModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>请选择用户</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeChooseSubscriberModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
            <View style={styles.viewOne}>
              {this.renderSubscribers(subscribers)}
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 250,
    width: 260
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    width: 260,
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
    height: height - 260,
    width: 260,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderTopWidth: borderWhith
  },
  viewOneInner: {
    height: 70,
    width: 200,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor,
    marginRight: 30,
    marginLeft: 30
  },
  viewOneInnerTop: {
    height: 30,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  viewOneInnerBottom: {
    height: 30,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  textInViewOneInner: {
    fontSize: 15,
    color: 'grey'
  },
})

export default ModalSubscribers
