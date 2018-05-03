/**
 * Created by yaoyirui on 2018/1/26.
 */
import {
  ToastAndroid
} from 'react-native'

import {createAction} from '../utils'
import * as acceptService from '../services/accept'

const row = 12;

export default {
  namespace: 'accept',
  state: {
    count: 0,
    accepts: [],
    showQueryResult: false,
    queryConditionOpen: false,
    showAcceptDetail: false,
    listLoading: false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state, ...payload,
        count: 0,
        accepts: [],
        showQueryResult: false,
        queryConditionOpen: false,
        showAcceptDetail: false,
        listLoading: false
      }
    },
    queryAcceptStart(state, {payload}) {
      return {...state, ...payload}
    },
    queryAcceptEnd(state, {payload}) {
      return {...state, ...payload}
    },
    setQueryDate(state, {payload}) {
      return {...state, ...payload}
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
    }
  },
  effects: {
    * queryAcceptsByConditions({payload}, {call, put, select}) {
      yield put(createAction('queryAcceptStart')({...payload}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(acceptService.queryAcceptByConditions, {
        ...payload,
        row: row,
        sessionId: sessionId
      })
      if (returnData.success) {
        if (returnData.count === 0) {
          ToastAndroid.show('没有数据', ToastAndroid.LONG);
        } else {
          yield put(createAction('closeQueryCondition')({
            queryConditionOpen: false,
            accepts: returnData.jsonData,
            count: returnData.count
          }));
        }
      }
      yield put(createAction('queryAcceptEnd')())
    },
    * queryAcceptsForPage({payload}, {call, put, select}) {
      const accepts = yield select(({accept}) => accept.accepts);
      yield put(createAction('queryAcceptStart')({...payload, accepts: accepts, listLoading: true}))
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(acceptService.queryAcceptByConditions, {
        ...payload,
        sessionId: sessionId
      })
      if (returnData.success) {
        if (returnData.jsonData.length === 0) {
          ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
        }
      }
      yield put(createAction('queryAcceptEnd')({
        accepts: accepts.concat(returnData.jsonData),
        count: returnData.count,
        listLoading: false
      }))
    },
  },
}
