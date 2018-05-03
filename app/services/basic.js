import request from '../utils/request'

export const queryDicsByTypeId = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}&saleAreaId=${jsonParam.saleAreaId ? jsonParam.saleAreaId : ''}&typeId=${jsonParam.typeId}`
  return await request(`general/queryDicsByTypeId.do?${params}`, {}, jsonParam.dispatch);
}

export const querySaleArea = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}&addressId=${jsonParam.addressId}`
  return await request(`general/querySaleArea.do?${params}`, {}, jsonParam.dispatch);
}

export const queryAddresses = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}&queryStr=${jsonParam.queryStr}&start=${jsonParam.start}&rows=${jsonParam.rows}`
  return await request(`general/queryAddresses.do?${params}`, {}, jsonParam.dispatch);
}


