/**
 * Created by yaoyirui on 2017/9/7.
 */
import {createAction, NavigationActions} from '../utils'
import * as customerService from '../services/customer'
import * as basicService from '../services/basic'

import {
  ToastAndroid
} from 'react-native'

const rows = 12;

export default {
  namespace: 'customer',
  state: {
    count: 0,
    customers: [],
    customersHistoryQuery: [],
    customerDetail: {subscriberInfos: []},
    isOpenModal: false,
    isDisabledModal: false,
    queryConditionOpen: false,
    historyConditionOpen: true,
    showHistoryCondition: true,
    showQueryResult: false,
    openCustomerDetail: false,
    listLoading: false,
    dics: [],
    saleAreas: [],
    addresses: [],
    chooseAddress: {},
    detailAddress: '',
    chooseCertificateDic: {},
    chooseCertificateNumber: '',
    chooseSaleArea: {},
    chooseSocialTypeDic: {},
    chooseAreaTypeDic: {},
    showChooseModal: false,
    showChooseAddressModal: false,
    type: -1,
    showAddressList: false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state, ...payload,
        count: 0,
        customers: [],
        isOpenModal: false,
        isDisabledModal: false,
        queryConditionOpen: false,
        historyConditionOpen: true,
        showHistoryCondition: true,
        showQueryResult: false,
        openCustomerDetail: false,
        listLoading: false,
        dics: [],
        saleAreas: [],
        addresses: [],
        chooseAddress: {},
        detailAddress: '',
        chooseCertificateDic: {},
        chooseCertificateNumber: '',
        chooseSaleArea: {},
        chooseSocialTypeDic: {},
        chooseAreaTypeDic: {},
        showChooseModal: false,
        showChooseAddressModal: false,
        type: -1,
        showAddressList: false
      }
    },
    openCustomerDetail(state, {payload}) {
      return {...state, ...payload, openCustomerDetail: true}
    },
    closeCustomerDetail(state, {payload}) {
      return {...state, ...payload, openCustomerDetail: false}
    },
    queryCustomersStart(state, {payload}) {
      return {...state, ...payload}
    },
    queryCustomersEnd(state, {payload}) {
      return {...state, ...payload, listLoading: false}
    },
    openQueryCondition(state, {payload}) {
      if (!state.queryConditionOpen) {
        return {
          ...state, ...payload,
          queryConditionOpen: !state.queryConditionOpen,
          historyConditionOpen: false,
          showQueryResult: false,
          showHistoryCondition: state.count === 0
        }
      }
      return {
        ...state, ...payload,
        queryConditionOpen: !state.queryConditionOpen,
        showQueryResult: state.count > 0,
        showHistoryCondition: state.count === 0
      }
    },
    closeQueryCondition(state, {payload}) {
      return {
        ...state, ...payload
      }
    },
    openHistoryCondition(state, {payload}) {
      if (!state.historyConditionOpen) {
        return {
          ...state, ...payload,
          queryConditionOpen: false,
          historyConditionOpen: !state.historyConditionOpen,
          showQueryResult: false
        }
      }
      return {
        ...state, ...payload,
        historyConditionOpen: !state.historyConditionOpen,
        showQueryResult: false
      }
    },
    showAddressList(state, {payload}) {
      return {
        ...state, ...payload
      }
    },
    chooseAddress(state, {payload}) {
      return {
        ...state, ...payload
      }
    },
    chooseBasicData(state, {payload}) {
      const {type} = payload;
      switch (type) {
        case 1:
          return {
            ...state, ...payload, chooseCertificateDic: {...payload}
          }
        case 2:
          return {
            ...state, ...payload, chooseSaleArea: {...payload}
          }
        case 3:
          return {
            ...state, ...payload, chooseSocialTypeDic: {...payload}
          }
        case 4:
          return {
            ...state, ...payload, chooseAreaTypeDic: {...payload}
          }
        default:
          return {
            ...state, ...payload
          }
      }
    },
    openOrCloseChooseModal(state, {payload}) {
      return {...state, ...payload}
    }
  },
  effects: {
    * queryCustomers({payload}, {call, put, select}) {
      yield put(createAction('queryCustomersStart')({...payload}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(customerService.queryCustomerByCondition, {
        ...payload,
        rows,
        sessionId
      })
      if (returnData.success) {
        if (returnData.count === 0) {
          ToastAndroid.show('没有数据', ToastAndroid.LONG);
        } else {
          yield put(createAction('closeQueryCondition')({
            queryConditionOpen: false,
            showQueryResult: returnData.count > 0,
            showHistoryCondition: false,
            customers: returnData.jsonData,
            count: returnData.count
          }))
        }
      }
      yield put(createAction('queryCustomersEnd')())
    },
    * queryCustomersForPage({payload}, {call, put, select}) {
      const customers = yield select(({customer}) => customer.customers);
      yield put(createAction('queryCustomersStart')({...payload, customers: customers, listLoading: true}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(customerService.queryCustomerByCondition, {
        ...payload,
        sessionId,
        rows
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryCustomersEnd')({
        customers: customers.concat(returnData.jsonData),
        count: returnData.count
      }))
    },
    * queryCustomerById({payload}, {call, put, select}) {
      const customers = yield select(({customer}) => customer.customers);
      yield put(createAction('queryCustomersStart')({...payload, customers: customers}))
      const sessionId = yield select(({app}) => app.sessionId);
      const customersHistoryQuery = yield select(({customer}) => customer.customersHistoryQuery);
      const returnData = yield call(customerService.queryCustomerById, {
        ...payload,
        sessionId: sessionId
      })
      if (returnData.success) {
        yield put(createAction('queryCustomersEnd')({
          customerDetail: returnData.jsonData,
          customersHistoryQuery: [{
            id: returnData.jsonData.id,
            customerName: returnData.jsonData.customerName,
            customerCode: returnData.jsonData.customerCode,
            addressName: returnData.jsonData.addressName
          }].concat(customersHistoryQuery)
        }))
        yield put(
          NavigationActions.navigate({routeName: 'CustomerDetailScreen'})
        )
      }
    },
    * queryCustomerByIdOut({payload}, {call, put, select}) {
      const customers = yield select(({customer}) => customer.customers);
      yield put(createAction('queryCustomersStart')({...payload, customers: customers}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(customerService.queryCustomerById, {
        ...payload,
        sessionId: sessionId
      })
      if (returnData.success) {
        yield put(createAction('queryCustomersEnd')({
          customerDetail: returnData.jsonData
        }))
      }
    },
    * queryDicsByTypeId({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(basicService.queryDicsByTypeId, {
        ...payload,
        sessionId: sessionId
      })
      if (returnData.success) {
        yield put(createAction('queryCustomersEnd')({
          dics: returnData.jsonData
        }))
      }
    },
    * querySaleArea({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(basicService.querySaleArea, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('queryCustomersEnd')({
          saleAreas: returnData.jsonData
        }))
      }
    },
    * queryAddresses({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(basicService.queryAddresses, {
        ...payload,
        sessionId,
        rows
      })
      if (returnData.success) {
        if (returnData.count === 0) {
          ToastAndroid.show('没有数据', ToastAndroid.LONG);
        } else {
          yield put(createAction('queryCustomersEnd')({
            addresses: returnData.jsonData,
            count: returnData.count
          }))
        }
      }
    },
    * queryAddressesForPage({payload}, {call, put, select}) {
      const addresses = yield select(({customer}) => customer.addresses);
      yield put(createAction('queryCustomersStart')({...payload, addresses, listLoading: true}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(basicService.queryAddresses, {
        ...payload,
        sessionId,
        rows
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryCustomersEnd')({
        addresses: addresses.concat(returnData.jsonData),
        count: returnData.count
      }))
    }
  },
}
