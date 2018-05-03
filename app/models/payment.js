/**
 * Created by yaoyirui on 2017/9/20.
 */
/**
 * Created by yaoyirui on 2017/9/7.
 */

import {
  ToastAndroid
} from 'react-native'

import {createAction} from '../utils'
import * as paymentService from '../services/payment'

const rows = 12;
const date = new Date();

export default {
  namespace: 'payment',
  state: {
    count: 0,
    openPaymentConfirmModal: false,
    params: {
      choosePayMethod: '',
      choosePayMethodName: '',
      payAmount: '',
      devCode: '',
      remark: '',
    },
    recharges: [],
    checkAccountBills: [],
    showChargeSuccess: false,
    queryConditionOpen: false,
    showQueryResult: true,
    showPayments: false,
    listLoading: false,
    startDate: '',
    endDate: '',
    rechargeDetail: {},
    showRechargeSearchDetail: false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state, ...payload,
        count: 0,
        openPaymentConfirmModal: false,
        recharges: [],
        checkAccountBills: [],
        showChargeSuccess: false,
        queryConditionOpen: false,
        showQueryResult: true,
        showPayments: false,
        listLoading: false,
        startDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        endDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        rechargeDetail: {},
        showRechargeSearchDetail: false
      }
    },
    setQueryDate(state, {payload}) {
      return {...state, ...payload}
    },
    openPaymentConfirm(state, {payload}) {
      return {...state, ...payload, openPaymentConfirmModal: true}
    },
    closePaymentConfirm(state, {payload}) {
      return {...state, ...payload, openPaymentConfirmModal: false}
    },
    openRechargeSearchDetailModal(state, {payload}) {
      return {...state, ...payload, showRechargeSearchDetail: true}
    },
    closeRechargeSearchDetailModal(state, {payload}) {
      return {...state, ...payload, showRechargeSearchDetail: false}
    },
    paymentCommitEnd(state, {payload}) {
      return {...state, ...payload, openPaymentConfirmModal: false}
    },
    closeRechargeSuccessModal(state, {payload}) {
      return {...state, ...payload, showChargeSuccess: false}
    },
    queryPaymentsStart(state, {payload}) {
      return {...state, ...payload}
    },
    queryPaymentsEnd(state, {payload}) {
      return {...state, ...payload, listLoading: false}
    },
    openQueryCondition(state, {payload}) {
      return {
        ...state, ...payload,
        queryConditionOpen: !state.queryConditionOpen,
        showQueryResult: state.queryConditionOpen
      }
    },
    closeQueryCondition(state, {payload}) {
      return {
        ...state, ...payload, showQueryResult: true
      }
    },
  },
  effects: {
    * paymentCommit({payload}, {call, put, select}) {
      const customerBasicInfo = yield select(({app}) => app.customerBasicInfo);
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(paymentService.paymentCommit, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('app/confirmCustomer')({
          customerBasicInfo: {...customerBasicInfo, accountBalance: returnData.jsonData.accountBalance}
        }))
        yield put(createAction('paymentCommitEnd')({showChargeSuccess: true}))
      }
    },
    * paymentCommitOnDemand({payload}, {call, put, select}) {
      const customerBasicInfo = yield select(({app}) => app.customerBasicInfo);
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(paymentService.paymentCommitOnDemand, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('app/confirmCustomer')({
          customerBasicInfo: {...customerBasicInfo, accountBalance: returnData.jsonData.accountBalance}
        }))
        yield put(createAction('paymentCommitEnd')({showChargeSuccess: true}))
      }
    },
    * checkAccountBillListBetweenDate({payload}, {call, put, select}) {
      yield put(createAction('queryPaymentsStart')({...payload}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(paymentService.checkAccountBillListBetweenDate, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('closeQueryCondition')({
          checkAccountBills: returnData.jsonData,
          showQueryResult: true,
          queryConditionOpen: false
        }))
      }
      yield put(createAction('queryPaymentsEnd')())
    },
    * queryPaymentsByConditions({payload}, {call, put, select}) {
      yield put(createAction('queryPaymentsStart')({...payload}));
      const recharges = yield select(({payment}) => payment.recharges);
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(paymentService.queryPaymentsByConditions, {
        ...payload,
        rows,
        sessionId
      })
      if (returnData.success) {
        if (returnData.count === 0) {
          ToastAndroid.show('没有数据', ToastAndroid.LONG);
        } else {
          if (returnData.jsonData.length === 0) {
            ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
          } else {
            yield put(createAction('closeQueryCondition')({
              queryConditionOpen: false,
              showPayments: returnData.count > 0,
              recharges: payload.start > 0 ? recharges.concat(returnData.jsonData) : returnData.jsonData,
              count: returnData.count
            }))
          }
        }
      }
      yield put(createAction('queryPaymentsEnd')())
    },
    * queryPaymentDetail({payload}, {call, put, select}) {
      yield put(createAction('queryPaymentsStart')({...payload}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(paymentService.queryPaymentDetail, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('openRechargeSearchDetailModal')({rechargeDetail: returnData.jsonData}))
      }
      yield put(createAction('queryPaymentsEnd')())
    }
  },
}
