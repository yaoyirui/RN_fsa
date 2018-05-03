/**
 * Created by yaoyirui on 2017/8/13.
 */
import {
  ToastAndroid
} from 'react-native'
import {createAction, NavigationActions} from '../utils'

const {httpServerCors, defaultOptionsCors} = require('./system.config');

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  console.log(JSON.stringify(response));
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 *
 * @param url
 * @param options
 * @param dispatch
 * @returns {Promise.<T>}
 */
export default function request(url, options, dispatch) {
  return fetch(`${httpServerCors}${url}`, {...defaultOptionsCors, ...options})
    .then(checkStatus, (value) => {
      ToastAndroid.show(JSON.stringify(value), ToastAndroid.LONG);
    })
    .then(parseJSON, (value) => {
      ToastAndroid.show(JSON.stringify(value), ToastAndroid.LONG);
    })
    .then(data => {
      if (!data.success) {
        ToastAndroid.show(data.msg, ToastAndroid.SHORT);
        if (data.timeout && dispatch) {
          try {
            dispatch(createAction('app/logout')());
          } catch (e) {
          }
          dispatch(NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Login'})],
          }))
        }
        return data;
      }
      return data;
    }, (value) => {
      ToastAndroid.show(JSON.stringify(value), ToastAndroid.LONG);
    })
    .catch(err => {
      ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG);
    });
}



