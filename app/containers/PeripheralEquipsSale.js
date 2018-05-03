/**
 * Created by yaoyirui on 2017/9/8.
 */
import React, {Component} from 'react'
import {StyleSheet, View, Button, Text} from 'react-native'
import {connect} from 'react-redux'

import {NavigationActions} from '../utils'
import WelcomeText from "react-native/local-cli/templates/HelloNavigation/views/welcome/WelcomeText.android";

@connect()
class PeripheralEquipsSale extends Component {


  render() {
    return (
      <View style={styles.container}>
        <WelcomeText/>
        <Text>周边销售</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default PeripheralEquipsSale
