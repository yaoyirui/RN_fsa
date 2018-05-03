import request from "../utils/request";

export const queryCanBeOrderPeripheralEquips = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId +
    '&start=' + jsonParam.start + '&rows=' + jsonParam.rows + '&queryStr=' + jsonParam.queryStr;
  return await request(`equip/queryCanBeOrderPeripheralEquips.do?${params}`, {}, jsonParam.dispatch);
}

export const calculatePeripheralEquipsFee = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId + '&customerId=' + jsonParam.customerId + '&requestBody=' + jsonParam.requestBody
  return await request(`equip/calculatePeripheralEquipsFee.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}

export const orderPeripheralEquip = async (jsonParam) => {
  const params = 'sessionId=' + jsonParam.sessionId +
    '&customerId=' + jsonParam.customerId +
    '&payMethodId=' + jsonParam.payMethodId +
    '&devOperatorCode=' + jsonParam.devOperatorCode +
    '&savingFee=' + jsonParam.savingFee +
    '&remark=' + jsonParam.remark +
    '&payOrNot=' + jsonParam.payOrNot +
    '&requestBody=' + jsonParam.requestBody
  return await request(`equip/orderPeripheralEquip.do?${encodeURI(params)}`, {}, jsonParam.dispatch);
}
