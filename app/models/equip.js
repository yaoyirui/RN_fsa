/**
 * Created by yaoyirui on 2017/11/1.
 */

import {
  ToastAndroid
} from 'react-native'
import {createAction, NavigationActions} from '../utils'
import * as equipService from '../services/equip'
import {checkProductsAndReturnRequestBody} from "../utils/checkProductsAndReturnRequestBody"

const rows = 12;

//针对包内产品订购周期的设置
const returnProductsAfterSetDuration = (products, payload) => {
  const {packageProductId, componentId, productId, validDuration} = payload;
  if (products && products.length > 0) {
    return products.map((product) => {
      if (packageProductId === product.productId) {
        return {
          ...product, componets: product.componets.map((component) => {
            if (component.componentId === componentId) {
              return {
                ...component, componentDetails: component.componentDetails.map((componentDetail) => {
                  if (componentDetail.productId === productId) {
                    if (componentDetail.choosenOrderCycle === validDuration) {
                      return {...componentDetail, choosenOrderCycle: ''}
                    } else {
                      return {...componentDetail, choosenOrderCycle: validDuration}
                    }
                  } else {
                    return {...componentDetail}
                  }
                })
              }
            } else {
              return {...component}
            }
          })
        }
      } else {
        return {...product}
      }
    });
  }
  return [];
}
//针对包内产品价格计划的设置
const returnProductsAfterSetPricePlan = (products, payload) => {
  const {packageProductId, componentId, productId, pricePlanId} = payload;
  if (products && products.length > 0) {
    return products.map((product) => {
      if (packageProductId === product.productId) {
        return {
          ...product, componets: product.componets.map((component) => {
            if (component.componentId === componentId) {
              return {
                ...component, componentDetails: component.componentDetails.map((componentDetail) => {
                  if (componentDetail.productId === productId) {
                    return {
                      ...componentDetail, priceplans: componentDetail.priceplans.map((pricePlan) => {
                        if (pricePlan.pricePlanId === pricePlanId) {
                          return {...pricePlan, choosen: !pricePlan.choosen}
                        } else {
                          return {...pricePlan, choosen: false}
                        }
                      })
                    }
                  } else {
                    return {...componentDetail}
                  }
                })
              }
            } else {
              return {...component}
            }
          })
        }
      } else {
        return {...product}
      }
    });
  }
  return [];
}

//针对包内产品的设置
const returnProductsAfterSetProduct = (products, payload) => {
  const {packageProductId, componentId, productId} = payload;
  if (products && products.length > 0) {
    return products.map((product) => {
      if (packageProductId === product.productId) {
        return {
          ...product, componets: product.componets.map((component) => {
            if (component.componentId === componentId) {
              return {
                ...component, componentDetails: component.componentDetails.map((componentDetail) => {
                  if (componentDetail.productId === productId) {
                    return {
                      ...componentDetail, choosen: !componentDetail.choosen
                    }
                  } else {
                    return {...componentDetail, choosen: false}
                  }
                })
              }
            } else {
              return {...component}
            }
          })
        }
      } else {
        return {...product}
      }
    });
  }
  return [];
}

const returnSetChoosenComponents = (products) => {
  for (let i = 0; i < products.length; i++) {
    const {componets} = products[i];
    if (componets && componets.length > 0) {
      for (let k = 0; k < componets.length; k++) {
        let chooseProInComponentCount = 0;
        const {componentDetails} = componets[k];
        for (let j = 0; j < componentDetails.length; j++) {
          const {choosen} = componentDetails[j];
          if (choosen) {
            chooseProInComponentCount++;
          }
        }
        if (chooseProInComponentCount > 0) {
          componets[k].choosen = true;
        } else {
          componets[k].choosen = false;
        }
      }
    }
  }
  return products;
}

export default {
  namespace: 'equip',
  state: {
    count: 0,
    products: [],
    showProductsBottomButton: false,
    showSubscribersModal: false,
    chooseProducts: [],
    showProductsModal: false,
    showProductsList: false,
    calculate: {},
    showModifyProductsModal: false,
    showChoosenProduct: false,
    showProductList: false,
    choosenPayMethodId: -1,
    remark: '',
    devCode: '',
    modifyProductId: -1,
    showOrderProductConfirmModal: false,
    showOrderProductSuccessModal: false,
    modifyChoosenProduct: {},
    actualAmount: 0
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state, ...payload,
        count: 0,
        products: [],
        chooseProducts: [],
        showProductsModal: false,
        showModifyProductsModal: false,
        showProductsList: false,
        calculate: {},
        showOrderProductConfirmModal: false,
        showOrderProductSuccessModal: false,
        modifyChoosenProduct: {}
      }
    },
    changeActualAmount(state, {payload}) {
      return {...state, ...payload}
    },
    choosePayMethod(state, {payload}) {
      return {...state, ...payload}
    },
    queryStart(state, {payload}) {
      return {...state, ...payload}
    },
    queryEnd(state, {payload}) {
      return {...state, ...payload}
    },
    openOrderProductConfirmModal(state, {payload}) {
      return {...state, ...payload, showOrderProductConfirmModal: true}
    },
    closeOrderProductConfirmModal(state, {payload}) {
      return {...state, ...payload, showOrderProductConfirmModal: false}
    },
    openOrderProductSuccessModal(state, {payload}) {
      return {...state, ...payload, showOrderProductSuccessModal: true}
    },
    closeOrderProductSuccessModal(state, {payload}) {
      return {...state, ...payload, showOrderProductSuccessModal: false}
    },
    openChooseSubscriberModal(state, {payload}) {
      return {...state, ...payload, showSubscribersModal: true}
    },
    closeChooseSubscriberModal(state, {payload}) {
      return {...state, ...payload, showSubscribersModal: false}
    },
    chooseSubscriber(state, {payload}) {
      return {...state, ...payload, showSubscribersModal: false}
    },
    openChooseProductModal(state, {payload}) {
      return {...state, ...payload, showProductsModal: true}
    },
    closeChooseProductModal(state, {payload}) {
      return {...state, ...payload, showProductsModal: false}
    },
    openModifyChooseProductModal(state, {payload}) {
      return {...state, ...payload, showModifyProductsModal: true}
    },
    closeModifyChooseProductModal(state, {payload}) {
      return {...state, ...payload, showModifyProductsModal: false}
    },
    showChoosenProduct(state, {payload}) {
      return {...state, ...payload, showChoosenProduct: true}
    },
    hideChoosenProduct(state, {payload}) {
      return {...state, ...payload, showChoosenProduct: false}
    },
    showProductList(state, {payload}) {
      return {...state, ...payload, showProductList: true}
    },
    hideProductList(state, {payload}) {
      return {...state, ...payload, showProductList: false}
    },
    cleanProductList(state, {payload}) {
      return {...state, ...payload, products: []}
    },
    getModifyProductId(state, {payload}) {
      const productId = payload.productId
      return {...state, ...payload, modifyProductId: productId}
    },
    openProductDetail(state, {payload}) {
      const productDetail = payload.productDetail
      if (state.products && state.products.length > 0) {
        const newProducts = state.products.map((product) => {
          if (product.productId === productDetail.productId) {
            product.openDetail = !productDetail.openDetail
            return product
          } else {
            return {...product, openDetail: false}
          }
        });
        return {
          ...state, products: newProducts, ...payload
        }
      } else {
        return {...state, ...payload}
      }
    },
    choosePricePlan(state, {payload}) {
      const productId = payload.productId
      const pricePlanId = payload.pricePlanId
      let chooseProducts = []
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        chooseProducts = state.chooseProducts.map((product) => {
          if (productId === product.productId) {
            return {
              ...product, pricePlans: product.pricePlans.map((pricePlan, index) => {
                if (pricePlanId === pricePlan.pricePlanId) {
                  return {...pricePlan, choosen: !pricePlan.choosen}
                } else {
                  return {...pricePlan, choosen: false}
                }
              })
            }
          } else {
            return {...product}
          }
        })
      }
      let newProducts = []
      if (state.products && state.products.length > 0) {
        newProducts = state.products.map((product) => {
          if (productId === product.productId) {
            product.pricePlans = product.pricePlans.map((pricePlan, index) => {
              if (pricePlanId === pricePlan.pricePlanId) {
                return {...pricePlan, choosen: !pricePlan.choosen}
              } else {
                return {...pricePlan, choosen: false}
              }
            })
            return product
          } else {
            return {...product}
          }
        })

      }
      return {...state, ...payload, products: newProducts, chooseProducts: chooseProducts}
    },
    addProduct(state, {payload}) {
      const {chooseProductTmp} = payload;
      chooseProductTmp.choosen = true;
      const chooseProductsTmp = [];
      let newProducts = []
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        let containsProduct = false;
        for (let i = 0; i < state.chooseProducts.length; i++) {
          const chooseProduct = state.chooseProducts[i]
          if (chooseProduct.productId === chooseProductTmp.productId) {
            containsProduct = true;
            chooseProductsTmp.push(chooseProductTmp);
          } else {
            chooseProductsTmp.push(chooseProduct);
          }
        }
        if (!containsProduct) {
          chooseProductsTmp.push(chooseProductTmp);
        }
      } else {
        chooseProductsTmp.push(chooseProductTmp);
      }
      if (state.products && state.products.length > 0) {
        newProducts = state.products.map((product) => {
          const {pricePlans, choosenOrderCycle} = chooseProductTmp
          if (product.productId === chooseProductTmp.productId) {
            return {...product, choosen: true, pricePlans, choosenOrderCycle}
          } else {
            return {...product}
          }
        })
      }
      return {
        ...state, ...payload, products: newProducts, chooseProducts: chooseProductsTmp
      }
    },
    removeProduct(state, {payload}) {
      const chooseProductTmp = payload.chooseProductTmp
      let newChooseProducts = []
      let newProducts = []
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        for (let i = 0; i < state.chooseProducts.length; i++) {
          const chooseProduct = state.chooseProducts[i]
          if (chooseProduct.productId !== chooseProductTmp.productId) {
            newChooseProducts.push(chooseProduct);
          }
        }
      }
      if (state.products && state.products.length > 0) {
        newProducts = state.products.map((product) => {
          if (product.productId === chooseProductTmp.productId) {
            return {
              ...product,
              choosen: false,
              pricePlans: product.pricePlans.map((pricePlan, index, array) => {
                return {...pricePlan, choosen: array.length === 1}
              })
            }
          } else {
            return {...product}
          }
        })
      }

      return {
        ...state, ...payload,
        chooseProducts: newChooseProducts,
        products: newProducts,
        showChoosenProduct: newChooseProducts.length > 0
      }
    },
    calculateEnd(state, {payload}) {
      return {...state, ...payload}
    },
    orderProEnd(state, {payload}) {
      return {...state, ...payload}
    },
    changeOrderNum(state, {payload}) {
      const {products, chooseProducts} = state;
      return {
        ...state, ...payload, products: products.map((product, index) => {
          if (product.productId === payload.productId) {
            return {...product, orderNum: product.orderNum + payload.orderNum}
          } else {
            return {...product}
          }
        }), chooseProducts: chooseProducts.map((product, index) => {
          if (product.productId === payload.productId) {
            return {...product, orderNum: product.orderNum + payload.orderNum}
          } else {
            return {...product}
          }
        })
      }
    }
  },
  effects: {
    * removeProductAsy({payload}, {call, put, select}) {
      yield put(createAction('removeProduct')({...payload}));
      const sessionId = yield select(({app}) => app.sessionId);
      const {chooseProducts} = yield select(({product}) => product);
      const {customerId} = yield select(({app}) => app.customerBasicInfo);
      const requestBody = checkProductsAndReturnRequestBody(chooseProducts);
      if (chooseProducts && chooseProducts.length > 0) {
        const returnData = yield call(equipService.calculatePeripheralEquipsFee, {
          sessionId, customerId,
          requestBody: JSON.stringify(requestBody)
        })
        yield put(createAction('calculateEnd')({
          calculate: returnData.jsonData || {},
          actualAmount: returnData.jsonData ? returnData.jsonData.totalFee : 0
        }))
      }
    },
    * queryCanBeOrderPeripheralEquips({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const {customerId} = yield select(({app}) => app.customerBasicInfo);
      const returnData = yield call(equipService.queryCanBeOrderPeripheralEquips, {
        ...payload,
        customerId,
        start: 0,
        rows,
        sessionId
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有查到产品', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryEnd')({
        products: returnData.jsonData.map((product, index) => {
          return {
            ...product,
            pricePlans: product.pricePlans.map((pricePlan, index) => {
              if (product.pricePlans.length === 1) {
                return {...pricePlan, choosen: true}
              } else {
                return {...pricePlan, choosen: false}
              }
            }),
            openDetail: false,
            choosen: false,
            orderNum: 1
          }
        }) || [],
        count: returnData.count
      }))
    },
    * queryCanBeOrderPeripheralEquipsForPage({payload}, {call, put, select}) {
      const products = yield select(({product}) => product.products);
      const sessionId = yield select(({app}) => app.sessionId);
      const {customerId} = yield select(({app}) => app.customerBasicInfo);
      const returnData = yield call(equipService.queryCanBeOrderPeripheralEquips, {
        ...payload,
        customerId,
        sessionId,
        rows
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryEnd')({
        products: products.concat(returnData.jsonData.map((product, index) => {
          return {
            ...product,
            pricePlans: product.pricePlans.map((pricePlan, index) => {
              if (product.pricePlans.length === 1) {
                return {...pricePlan, choosen: true}
              } else {
                return {...pricePlan, choosen: false}
              }
            }),
            openDetail: false,
            choosen: false
          }
        }) || []),
        count: returnData.count
      }))
    },
    * calculatePeripheralEquipsFee({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const {customerId} = yield select(({app}) => app.customerBasicInfo);
      const returnData = yield call(equipService.calculatePeripheralEquipsFee, {...payload, sessionId, customerId})
      yield put(createAction('calculateEnd')({
        calculate: returnData.jsonData || {},
        actualAmount: returnData.jsonData ? returnData.jsonData.totalFee : 0
      }))
    },
    * orderPeripheralEquip({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const {customerId} = yield select(({app}) => app.customerBasicInfo);
      const returnData = yield call(equipService.orderPeripheralEquip, {...payload, sessionId, customerId})
      if (returnData.success) {
        yield put(createAction('orderProEnd')({
          showOrderProductConfirmModal: false,
          showOrderProductSuccessModal: true
        }))
      } else {
        yield put(createAction('orderProEnd')())
      }
    },
  },
}


