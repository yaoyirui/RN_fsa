/**
 * Created by yaoyirui on 2017/10/25.
 */
import React, {Component} from 'react'
import {StyleSheet, View, Image, Dimensions, ToastAndroid} from 'react-native'
import {connect} from 'react-redux'

import {NavigationActions} from '../utils'

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

@connect()
class HomeIndex extends Component {

  componentDidMount() {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === null || currentScreen === '' || currentScreen === 'Login') {
      this.props.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      }))
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={require('../images/splash_hlj_bg.png')}
        />
      </View>
    )
  }
}
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    flex: 1,
    width: width,
    height: height
  },
})

export default HomeIndex
