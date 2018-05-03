/**
 * Created by yaoyirui on 2017/9/8.
 */

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
  ToastAndroid,
} from 'react-native'

import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import {
  runAfterInteractionsWithToast,
  runAfterInteractionsBasic
} from '../utils/interactionManagerUtils'
import ModalOperationFail from "./ModalOperationFail"
import ModalOperationSuccess from "./ModalOperationSuccess"


var width = Dimensions.get('window').width;


@connect(({app}) => {
  return {
    ...app
  }
})
class PasswordModify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pwd: '',
      newPwd: '',
      confirmPwd: '',
      showPwd: false
    };
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(NavigationActions.back())
    })
  }

  checkAndCommit = () => {

    if (this.state.pwd === null || this.state.pwd === '') {
      ToastAndroid.show('密码不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (this.state.newPwd === null || this.state.newPwd === '') {
      ToastAndroid.show('新密码不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (this.state.confirmPwd === null || this.state.confirmPwd === '') {
      ToastAndroid.show('确认密码不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (this.state.confirmPwd !== this.state.newPwd) {
      ToastAndroid.show('新密码和确认密码不一致！', ToastAndroid.SHORT);
      return;
    }
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('app/resetPwd')({
        pwd: this.state.pwd,
        newPwd: this.state.newPwd,
        dispatch: this.props.dispatch
      }))
    })
  }

  onPressToShowPwd = () => {
    this.setState({'showPwd': !this.state.showPwd});
  }

  renderShowPwdView = () => {
    if (this.state.showPwd) {
      return <Image
        style={styles.ic_icon}
        source={require('../images/selected.png')}
      />
    }
    return <Image
      style={styles.ic_icon}
      source={require('../images/unselected.png')}
    />
  }

  renderPwdInput = () => {

    return <View>
      <View style={styles.viewFiveInner}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'原密码'}</Text>
          <TextInput
            ref={'pwd'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            secureTextEntry={!this.state.showPwd}
            onChangeText={(text) => this.setState({'pwd': text})}
          />
        </View>
      </View>
      <View style={styles.viewFiveInner}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'新密码'}</Text>
          <TextInput
            ref={'newPwd'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            secureTextEntry={!this.state.showPwd}
            onChangeText={(text) => this.setState({'newPwd': text})}
          />
        </View>
      </View>
      <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'确认密码'}</Text>
          <TextInput
            ref={'confirmPwd'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            secureTextEntry={!this.state.showPwd}
            onChangeText={(text) => this.setState({'confirmPwd': text})}
          />
        </View>
      </View>
    </View>
  }

  render() {
    const {operCode} = this.props;
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
          <Text style={styles.topTextStyle}>{'密码重置'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        {this.renderPwdInput()}
        <View style={[styles.viewFourOpenInnerBottom, {
          justifyContent: 'flex-start',
          borderWidth: 0,
          paddingLeft: 30,
          paddingTop: 30,
          paddingBottom: 30
        }]}>
          <View style={styles.viewShowPwdViewStyle}>
            <TouchableOpacity onPress={this.onPressToShowPwd}>
              {this.renderShowPwdView()}
            </TouchableOpacity>
            <Text style={styles.textShowPwdStyle}>显示密码</Text>
          </View>
        </View>
        <View style={[styles.viewFourOpenInnerBottom, {flex: 4, borderTopWidth: 0}]}>
          <TouchableOpacity onPress={this.checkAndCommit}>
            <View
              style={[styles.queryViewButtonStyle]}>
              <Text style={{fontSize: 18, color: 'white'}}>{'确认'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ModalOperationSuccess successTitleText='修改密码' successText='修改密码成功' goBack={this.goBack}/>
        <ModalOperationFail failTitleText='修改密码'/>
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
    borderBottomWidth: borderWidth
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
    width,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor,
    paddingLeft: 30
  },
  textInViewSecond: {
    fontSize: 15,
    alignSelf: 'center'
  },
  viewThree: {
    height: 10,
    borderColor,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWidth,
    borderBottomWidth: borderWidth
  },
  viewFourOpenInnerBottom: {
    flex: 1,
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderColor,
    borderTopWidth: borderWidth,
    backgroundColor: '#F5F5F5',
    paddingBottom: 70
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  queryViewButtonStyle: {
    width: 230,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFive: {
    flex: 1,
    width,
    borderWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor,
    backgroundColor: 'white'
  },
  viewFiveInner: {
    height: 40,
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor,
    alignSelf: 'center',
    borderBottomWidth: 0.4
  },
  viewFiveInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor,
    alignSelf: 'center'
  },
  textInViewFiveInnerLeft: {
    width: 90,
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
  textInputStyle: {
    height: 35,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  },
  viewShowPwdViewStyle: {
    width: width - 30,
    height: 45,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 40
  },
  textShowPwdStyle: {
    fontSize: 18,
    marginTop: 12,
    marginLeft: 10
  },
  ic_icon: {
    width: 20,
    height: 20,
    marginTop: 13,
    marginBottom: 10,
  },
})


export default PasswordModify
