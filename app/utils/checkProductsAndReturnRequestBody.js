/**
 * Created by yaoyirui on 2017/11/16.
 */
import {
  ToastAndroid
} from 'react-native'

export const checkProductsAndReturnRequestBody = (products) => {
  if (products && products.length > 0) {
    let choosenProductOrNot = false
    let choosenPricePlanOrNot = false
    let choosenOrderCycleOrNot = false
    let requestBody = [];
    for (let i = 0; i < products.length; i++) {
      const requestBodyInnerObj = {};
      const product = products[i];
      const ordermodeid = product.ordermodeid;
      const choosenOrderCycle = product.choosenOrderCycle;

      if (product.choosen) {
        choosenProductOrNot = true;
        requestBodyInnerObj.productId = product.productId;
        if (ordermodeid === 2 && choosenOrderCycle) {
          choosenOrderCycleOrNot = true;
        }
        if (choosenOrderCycle) {
          requestBodyInnerObj.orderCycles = choosenOrderCycle;
        }
        const pricePlans = product.pricePlans;
        for (let j = 0; j < pricePlans.length; j++) {
          const pricePlan = pricePlans[j];
          if (pricePlan.choosen) {
            choosenPricePlanOrNot = true;
            requestBodyInnerObj.pricePlanId = pricePlan.pricePlanId;
          }
        }
        if (!choosenPricePlanOrNot) {
          ToastAndroid.show('产品\"' + product.productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
          return false;
        }
        if (ordermodeid === 2 && !choosenOrderCycle) {
          ToastAndroid.show('产品\"' + product.productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
          return false;
        }

        const components = product.componets;
        if (components && components.length > 0) {
          let choosenComponentCount = 0;
          requestBodyInnerObj.componentsParams = [];
          for (let i = 0; i < components.length; i++) {
            const componentObj = {};
            const {componentId, componentDetails, minChoosenProCount, maxChoosenProCount, componentName, choosen} = components[i];
            let choosenProductInComponentCount = 0;
            if (choosen) {
              choosenComponentCount++;
              componentObj.componentId = componentId;
              const productsInCom = componentDetails;
              const paramProductsInCom = [];
              for (let j = 0; j < productsInCom.length; j++) {
                const {choosen, productName, orderModeId, choosenOrderCycle, productId, priceplans} = productsInCom[j]
                if (choosen) {
                  choosenProductInComponentCount++;
                  const paramProductInCom = {
                    productId: productId,
                    orderCycles: choosenOrderCycle
                  };
                  let choosenPricePlanInComCount = 0;
                  for (let k = 0; k < priceplans.length; k++) {
                    if (priceplans[k].choosen) {
                      choosenPricePlanInComCount++;
                      paramProductInCom.pricePlanId = priceplans[k].pricePlanId;
                      break;
                    }
                  }
                  paramProductsInCom.push(paramProductInCom);
                  if (choosenPricePlanInComCount === 0) {
                    ToastAndroid.show('包内产品\"' + productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
                    return false;
                  }
                  if (orderModeId === 2 && choosenOrderCycle) {
                    ToastAndroid.show('包内产品\"' + productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
                    return false;
                  }
                }
              }
              if (choosenProductInComponentCount === 0) {
                ToastAndroid.show('套餐\"' + product.productName + '\"中的包\"' + componentName + '\"没有选择产品！', ToastAndroid.SHORT);
                return false;
              }
              if (choosenProductInComponentCount < minChoosenProCount || choosenProductInComponentCount > maxChoosenProCount) {
                ToastAndroid.show('套餐\"' + product.productName + '\"中的包\"' + componentName + '\"中的可选产品数量范围为：' + minChoosenProCount + '~' + maxChoosenProCount + '！', ToastAndroid.SHORT);
                return false;
              }
              componentObj.products = paramProductsInCom;
              requestBodyInnerObj.componentsParams.push(componentObj);
            }
          }
          if (choosenComponentCount === 0) {
            ToastAndroid.show('套餐\"' + product.productName + '\"没有选择包！', ToastAndroid.SHORT);
            return false;
          }
        }
      }
      if (requestBodyInnerObj.productId) {
        requestBody.push(requestBodyInnerObj);
      }
    }
    if (!choosenProductOrNot) {
      ToastAndroid.show('请选择产品！', ToastAndroid.SHORT);
      return false;
    } else {
      return requestBody;
    }
  } else {
    ToastAndroid.show('没有可用产品！', ToastAndroid.SHORT);
    return false;
  }
}

export const checkProductsAndReturnRequestBodyForNewInstall = (state) => {
  const {chooseProducts, newInstallBasicInfo, resources, chooseSubscriberType, chooseSubsdiaryType, choosePhysicProducts} = state;

  let newInstallDto = {
    subscriberTypeId: chooseSubscriberType.id,
    subsdiaryTypeId: chooseSubsdiaryType.id,
    username: newInstallBasicInfo.newInstallDto.username,
    passWord: newInstallBasicInfo.newInstallDto.passWord,
    authenTypeId: newInstallBasicInfo.newInstallDto.authenTypeId
  };
  const requestBody = {newInstallDto, actionId: newInstallBasicInfo.actionId};
  const resourcesParam = [];

  if (choosePhysicProducts && choosePhysicProducts.length > 0) {
    for (let i = 0; i < choosePhysicProducts.length; i++) {
      const {productId, pricePlans, packageProId} = choosePhysicProducts[i];
      const physicProductParam = {productId, includeInProPac: packageProId && packageProId > 0};
      for (let j = 0; j < resources.length; j++) {
        const {resourceTypeId, resourceNum} = resources[j];
        if (resourceTypeId === choosePhysicProducts[i].resourceTypeId) {
          physicProductParam.resourceNum = resourceNum;
        }
      }
      for (let j = 0; j < pricePlans.length; j++) {
        const {pricePlanId, choosen} = pricePlans[j];
        if (choosen) {
          physicProductParam.pricePlanId = pricePlanId;
        }
      }
      resourcesParam.push(physicProductParam);
    }
  }
  requestBody.resources = resourcesParam;
  if (chooseProducts && chooseProducts.length > 0) {
    let choosenProductOrNot = false
    let choosenPricePlanOrNot = false
    let choosenOrderCycleOrNot = false
    let productDtos = [];
    for (let i = 0; i < chooseProducts.length; i++) {
      const requestBodyInnerObj = {};
      const product = chooseProducts[i];
      const ordermodeid = product.ordermodeid;
      const choosenOrderCycle = product.choosenOrderCycle;


      choosenProductOrNot = true;
      requestBodyInnerObj.productId = product.productId;
      if (ordermodeid === 2 && choosenOrderCycle) {
        choosenOrderCycleOrNot = true;
      }
      if (choosenOrderCycle) {
        requestBodyInnerObj.orderCycles = choosenOrderCycle;
      }
      const pricePlans = product.pricePlans;
      for (let j = 0; j < pricePlans.length; j++) {
        const pricePlan = pricePlans[j];
        if (pricePlan.choosen) {
          choosenPricePlanOrNot = true;
          requestBodyInnerObj.pricePlanId = pricePlan.pricePlanId;
        }
      }
      if (!choosenPricePlanOrNot) {
        ToastAndroid.show('产品\"' + product.productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
        return false;
      }
      if (ordermodeid === 2 && !choosenOrderCycle) {
        ToastAndroid.show('产品\"' + product.productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
        return false;
      }

      const components = product.componets;
      if (components && components.length > 0) {
        let choosenComponentCount = 0;
        requestBodyInnerObj.componentsParams = [];
        for (let i = 0; i < components.length; i++) {
          const componentObj = {};
          const {componentId, componentDetails, minChoosenProCount, maxChoosenProCount, componentName, choosen} = components[i];
          let choosenProductInComponentCount = 0;
          if (choosen) {
            choosenComponentCount++;
            componentObj.componentId = componentId;
            const productsInCom = componentDetails;
            const paramProductsInCom = [];
            for (let j = 0; j < productsInCom.length; j++) {
              const {choosen, productName, orderModeId, choosenOrderCycle, productId, priceplans} = productsInCom[j]
              if (choosen) {
                choosenProductInComponentCount++;
                const paramProductInCom = {
                  productId: productId,
                  orderCycles: choosenOrderCycle
                };
                let choosenPricePlanInComCount = 0;
                for (let k = 0; k < priceplans.length; k++) {
                  if (priceplans[k].choosen) {
                    choosenPricePlanInComCount++;
                    paramProductInCom.pricePlanId = priceplans[k].pricePlanId;
                    break;
                  }
                }
                paramProductsInCom.push(paramProductInCom);
                if (choosenPricePlanInComCount === 0) {
                  ToastAndroid.show('包内产品\"' + productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
                  return false;
                }
                if (orderModeId === 2 && choosenOrderCycle) {
                  ToastAndroid.show('包内产品\"' + productName + '\"没有选择订购周期！', ToastAndroid.SHORT);
                  return false;
                }
              }
            }
            if (choosenProductInComponentCount === 0) {
              ToastAndroid.show('套餐\"' + product.productName + '\"中的包\"' + componentName + '\"没有选择产品！', ToastAndroid.SHORT);
              return false;
            }
            if (choosenProductInComponentCount < minChoosenProCount || choosenProductInComponentCount > maxChoosenProCount) {
              ToastAndroid.show('套餐\"' + product.productName + '\"中的包\"' + componentName + '\"中的可选产品数量范围为：' + minChoosenProCount + '~' + maxChoosenProCount + '！', ToastAndroid.SHORT);
              return false;
            }
            componentObj.products = paramProductsInCom;
            requestBodyInnerObj.componentsParams.push(componentObj);
          }
        }
        if (choosenComponentCount === 0) {
          ToastAndroid.show('套餐\"' + product.productName + '\"没有选择包！', ToastAndroid.SHORT);
          return false;
        }
      }

      if (requestBodyInnerObj.productId) {
        productDtos.push(requestBodyInnerObj);
      }
    }
    requestBody.productDtos = productDtos;
    if (!choosenProductOrNot) {
      ToastAndroid.show('请选择产品！', ToastAndroid.SHORT);
      return false;
    } else {
      return requestBody;
    }
  } else {
    ToastAndroid.show('没有可用产品！', ToastAndroid.SHORT);
    return false;
  }
}

export const checkProductsAndReturnRequestBodyForEquipSale = (products) => {
  if (products && products.length > 0) {
    let choosenProductOrNot = false
    let choosenPricePlanOrNot = false
    let requestBody = [];
    for (let i = 0; i < products.length; i++) {
      const requestBodyInnerObj = {};
      const product = products[i];

      if (product.choosen) {
        choosenProductOrNot = true;
        requestBodyInnerObj.productId = product.productId;
        requestBodyInnerObj.orderNum = product.orderNum
        const pricePlans = product.pricePlans;
        for (let j = 0; j < pricePlans.length; j++) {
          const pricePlan = pricePlans[j];
          if (pricePlan.choosen) {
            choosenPricePlanOrNot = true;
            requestBodyInnerObj.pricePlanId = pricePlan.pricePlanId;
          }
        }
        if (!choosenPricePlanOrNot) {
          ToastAndroid.show('产品\"' + product.productName + '\"没有选择价格计划！', ToastAndroid.SHORT);
          return false;
        }
      }
      if (requestBodyInnerObj.productId) {
        requestBody.push(requestBodyInnerObj);
      }
    }
    if (!choosenProductOrNot) {
      ToastAndroid.show('请选择产品！', ToastAndroid.SHORT);
      return false;
    } else {
      return requestBody;
    }
  } else {
    ToastAndroid.show('没有可用产品！', ToastAndroid.SHORT);
    return false;
  }
}
