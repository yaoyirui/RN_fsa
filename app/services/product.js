/**
 * Created by yaoyirui on 2017/11/1.
 */

import request from '../utils/request'
import {
  ToastAndroid
} from 'react-native'

export const queryCanBeAcceptSubscribers = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId + '&actionTypeCode=07';
  return await request(`product/queryCanBeAcceptSubscribers.do?${params}`, {}, jsonParam.dispatch);
}

export const queryCanBeOrderServiceProducts = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&subscriberId=' + jsonParam.subscriberId + '&businessTypeId=2' +
    '&start=' + jsonParam.start + '&rows=' + jsonParam.row + '&queryStr=' + jsonParam.queryStr;
  return await request(`product/queryCanBeOrderServiceProducts.do?${params}`, {}, jsonParam.dispatch);
}

export const calculateServiceProductsFee = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&subscriberId=' + jsonParam.subscriberId + '&businessTypeId=2' + '&requestBody=' + jsonParam.requestBody
  return await request(`product/calculateServiceProductsFee.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}

export const orderServiceProduct = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId +
    '&subscriberId=' + jsonParam.subscriberId +
    '&businessTypeId=2' +
    '&payMethodId=' + jsonParam.payMethodId +
    '&devOperatorCode=' + jsonParam.devOperatorCode +
    '&savingFee=' + jsonParam.savingFee +
    '&remark=' + jsonParam.remark +
    '&payOrNot=' + jsonParam.payOrNot +
    '&derateBalanceFee=' + jsonParam.derateBalanceFee +
    '&isDerateBalanceFee=' + jsonParam.isDerateBalanceFee +
    '&requestBody=' + jsonParam.requestBody
  return await request(`product/orderServiceProduct.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}


