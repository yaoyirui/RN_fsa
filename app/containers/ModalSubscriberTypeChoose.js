/**
 * Created by yaoyirui on 2018/2/5.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Dimensions, ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast} from '../utils/interactionManagerUtils'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

@connect(({customer, app, payment, newInstall}) => {
    return {
      ...customer,
      customerBasicInfo: app.customerBasicInfo,
      ...payment,
      ...newInstall
    }
  }
)
class ModalSubscriberTypeChoose extends PureComponent {

  onChooseSubscriberType = (subscriberType) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/chooseSubscriberType')({chooseSubscriberType: subscriberType}));
      this.closeChooseSubscriberTypeModal();
    })
  }

  closeChooseSubscriberTypeModal = () => {
    this.props.dispatch(createAction('newInstall/closeChooseSubscriberTypeModal')())
  }

  renderSubscriberType = (subscriberTypes) => {
    if (subscriberTypes) {
      return subscriberTypes.map((subscriberType, index) => {
        return <TouchableOpacity key={index} onPress={() => {
          this.onChooseSubscriberType(subscriberType)
        } }><View style={styles.viewOneInner}>
          <Text style={styles.textInViewOneInner}>{subscriberType.name}</Text>
        </View>
        </TouchableOpacity>
      })
    }
  }

  render() {
    const {newInstallBasicInfo, showChooseSubscriberTypeModal} = this.props;
    const {newInstallDto} = newInstallBasicInfo;
    const {subscriberTypes} = newInstallDto;

    return (
      <Modal style={styles.modal}
             visible={showChooseSubscriberTypeModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeChooseSubscriberModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>用户类型</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeChooseSubscriberTypeModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.viewTitle, {paddingLeft: 20}]}>
            <Text>请选择用户类型</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
            <View style={styles.viewOne}>
              {this.renderSubscriberType(subscriberTypes)}
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderTopWidth: borderWhith
  },
  viewOneInner: {
    height: 50,
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
  textInViewOneInner: {
    fontSize: 20,
    color: 'grey'
  },
  viewTitle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    width: 280,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  }
})

export default ModalSubscriberTypeChoose
