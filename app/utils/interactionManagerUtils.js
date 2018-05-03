/**
 * Created by yaoyirui on 2017/10/25.
 */
import Toast from 'antd-mobile/lib/toast'
import {
  InteractionManager
} from 'react-native'
import {createAction} from '../utils'

export function runAfterInteractionsWithToast(operateMethod) {
  Toast.loading('加载中...', 0, null, true)
  InteractionManager.runAfterInteractions(() => {
    operateMethod()
    Toast.hide()
  })
}

export function runAfterInteractionsBasic(operateMethod) {
  InteractionManager.runAfterInteractions(() => {
    operateMethod()
  })
}

export function runAfterInteractionsWithLoading(operateMethod, dispatch) {
  if (dispatch) {
    dispatch(createAction('app/showLoading')())
  }
  InteractionManager.runAfterInteractions(() => {
    operateMethod()
    if (dispatch) {
      dispatch(createAction('app/closeLoading')())
    }
  })

}
