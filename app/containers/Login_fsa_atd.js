/**
 * Created by lion on 2017/8/24.
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
  Image
} from 'react-native'
import { List, InputItem, WhiteSpace } from 'antd-mobile';
import {connect} from 'react-redux'
import {createAction} from '../utils'

var CryptoJS = require("crypto-js");

var width = Dimensions.get('window').width

@connect(({app}) => {
  return {...app}
})
class LoginFSATD extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: props.operCode,
      pwd: '',
      openEye: false,
      rememberOperCode: props.rememberOperCode,
      operCode: props.operCode
    };
  }

  onLogin = () => {
    if (this.state.code == null || this.state.code == '' || this.state.pwd == null || this.state.pwd == '') {
      ToastAndroid.show('用户名或密码不能为空！', ToastAndroid.SHORT);
      return;
    }
    this.props.dispatch(createAction('app/login')({
      code: this.state.code,
      // pwd: CryptoJS.MD5(CryptoJS.MD5(CryptoJS.MD5(this.state.pwd)+'')+''),
      pwd: this.state.pwd
    }))
  }

  onPressClean = () => {
    this.textInputCode.clear();
  }
  onPressOpenEye = () => {
    if (this.state.openEye) {
      this.setState({openEye: false});
    } else {
      this.setState({openEye: true});
    }
  }


  openEye = () => {
    if (this.state.openEye) {
      return <Image
        style={styles.ic_icon}
        source={require('../images/eye_open.png')}
      />
    } else {
      return <Image
        style={styles.ic_icon}
        source={require('../images/eye_close.png')}
      />
    }
  }

  onPressRememberOperCode = () => {
    this.state.rememberOperCode = !this.state.rememberOperCode;
    this.props.dispatch(createAction('app/rememberOperCode')({
      rememberOperCode: this.state.rememberOperCode,
      operCode: this.state.rememberOperCode ? this.state.code : ''
    }))
  }

  rememberOperCode = () => {
    if (this.state.rememberOperCode) {
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

  onCodeEndEdit = () => {
    this.setState({'code': this.state.code}, function () {
      this.props.dispatch(createAction('app/rememberOperCode')({
        rememberOperCode: this.state.rememberOperCode,
        operCode: this.state.rememberOperCode ? this.state.code : ''
      }))
    })
  }

  render() {

    return (
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={require('../images/logo_login.png')}
        />
        <View style={[styles.textInputViewStyle, styles.textInputViewStyleCode]}>
          <View style={styles.view_icon_style}>
            <Image
              style={styles.ic_icon}
              source={require('../images/login_ic.png')}
            />
          </View>
          <List>
            <InputItem
              clear={true}
              editable={true}
              disabled={false}
              style={[styles.textInputStyle,{width: width - 100}]}
              defaultValue={this.state.operCode}
              placeholder="编号"
              ref={el => this.textInputCode = el}
            />
          </List>

        </View>
        <View style={[styles.textInputViewStyle, styles.textInputViewStylePwd]}>
          <View style={styles.view_icon_style}>
            <Image
              style={styles.ic_icon}
              source={require('../images/login_lock.png')}
            />
          </View>
          <TextInput
            ref={'textInputPwd'}
            style={styles.textInputStyle}
            placeholder='密码'
            multiline={true}
            secureTextEntry={!this.state.openEye}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'pwd': text})}
          />
          <View style={styles.view_icon_style}>
            <TouchableOpacity onPress={this.onPressOpenEye}>
              {this.openEye()}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.textRemOperInputViewStyle}>
          <TouchableOpacity onPress={this.onPressRememberOperCode}>
            {this.rememberOperCode()}
          </TouchableOpacity>
          <Text style={styles.textRemOperStyle}>记住员工号</Text>
        </View>

        <TouchableOpacity onPress={this.onLogin}>
          <View style={styles.textLoginViewStyle}>
            <Text style={styles.textLoginStyle}>登录</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //设置占满屏幕
    flex: 1,
    backgroundColor: 'white',
    // marginTop: 140,
    paddingTop: 50
  },
  //包裹输入框View样式
  textInputViewStyle: {
    //设置宽度减去30将其居中左右便有15的距离
    width: width - 30,
    height: 45,

    //设置边框的颜色
    borderColor: 'grey',

    //内边距
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //外边距
    marginLeft: 20,
    marginRight: 20,
    //设置相对父控件居中
    alignSelf: 'center',

  },

  textRemOperInputViewStyle: {
    width: width - 30,
    height: 45,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 40
  },

  textInputViewStyleCode: {

    //设置圆角程度
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 1,
  },

  textInputViewStylePwd: {

    //设置圆角程度
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 1,
    marginBottom: 20
  },

  //输入框样式
  textInputStyle: {
    width: width - 85,
    height: 35,
    //根据不同平台进行适配
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  },

  //登录按钮View样式
  textLoginViewStyle: {
    width: width - 30,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //登录Text文本样式
  textLoginStyle: {
    fontSize: 18,
    color: 'white'
  },

  textRemOperStyle: {
    fontSize: 18,
    marginTop: 12,
    marginLeft: 10
  },

  icon: {
    width: 80,
    height: 90,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50,
  },

  ic_icon: {
    width: 20,
    height: 20,
    marginTop: 13,
    marginBottom: 10,
  },

  view_icon_style: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  }

});

export default LoginFSATD;
