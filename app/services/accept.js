/**
 * Created by yaoyirui on 2018/1/26.
 */
import request from '../utils/request'

export const queryAcceptByConditions = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&startDate=' + jsonParam.startDate + '&endDate=' + jsonParam.endDate +
    '&start=' + jsonParam.start + '&rows=' + jsonParam.row + '&customerName=' +
    jsonParam.customerName + '&contractPhone=' + jsonParam.contractPhone;
  return await request(`bussiness/queryAcceptancesByConditions.do?${params}`, {}, jsonParam.dispatch);
}

export const queryValidSubscribers = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId;
  return await request(`pms/queryValidSubscribers.do?${params}`, {}, jsonParam.dispatch);
}

export const refreshAuthorization = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&subscriberId=' + jsonParam.subscriberId;
  return await request(`pms/refreshAuthorization.do?${params}`, {}, jsonParam.dispatch);
}

export const unbind = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&subscriberId=' + jsonParam.subscriberId;
  return await request(`pms/unbind.do?${params}`, {}, jsonParam.dispatch);
}
