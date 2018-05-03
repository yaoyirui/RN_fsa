/**
 * Created by yaoyirui on 2017/9/20.
 */
import request from '../utils/request'

export const paymentCommit = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId + '' +
    '&payMethodId=' + jsonParam.payMethodId + '&paymentAmount=' + jsonParam.paymentAmount + '' +
    '&devOperatorCode=' + jsonParam.devOperatorCode + '&remark=' + jsonParam.remark;
  return await request(`payment/paymentCommit.do?${params}`, {}, jsonParam.dispatch);
}

export const paymentCommitOnDemand = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId + '' +
    '&payMethodId=' + jsonParam.payMethodId + '&paymentAmount=' + jsonParam.paymentAmount + '' +
    '&devOperatorCode=' + jsonParam.devOperatorCode + '&remark=' + jsonParam.remark;
  return await request(`payment/paymentCommitOnDemand.do?${params}`, {}, jsonParam.dispatch);
}

export const queryPaymentsByConditions = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&startDate=' + jsonParam.startDate + '&endDate=' + jsonParam.endDate +
    '&start=' + jsonParam.start + '&rows=' + jsonParam.rows + '&payMethodId=' + jsonParam.payMethodId + '&customerName=' +
    jsonParam.customerName + '&contractPhone=' + jsonParam.contractPhone;
  return await request(`payment/queryPaymentsByConditions.do?${params}`, {}, jsonParam.dispatch);
}

export const checkAccountBillListBetweenDate = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&startDate=' + jsonParam.startDate + '&endDate=' + jsonParam.endDate +
    '&payMethodId=' + jsonParam.payMethodId;
  return await request(`check/checkAccountBillListBetweenDate.do?${params}`, {}, jsonParam.dispatch);
}

export const queryPaymentDetail = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&id=' + jsonParam.id;
  return await request(`payment/queryPaymentDetail.do?${params}`, {}, jsonParam.dispatch);
}



