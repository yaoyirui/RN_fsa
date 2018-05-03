/**
 * Created by yaoyirui on 2018/2/5.
 */
import request from '../utils/request'
import {
  ToastAndroid
} from 'react-native'

export const queryNewInstallBasicInfo = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId + '&businessId=' + jsonParam.businessId;
  return await request(`newInstall/queryNewInstallBasicInfo.do?${params}`, {}, jsonParam.dispatch);
}

export const queryPhysicalProduct = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&requestBody=' + jsonParam.requestBody;
  return await request(`newInstall/queryPhysicalProductNew.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}

export const queryCanBeOrderServiceProducts = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&requestBody=' + jsonParam.requestBody +
    '&start=' + jsonParam.start + '&rows=' + jsonParam.row + '&queryStr=' + jsonParam.queryStr;
  return await request(`newInstall/queryCanBeOrderServiceProducts.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}

export const calculateNewInstallProductsFee = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&requestBody=' + jsonParam.requestBody;
  return await request(`newInstall/calculateNewInstallProductsFee.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}

export const newInstallAccept = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&requestBody=' + jsonParam.requestBody + '&businessId=' + jsonParam.businessId + '&savingFee=' + jsonParam.savingFee;
  return await request(`newInstall/newInstallAccept.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}
