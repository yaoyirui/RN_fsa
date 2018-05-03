/**
 * Created by yaoyirui on 2018/1/30.
 */

import {
  ToastAndroid
} from 'react-native'

import {createAction} from '../utils'
import * as acceptService from '../services/accept'

export default {
  namespace: 'pms',
  state: {
    count: 0,
    subscribers: [],
    showChooseSubscriberModal: false,
    showRefreshResult: false,
    showUnbindResult: false,
    chooseSubscriber: {
      subscriberId: -1,
      businessTypeId: -1,
      serviceStr: '',
      statusId: -1,
      terminalNum: -1
    }
  },
  reducers: {
    showOrCloseChooseSubscriberModal(state, {payload}) {
      return {...state, ...payload}
    },
    pmsStart(state, {payload}) {
      return {...state, ...payload}
    },
    pmsEnd(state, {payload}) {
      return {...state, ...payload}
    },
    chooseSubscriber(state, {payload}) {
      return {...state, ...payload, showChooseSubscriberModal: false}
    },
  },
  effects: {
    * queryValidSubscribers({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      let chooseSubscriber = yield select(({pms}) => pms.chooseSubscriber);
      const returnData = yield call(acceptService.queryValidSubscribers, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        if (returnData.jsonData && returnData.jsonData.length > 0) {
          if (chooseSubscriber.subscriberId === -1) {
            chooseSubscriber = returnData.jsonData[0]
          }
        } else {
          ToastAndroid.show('没有可用的用户', ToastAndroid.LONG);
          chooseSubscriber = {
            subscriberId: -1,
            businessTypeId: -1,
            serviceStr: '',
            statusId: -1,
            terminalNum: -1
          }
        }
        yield put(createAction('pmsEnd')({
          subscribers: returnData.jsonData || [],
          chooseSubscriber
        }))
      } else {
        yield put(createAction('pmsEnd')())
      }
    },
    * refreshAuthorization({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(acceptService.refreshAuthorization, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('app/showSuccess')())
        yield put(createAction('pmsEnd')({showRefreshResult: true}))
      } else {
        yield put(createAction('app/showFail')({failText: returnData.msg}))
        yield put(createAction('pmsEnd')())
      }
    },
    * unbind({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(acceptService.unbind, {
        ...payload,
        sessionId
      })
      if (returnData.success) {
        yield put(createAction('app/showSuccess')())
        yield put(createAction('pmsEnd')({showUnbindResult: true}))
      } else {
        yield put(createAction('app/showFail')({failText: returnData.msg}))
        yield put(createAction('pmsEnd')())
      }
    }
  },
}
