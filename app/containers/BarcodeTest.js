import React, {
  Component,
} from 'react'
import {
  View,
  Alert, StyleSheet
} from 'react-native'

import Barcode from 'react-native-smart-barcode'
import TimerEnhance from 'react-native-smart-timer-enhance'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from "../utils";

@connect(({newInstall}) => {
  return {
    ...newInstall
  }
})
class BarcodeTest extends Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      viewAppear: false,
    };
  }


  componentDidMount() {
    // const {params} = this.props.navigation.state;
    // console.log(JSON.stringify(params));
  }

  componentWillUnmount() {
    this._listeners && this._listeners.forEach(listener => listener.remove());
  }

  _onBarCodeRead = (e) => {
    console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
    this._stopScan()
    // Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
    //   {text: 'OK', onPress: () => this._startScan()},
    // ])
    const {smartCardNumber, stbNumber} = this.props;
    const {params} = this.props.navigation.state;
    this.props.dispatch(createAction('newInstall/confirmNumber')({
      smartCardNumber: params.type === 1 ? e.nativeEvent.data.code : smartCardNumber,
      stbNumber: params.type === 2 ? e.nativeEvent.data.code : stbNumber
    }));
    this.props.dispatch(NavigationActions.back());
  }

  _startScan = (e) => {
    this._barCode.startScan()
  }

  _stopScan = (e) => {
    this._barCode.stopScan()
  }

  render() {

    return (
      <View style={{flex: 1, backgroundColor: 'black',}}>
        <Barcode style={{flex: 1,}}
                 ref={component => this._barCode = component}
                 onBarCodeRead={this._onBarCodeRead}/>
      </View>
    )
  }

}

export default TimerEnhance(BarcodeTest)
