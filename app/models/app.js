import {createAction, NavigationActions} from '../utils'
import * as authService from '../services/auth'

export default {
  namespace: 'app',
  state: {
    modalLoading: false,
    fetching: false,
    login: false,
    isOpenModal: false,
    isDisabledModal: false,
    rememberOperCode: false,
    sessionId: '',
    operCode: '',
    loginData: {jsonData: {operatorCode: ''}},
    homePageInfo: [],
    customerBasicInfo: {
      customerId: -1,
      customerName: '',
      contactPhone: '',
      addressStr: '',
      accountBalance: ''
    }
  },
  reducers: {
    showLoading(state, {payload}) {
      return {...state, ...payload, modalLoading: true}
    },
    closeLoading(state, {payload}) {
      return {...state, ...payload, modalLoading: false}
    },
    loginStart(state, {payload}) {
      return {...state, ...payload}
    },
    returnLoginData(state, {payload}) {
      return {...state, ...payload}
    },
    loginEnd(state, {payload}) {
      return {...state, ...payload}
    },
    loginFail(state, {payload}) {
      return {...state, ...payload}
    },
    sysRememberOperCode(state, {payload}) {
      return {...state, ...payload}
    },
    queryHomePageInfo(state, {payload}) {
      return {...state, ...payload}
    },
    confirmCustomer(state, {payload}) {
      return {...state, ...payload}
    },
    clearCustomerBasicInfo(state, {payload}) {
      return {
        ...state, ...payload, customerBasicInfo: {
          customerId: -1,
          customerName: '',
          contactPhone: '',
          addressStr: '',
          accountBalance: ''
        }
      }
    },
    showSuccess(state, {payload}) {
      return {...state, ...payload, showSuccess: true}
    },
    closeSuccess(state, {payload}) {
      return {...state, ...payload, showSuccess: false}
    },
    showFail(state, {payload}) {
      return {...state, ...payload, showFail: true}
    },
    closeFail(state, {payload}) {
      return {...state, ...payload, showFail: false}
    }
  },
  effects: {
    * login({payload}, {call, put}) {
      const login = yield call(authService.login, {...payload})
      if (login.success) {
        yield put(createAction('returnLoginData')({loginData: login, sessionId: login.jsonData.sessionId}))
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'HomeNavigator'})],
          })
        )
      }
    },
    * rememberOperCode({payload}, {call, put}) {
      yield put(createAction('sysRememberOperCode')({...payload}))
    },
    * clearCache({payload}, {call, put}) {
      yield put(createAction('clearCustomerBasicInfo')())
      yield put(createAction('customer/reset')({customersHistoryQuery: []}))
    },
    * queryHomePageInfoEffect({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const homePageInfo = yield call(authService.queryHomePageInfo, {...payload, sessionId: sessionId})
      if (homePageInfo.success) {
        yield put(createAction('queryHomePageInfo')({
          homePageInfo: homePageInfo.jsonData
        }))
      }
    },
    * logout({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      yield call(authService.logout, {sessionId: sessionId});
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
      })
    },
    * resetPwd({payload}, {call, put, select}) {
      const sessionId = yield select(({app}) => app.sessionId);
      const returnData = yield call(authService.resetPwd, {...payload, sessionId: sessionId});
      if (returnData.success) {
        yield put(createAction('showSuccess')())
      } else {
        yield put(createAction('showFail')({failText: returnData.msg}))
      }
    },
  },
}
