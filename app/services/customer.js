/**
 * Created by yaoyirui on 2017/9/8.
 */
import {delay} from '../utils'
import request from '../utils/request'

export const queryCustomerByCondition = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}&serviceStr=${jsonParam.serviceNumber}&inputPhoneNum=${jsonParam.contractPhone}&customerName=${jsonParam.customerName}&customerCode=${jsonParam.customerCode}&resourceCode=${jsonParam.resourceNumber}&certificateNum=${jsonParam.certificateNumber}&contactAddress=${jsonParam.contractAddress}&start=${jsonParam.start}&rows=${jsonParam.rows}`
  return await request(`customer/queryCustomersByCondition.do?${params}`, {}, jsonParam.dispatch);
}

export const queryCustomerById = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}&customerId=${jsonParam.customerId}`
  return await request(`customer/queryCustomerById.do?${params}`, {}, jsonParam.dispatch);
}

export const addOrUpdateCustomer = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}
  &id=${jsonParam.id}
  &customerName=${jsonParam.customerName}
  &contactPhone=${jsonParam.contactPhone}
  &addressId=${jsonParam.addressId}
  &addressDetail=${jsonParam.addressDetail}
  &addressName=${jsonParam.addressName}
  &certificateType=${jsonParam.certificateType}
  &certificateNum=${jsonParam.certificateNum}
  &societyType=${jsonParam.societyType}
  &areaType=${jsonParam.areaType}
  &mobilePhoneNum=${jsonParam.mobilePhoneNum}
  &saleAreaId=${jsonParam.saleAreaId}
  &saleAreaName=${jsonParam.saleAreaName}
  &remarks=${jsonParam.remarks}
  `
  return await request(`customer/addCustomer.do?${params}`, {}, jsonParam.dispatch);
}

export const modifyPhone = async (jsonParam) => {
  const params = `sessionId=${jsonParam.sessionId}
  &id=${jsonParam.id}
  &contactPhone=${jsonParam.contactPhone}
  &mobilePhoneNum=${jsonParam.mobilePhoneNum}
  `
  return await request(`customer/modifyPhone.do?${params}`, {}, jsonParam.dispatch);
}
