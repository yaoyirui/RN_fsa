/**
 * Created by yaoyirui on 2017/12/7.
 */
import {
  DatePickerAndroid,
  ToastAndroid
} from 'react-native'
import {createAction} from '../utils'

export const getDateModal = async (dispatch, stateKey, date) => {
  let valueDate = new Date();
  if (date) {
    const dateArray = date.split('-')
    valueDate = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10))
  }
  try {
    const {action, year, month, day} = await DatePickerAndroid.open({
      // 要设置默认值为今天的话，使用`new Date()`即可。
      date: valueDate
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
      dispatch(createAction('payment/setQueryDate')({[stateKey]: year + '-' + (month + 1) + '-' + day}))
    }
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
}



