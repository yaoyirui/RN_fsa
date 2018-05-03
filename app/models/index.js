import appModel from './app'
import routerModel from './router'
import customerModel from './customer'
import paymentModel from './payment'
import acceptModel from './accept'

export function registerModels(app) {
  app.model(appModel)
  app.model(routerModel)
  app.model(customerModel)
  app.model(paymentModel)
  app.model(acceptModel)
}
