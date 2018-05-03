import React from 'react'
import {AppRegistry, AsyncStorage} from 'react-native'
import {persistStore, autoRehydrate} from 'redux-persist'

import dva from './utils/dva'
import Router from './router'

import appModel from './models/app'
import routerModel from './models/router'
import customerModel from './models/customer'
import paymentModel from './models/payment'
import productModel from './models/product'
import acceptModel from './models/accept'
import pmsModel from './models/pms'
import newInstallModel from './models/newInstall'
import checkAccountModel from './models/checkAccount'
import equipModel from './models/equip'

const app = dva({
  initialState: {},
  models: [
    routerModel,
    appModel,
    customerModel,
    paymentModel,
    productModel,
    acceptModel,
    pmsModel,
    newInstallModel,
    checkAccountModel,
    equipModel
  ],
  extraEnhancers: [autoRehydrate()],
  onError(e) {
    console.log('onError', e)
  },
})

var App = app.start(<Router/>)
persistStore(app.getStore(), {storage: AsyncStorage})
AppRegistry.registerComponent('DvaStarter', () => App)

