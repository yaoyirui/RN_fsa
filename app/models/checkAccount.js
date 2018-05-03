/**
 * Created by yaoyirui on 2018/2/12.
 */
import {
  ToastAndroid
} from 'react-native'

import {createAction} from '../utils'
import * as checkAccountService from '../services/checkAccount'

export default {
  namespace: 'check',
  state: {
    queryCheckAccountsResults: {},
    showPayments: false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state, ...payload,
        queryCheckAccountsResults: {},
        showPayments: false
      }
    },
    queryCheckAccountsEnd(state, {payload}) {
      return {
        ...state, ...payload
      }
    },
    showOrClosePaymentsModal(state, {payload}) {
      return {
        ...state, ...payload
      }
    },
  },
  effects: {
    *queryCheckAccount({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(checkAccountService.queryCheckAccount, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('queryCheckAccountsEnd')({queryCheckAccountsResults: returnData.jsonData}))
      }
    },
    *checkAccount({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(checkAccountService.checkAccount, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('app/showSuccess')())
        const returnDataQuery = yield call(checkAccountService.queryCheckAccount, {
          ...payload,
          sessionId
        })
        if (returnDataQuery.success) {
          yield put(createAction('queryCheckAccountsEnd')({queryCheckAccountsResults: returnDataQuery.jsonData}))
        }
      } else {
        yield put(createAction('app/showFail')({failText: returnData.msg}))
      }
    },
  },
}
