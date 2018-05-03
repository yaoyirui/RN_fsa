/**
 * Created by yaoyirui on 2018/2/12.
 */
import request from '../utils/request'
import {
  ToastAndroid
} from 'react-native'

export const queryCheckAccount = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId;
  return await request(`check/queryCheckAccount.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}

export const checkAccount = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId;
  return await request(`check/checkAccount.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}
