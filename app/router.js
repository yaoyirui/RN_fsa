import React, {PureComponent} from 'react'
import {BackHandler, Animated, Easing, View} from 'react-native'

import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions,
  addNavigationHelpers
} from 'react-navigation'
import {
  initializeListeners,
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import {connect} from 'react-redux'

import Home from './containers/Home'
import LoginFSA from './containers/Login_fsa'
import HomePage from './containers/HomePage'
import BusinessChoosePage from './containers/BusinessChoosePage'
import CustomerSearch from './containers/CustomerSearch'
import MineCenter from './containers/MineCenter'
import OrderProduct from './containers/OrderProduct'
import CheckAccount from './containers/CheckAccount'
import PaymentAmount from './containers/PaymentAmount'
import CustomerCreate from './containers/CustomerCreate'
import PasswordModify from './containers/PasswordModify'
import CustomerDetailScreen from './containers/CustomerDetailScreen'
import ModalDetail from './containers/ModalDetail'
import RechargeSearch from './containers/RechargeSearch'
import AcceptSearch from './containers/AcceptSearch'
import RefreshAuthorization from './containers/RefreshAuthorization'
import NewInstall from './containers/NewInstall'
import ModalAntd from './containers/ModelAntd'
import EquipSale from './containers/EquipSale'
import Unbind from './containers/Unbind'
import PaymentAmountOnDemand from './containers/PaymentAmountOnDemand'
import BarcodeTest from './containers/BarcodeTest'


const HomeNavigator = TabNavigator(
  {
    HomePage: {screen: HomePage},
    BusinessChoosePage: {screen: BusinessChoosePage},
    MineCenter: {screen: MineCenter}
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: true,
    lazyLoad: false,
    tabBarOptions: {
      activeTintColor: '#f34236', // 文字和图片选中颜色
      inactiveTintColor: '#999', // 文字和图片未选中颜色
      inactiveBackgroundColor: 'white',
      activeBackgroundColor: 'white'
    },

  }
)

const AppNavigator = StackNavigator(
  {
    Main: {screen: LoginFSA},
    Login: {screen: LoginFSA},
    HomeNavigator: {screen: HomeNavigator},
    CustomerSearch: {screen: CustomerSearch},
    OrderProduct: {screen: OrderProduct},
    PasswordModify: {screen: PasswordModify},
    PaymentAmount: {screen: PaymentAmount},
    CustomerCreate: {screen: CustomerCreate},
    CheckAccount: {screen: CheckAccount},
    CustomerDetailScreen: {screen: CustomerDetailScreen},
    RechargeSearch: {screen: RechargeSearch},
    AcceptSearch: {screen: AcceptSearch},
    RefreshAuthorization: {screen: RefreshAuthorization},
    NewInstall: {screen: NewInstall},
    EquipSale: {screen: EquipSale},
    Unbind: {screen: Unbind},
    PaymentAmountOnDemand: {screen: PaymentAmountOnDemand},
    BarcodeTest: {screen: BarcodeTest}
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const {layout, position, scene} = sceneProps
        const {index} = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return {opacity, transform: [{translateY}]}
      },
    }),
  }
)

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

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)
const addListener = createReduxBoundAddListener('root')

@connect(({router, customer, loading, app}) => {
  return {
    router,
    openCustomerDetail: customer.openCustomerDetail,
    loading: (loading.global && !(loading.effects['customer/queryCustomersForPage'])
      && !(loading.effects['accept/queryAcceptsForPage'])
      && !(loading.effects['customer/queryAddressesForPage'])
      && !(loading.effects['app/logout'])
    ),
    loadingManual: app.modalLoading
  }
})
class Router extends PureComponent {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentDidMount() {
    initializeListeners('root', this.props.router)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {
    const {dispatch, router, openCustomerDetail, loading, loadingManual} = this.props
    const navigation = addNavigationHelpers({dispatch, state: router, addListener})
    return <View style={{flex: 1}}><AppNavigator navigation={navigation}/>
      <ModalDetail isOpenModal={openCustomerDetail} dispatch={dispatch}/>
      <ModalAntd isOpenModal={loading || loadingManual}/>
    </View>
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
