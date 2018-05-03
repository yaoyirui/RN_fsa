/**
 * Created by yaoyirui on 2018/2/5.
 */
import {
  ToastAndroid
} from 'react-native'
import {createAction, NavigationActions} from '../utils'
import * as newInstallService from '../services/newInstall'
import * as productService from '../services/product'
import {
  checkProductsAndReturnRequestBody,
  checkProductsAndReturnRequestBodyForNewInstall
} from "../utils/checkProductsAndReturnRequestBody"

const row = 12;

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

const returnResourcesCheckedAllOrNot = (resources) => {
  let checkedAll = true;
  for (let i = 0; i < resources.length; i++) {
    if (!resources[i].checked) {
      checkedAll = false
    }
  }
  return checkedAll;
}

export default {
  namespace: 'newInstall',
  state: {
    count: 0,
    products: [],
    subscribers: [],
    showProductsBottomButton: false,
    showSubscribersModal: false,
    chooseSubscriber: {
      subscriberId: -1,
      businessTypeId: -1,
      serviceStr: '',
      statusId: -1,
      terminalNum: -1
    },
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
    actualAmount: 0,
    newInstallBasicInfo: {newInstallDto: {subscriberTypes: [], subsdiaryTypes: []}},
    chooseSubscriberType: {id: -1},
    chooseSubsdiaryType: {id: -1},
    resources: [],
    choosePhysicProducts: [],
    currentResourceTypeId: 1,
    choosePhysicProduct: {},
    showChoosenPhysicProducts: false,
    showChoosePhysicProductModal: false,
    smartCardNumber: '',
    stbNumber: ''
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
        modifyChoosenProduct: {},
        chooseSubscriber: {
          subscriberId: -1,
          businessTypeId: -1,
          serviceStr: '',
          statusId: -1,
          terminalNum: -1
        },
        newInstallBasicInfo: {newInstallDto: {subscriberTypes: [], subsdiaryTypes: []}},
        chooseSubscriberType: {id: -1},
        chooseSubsdiaryType: {id: -1},
        resources: [],
        physicProducts: [],
        currentResourceTypeId: 1,
        choosePhysicProduct: {},
        showChoosenPhysicProducts: false,
        showChoosePhysicProductModal: false
      }
    },
    changeActualAmount(state, {payload}) {
      return {...state, ...payload}
    },
    choosePayMethod(state, {payload}) {
      return {...state, ...payload}
    },
    chooseSubscriberType(state, {payload}) {
      return {...state, ...payload}
    },
    queryStart(state, {payload}) {
      return {...state, ...payload}
    },
    queryEnd(state, {payload}) {
      return {...state, ...payload}
    },
    confirmNumber(state, {payload}) {
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
    choosePricePlanInComponent(state, {payload}) {
      let chooseProducts = [];
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        chooseProducts = returnProductsAfterSetPricePlan(state.chooseProducts, payload);
      }
      let newProducts = [];
      if (state.products && state.products.length > 0) {
        newProducts = returnProductsAfterSetPricePlan(state.products, payload);
      }
      return {...state, ...payload, products: newProducts, chooseProducts: chooseProducts}
    },
    chooseOrderCycle(state, {payload}) {
      const productId = payload.productId
      const validDuration = payload.validDuration
      let newProducts = []
      let chooseProducts = []
      if (state.products && state.products.length > 0) {
        newProducts = state.products.map((product) => {
          if (productId === product.productId) {
            if (product.choosenOrderCycle === validDuration) {
              return {...product, choosenOrderCycle: ''}
            } else {
              return {...product, choosenOrderCycle: validDuration}
            }
          } else {
            return {...product}
          }
        });
      }
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        chooseProducts = state.chooseProducts.map((product) => {
          if (productId === product.productId) {
            if (product.choosenOrderCycle === validDuration) {
              return {...product, choosenOrderCycle: ''}
            } else {
              return {...product, choosenOrderCycle: validDuration}
            }
          } else {
            return {...product}
          }
        })

      }
      return {...state, ...payload, products: newProducts, chooseProducts: chooseProducts}
    },
    chooseOrderCycleInComponent(state, {payload}) {

      let newProducts = []
      let chooseProducts = []
      if (state.products && state.products.length > 0) {
        newProducts = returnProductsAfterSetDuration(state.products, payload);
      }
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        chooseProducts = returnProductsAfterSetDuration(state.chooseProducts, payload);

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
            // chooseProductsTmp.push(chooseProductTmp);
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
    addOrRemoveProductInComponent(state, {payload}) {
      let chooseProductsTmp = [];
      let newProducts = []
      if (state.chooseProducts && state.chooseProducts.length > 0) {
        chooseProductsTmp = returnProductsAfterSetProduct(state.chooseProducts, payload);
        chooseProductsTmp = returnSetChoosenComponents(chooseProductsTmp);
      }
      if (state.products && state.products.length > 0) {
        newProducts = returnProductsAfterSetProduct(state.products, payload);
        newProducts = returnSetChoosenComponents(newProducts);
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
              choosenOrderCycle: '',
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
    openChooseSubscriberTypeModal(state, {payload}) {
      return {...state, ...payload, showChooseSubscriberTypeModal: true}
    },
    closeChooseSubscriberTypeModal(state, {payload}) {
      return {...state, ...payload, showChooseSubscriberTypeModal: false}
    },
    openChoosePhysicProductModal(state, {payload}) {
      return {...state, ...payload, showChoosePhysicProductModal: true}
    },
    closeChoosePhysicProductModal(state, {payload}) {
      return {...state, ...payload, showChoosePhysicProductModal: false}
    },
    setResources(state, {payload}) {
      return {...state, ...payload}
    },
    setCurrentResourceTypeId(state, {payload}) {
      return {...state, ...payload, currentResourceTypeId: payload.currentResourceTypeId}
    },
    choosePhysicProducts(state, {payload}) {
      const {resources, choosePhysicProducts, physicProducts} = state;
      const choosePhysicProductsNew = [];
      choosePhysicProductsNew.push(payload.product);
      for (let i = 0; i < choosePhysicProducts.length; i++) {
        if (choosePhysicProducts[i].productId !== payload.product.productId) {
          choosePhysicProductsNew.push(choosePhysicProducts[i]);
        }
      }
      return {
        ...state, ...payload,
        resources,
        choosePhysicProduct: payload.product,
        choosePhysicProducts: choosePhysicProductsNew,
        physicProducts: physicProducts.map((physicProduct) => {
          if (physicProduct.productId === payload.product.productId) {
            return {...physicProduct, choosen: true}
          } else {
            return {...physicProduct, choosen: false}
          }
        })
      }
    },
    choosePhysicProductPricePlan(state, {payload}) {
      const {choosePhysicProducts} = state
      for (let i = 0; i < choosePhysicProducts.length; i++) {
        const product = choosePhysicProducts[i];
        if (payload.product.productId === product.productId) {
          const {pricePlans} = product;
          for (let j = 0; j < pricePlans.length; j++) {
            const pricePlan = pricePlans[j];
            if (payload.pricePlan.pricePlanId === pricePlan.pricePlanId) {
              pricePlan.choosen = true;
            } else {
              pricePlan.choosen = false;
            }
          }
        }
      }
      return {
        ...state, ...payload, choosePhysicProducts
      }
    },
    showChoosenPhysicProducts(state, {payload}) {
      return {...state, ...payload, showChoosenPhysicProducts: true}
    },
  },
  effects: {
    * queryNewInstallBasicInfo({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const returnData = yield call(newInstallService.queryNewInstallBasicInfo, {
        ...payload,
        sessionId: sessionId,
        businessId: payload.businessId,
        customerId
      })
      if (returnData.success) {
        if (returnData.jsonData) {
          const {subscriberTypes} = returnData.jsonData.newInstallDto;
          yield put(createAction('queryEnd')({
            newInstallBasicInfo: returnData.jsonData,
            chooseSubscriberType: (subscriberTypes && subscriberTypes.length > 0) ? subscriberTypes[0] : {
              id: -1,
              name: '无'
            }
          }))
        } else {
          ToastAndroid.show('查询新装基本信息为空', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryEnd')({}))
    },

    * queryPhysicalProduct({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const {chooseProducts, newInstallBasicInfo, resources, chooseSubscriberType, chooseSubsdiaryType} = yield select(({newInstall}) => newInstall);
      const requestBody = {
        actionId: newInstallBasicInfo.actionId,
        customerId,
        resources,
        newInstallDto: {
          subscriberTypeId: chooseSubscriberType.id,
          subsdiaryTypeId: chooseSubsdiaryType.id,
          username: newInstallBasicInfo.newInstallDto.username,
          passWord: newInstallBasicInfo.newInstallDto.passWord,
          authenTypeId: newInstallBasicInfo.newInstallDto.authenTypeId
        }
      };
      const returnData = yield call(newInstallService.queryPhysicalProduct, {
        ...payload,
        sessionId,
        requestBody: JSON.stringify(requestBody)
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有查到产品', ToastAndroid.LONG);
        }
      }
      const physicProducts = returnData.jsonData;

      yield put(createAction('queryEnd')({
        physicProducts: physicProducts.map((product, index) => {
          let choosen = false;
          if (chooseProducts && chooseProducts.length > 0) {
            for (let i = 0; i < chooseProducts.length; i++) {
              const chooseProduct = chooseProducts[i];
              if (chooseProduct.components && chooseProduct.components.length > 0) {
                if (chooseProduct.productId === product.packageProId) {
                  choosen = true;
                  for (let j = 0; j < resources.length; j++) {
                    if (resources[j].resourceTypeId === product.resourceTypeId) {
                      resources[j].checked = true;
                    }
                  }
                }
              }
            }
          }
          return {
            ...product,
            pricePlans: product.pricePlans.map((pricePlan, index) => {
              if (product.pricePlans.length === 1) {
                return {...pricePlan, choosen: true}
              } else {
                return {...pricePlan, choosen: false}
              }
            }),
            choosen
          }
        }) || [],
        count: returnData.count,
        showChoosenProducts: !returnResourcesCheckedAllOrNot(resources),
        showChoosePhysicProductModal: !returnResourcesCheckedAllOrNot(resources),
        resources
      }));
      if (returnResourcesCheckedAllOrNot(resources)) {
        const newInstall = yield select(({newInstall}) => newInstall);
        const requestBodyObj = checkProductsAndReturnRequestBodyForNewInstall(newInstall);
        requestBodyObj.customerId = customerId;
        const calculateReturnData = yield call(newInstallService.calculateNewInstallProductsFee, {
          ...payload,
          sessionId,
          requestBody: JSON.stringify(requestBodyObj)
        })
        yield put(createAction('calculateEnd')({
          calculate: calculateReturnData.jsonData || {},
          actualAmount: calculateReturnData.jsonData ? calculateReturnData.jsonData.totalFee : 0,
          showChoosenProduct: true
        }))
      }
    },
    * removeProductAsy({payload}, {call, put, select}) {
      yield put(createAction('removeProduct')({...payload}));
      const sessionId = yield select(({app}) => app.sessionId);
      const newInstall = yield select(({newInstall}) => newInstall);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const {chooseProducts} = newInstall;
      if (chooseProducts && chooseProducts.length > 0) {
        const requestBody = checkProductsAndReturnRequestBodyForNewInstall(newInstall);
        requestBody.customerId = customerId;
        const returnData = yield call(newInstallService.calculateNewInstallProductsFee, {
          ...payload,
          sessionId,
          requestBody: JSON.stringify(requestBody)
        })
        yield put(createAction('calculateEnd')({
          calculate: returnData.jsonData || {},
          actualAmount: returnData.jsonData ? returnData.jsonData.totalFee : 0
        }))
      }
    },
    * queryCanBeOrderServiceProducts({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const {newInstallBasicInfo, chooseSubscriberType, chooseSubsdiaryType} = yield select(({newInstall}) => newInstall);
      const requestBody = {
        actionId: newInstallBasicInfo.actionId,
        customerId,
        newInstallDto: {
          subscriberTypeId: chooseSubscriberType.id,
          subsdiaryTypeId: chooseSubsdiaryType.id,
          username: newInstallBasicInfo.newInstallDto.username,
          passWord: newInstallBasicInfo.newInstallDto.passWord,
          authenTypeId: newInstallBasicInfo.newInstallDto.authenTypeId
        }
      };
      const returnData = yield call(newInstallService.queryCanBeOrderServiceProducts, {
        ...payload,
        start: 0,
        row,
        sessionId,
        requestBody: JSON.stringify(requestBody)
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有查到产品', ToastAndroid.LONG);
        } else {
          yield put(createAction('queryEnd')({
            products: returnData.jsonData.map((product, index) => {
              const ordermodeid = product.ordermodeid;
              const validdurationid = product.orderCycles;
              const validdurationidArray = ordermodeid === 2 ? validdurationid.split(',') : []
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
                choosenOrderCycle: validdurationidArray.length === 1 ? validdurationid : ''
              }
            }) || [],
            count: returnData.count
          }))
        }
      } else {
        yield put(createAction('queryEnd')({
          products: [],
          count: 0
        }))
      }
    },
    * queryCanBeOrderServiceProductsForPage({payload}, {call, put, select}) {
      const products = yield select(({product}) => product.products);
      const sessionId = yield select(({app}) => app.sessionId);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const {newInstallBasicInfo, chooseSubscriberType, chooseSubsdiaryType} = yield select(({newInstall}) => newInstall);
      const requestBody = {
        actionId: newInstallBasicInfo.actionId,
        customerId,
        newInstallDto: {
          subscriberTypeId: chooseSubscriberType.id,
          subsdiaryTypeId: chooseSubsdiaryType.id,
          username: newInstallBasicInfo.newInstallDto.username,
          passWord: newInstallBasicInfo.newInstallDto.passWord,
          authenTypeId: newInstallBasicInfo.newInstallDto.authenTypeId
        }
      };
      const returnData = yield call(newInstallService.queryCanBeOrderServiceProducts, {
        ...payload,
        sessionId,
        requestBody: JSON.stringify(requestBody)
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryEnd')({
        products: products.concat(returnData.jsonData.map((product, index) => {
          const ordermodeid = product.ordermodeid;
          const validdurationid = product.orderCycles;
          const validdurationidArray = ordermodeid === 2 ? validdurationid.split(',') : []
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
            choosenOrderCycle: validdurationidArray.length === 1 ? validdurationid : ''
          }
        }) || []),
        count: returnData.count
      }))
    },
    * calculateServiceProductsFee({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const newInstall = yield select(({newInstall}) => newInstall);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const requestBody = checkProductsAndReturnRequestBodyForNewInstall(newInstall);
      requestBody.customerId = customerId;
      const returnData = yield call(newInstallService.calculateNewInstallProductsFee, {
        ...payload,
        sessionId,
        requestBody: JSON.stringify(requestBody)
      })
      if (returnData.success) {
        yield put(createAction('calculateEnd')({
          calculate: returnData.jsonData || {},
          actualAmount: returnData.jsonData ? returnData.jsonData.totalFee : 0,
          showChoosenProduct: true
        }))
      }
    },
    * newInstallAccept({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const newInstall = yield select(({newInstall}) => newInstall);
      const customerId = yield select(({customer}) => customer.customerDetail.id);
      const requestBody = checkProductsAndReturnRequestBodyForNewInstall(newInstall);
      requestBody.customerId = customerId;
      const returnData = yield call(newInstallService.newInstallAccept, {
        ...payload,
        sessionId,
        businessId: 2,
        requestBody: JSON.stringify({...requestBody, ...payload.requestBody})
      })
      if (returnData.success) {
        yield put(createAction('app/showSuccess')())
        yield put(createAction('orderProEnd')({...returnData.jsonData}))
      } else {
        yield put(createAction('app/showFail')({failText: returnData.msg}))
        yield put(createAction('orderProEnd')())
      }
    }
  },
}



