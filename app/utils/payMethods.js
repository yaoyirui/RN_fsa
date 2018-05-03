/**
 * Created by yaoyirui on 2017/9/18.
 */
const payMethodMap = new Map([
  ['0', '帐户余额'],
  ['111', '现金'],
  ['119', '银联POS刷卡'],
  ['171', '通联银行卡支付'],
  ['172', '通联扫码支付'],
  ['173', '离线POS刷卡']
]);
export default payMethodMap;
