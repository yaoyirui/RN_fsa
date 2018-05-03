/**
 * Created by yaoyirui on 2018/1/30.
 */
/**
 * Created by yaoyirui on 2018/1/30.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'

@connect(({app}) => {
    return {
      ...app
    }
  }
)
class ModalOperationFail extends PureComponent {

  closeFailModal = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('app/closeFail')())
    })
  }

  render() {

    const {
      showFail,
      failTitleText,
      failText
    } = this.props;

    return (
      <Modal style={styles.modal}
             visible={showFail}
             transparent={true}
             maskClosable={false}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>{failTitleText ? failTitleText + '失败' : '提示'}</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeFailModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewOne}>
            <View style={styles.viewOneInner}>
              <Text style={styles.textInViewOneInnerLeft}>{failText}</Text>
            </View>
          </View>
          <View style={styles.viewOneBottom}>
            <TouchableOpacity onPress={this.closeFailModal}>
              <View style={styles.viewButton2}>
                <Text style={styles.text2Style}>确定</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    height: 200,
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
    width: 260
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
    height: 70,
    width: 260,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: borderWhith,
    marginTop: 10,
    borderTopWidth: borderWhith
  },
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 30,
    paddingTop: 10
  },
  textInViewOneInnerLeft: {
    fontSize: 20,
    color: 'grey'
  },
  textInViewOneInnerRight: {
    fontSize: 16,
    color: 'black'
  },
  viewButton2: {
    width: 140,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  text1Style: {
    fontSize: 18,
    color: 'red'
  },
  text2Style: {
    fontSize: 18,
    color: 'white'
  },
  viewOneBottom: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default ModalOperationFail
