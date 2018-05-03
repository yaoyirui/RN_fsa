import {delay} from '../utils'
import request from '../utils/request'

// export const login = async () => {
//   await delay(2000)
//   return true
// }

export const login = async (jsonParam) => {
  return await request(`login/loginByApp.do?code=${jsonParam.code}&pwd=${jsonParam.pwd}`);
}

export const queryHomePageInfo = async (jsonParam) => {
  return await request(`general/queryHomePageInfo.do?sessionId=${jsonParam.sessionId}`, {}, jsonParam.dispatch);
}

export const resetPwd = async (jsonParam) => {
  return await request(`login/resetPwd.do?sessionId=${jsonParam.sessionId}&pwd=${jsonParam.pwd}&newPwd=${jsonParam.newPwd}`, {}, jsonParam.dispatch);
}

export const logout = async (jsonParam) => {
  return await request(`login/logout.do?sessionId=${jsonParam.sessionId}`);
}
