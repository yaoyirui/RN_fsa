import EquipSale from "../containers/EquipSale";
import PaymentAmountOnDemand from "../containers/PaymentAmountOnDemand";

/**
 * Created by yaoyirui on 2017/10/20.
 */
const privilegesMap = new Map([
  ['101', {'screen': 'CustomerCreate', 'name': '客户建档', 'img': require('../images/drag_customer_file.png')}],
  ['102', {'screen': 'PaymentAmount', 'name': '预存缴费', 'img': require('../images/drag_payment.png')}],
  ['103', {'screen': 'OrderProduct', 'name': '订购产品', 'img': require('../images/drag_order_product.png')}],
  ['104', {'screen': 'RefreshAuthorization', 'name': '刷新授权', 'img': require('../images/drag_refresh.png')}],
  // ['105', {'screen': 'CustomerCreate', 'name': '设备更换', 'img': require('../images/drag_change_equipment.png')}],
  ['106', {'screen': 'EquipSale', 'name': '周边销售', 'img': require('../images/drag_sale.png')}],
  ['107', {'screen': 'CheckAccount', 'name': '轧账', 'img': require('../images/drag_check_account.png')}],
  ['108', {'screen': 'RechargeSearch', 'name': '缴费查询', 'img': require('../images/drag_payment_inquery.png')}],
  ['109', {'screen': 'AcceptSearch', 'name': '受理查询', 'img': require('../images/drag_accept_inquery.png')}],
  // ['110', {'screen': 'CustomerCreate', 'name': '电话变更', 'img': require('../images/drag_change_phone.png')}],
  // ['111', {'screen': 'CustomerCreate', 'name': '信息变更', 'img': require('../images/drag_change_information.png')}],
  // ['112', {'screen': 'CustomerCreate', 'name': '融合套餐', 'img': require('../images/drag_fusion_set.png')}],
  ['113', {'screen': 'Unbind', 'name': '清除绑定', 'img': require('../images/drag_clear_binding.png')}],
  // ['114', {'screen': 'CustomerCreate', 'name': '单边账处理', 'img': require('../images/drag_cancel_card.png')}],
  // ['115', {'screen': 'CustomerCreate', 'name': '宽带踢号', 'img': require('../images/drag_broadband_kick.png')}],
  ['116', {'screen': 'NewInstall', 'name': '电视装机', 'img': require('../images/drag_tv.png')}],
  // ['117', {'screen': 'CustomerCreate', 'name': '宽带装机', 'img': require('../images/drag_broadband.png')}],
  // ['118', {'screen': 'CustomerCreate', 'name': '电视增机', 'img': require('../images/drag_tv_zengji.png')}],
  ['119', {'screen': 'PaymentAmountOnDemand', 'name': '按次点播预存', 'img': require('../images/drag_dianboyucun.png')}],
  // ['120', {'screen': 'CustomerCreate', 'name': '电视报通', 'img': require('../images/drag_tv_baotong.png')}],
  // ['121', {'screen': 'CustomerCreate', 'name': '宽带报通', 'img': require('../images/drag_linshishouquan.png')}],
  // ['122', {'screen': 'CustomerCreate', 'name': '临时授权', 'img': require('../images/drag_customer_file.png')}],
  // ['123', {'screen': 'CustomerCreate', 'name': '融合新装', 'img': require('../images/drag_fusion_newinstall.png')}],
  // ['124', {'screen': 'CustomerCreate', 'name': '产品变更', 'img': require('../images/drag_fusion_change.png')}],
  // ['125', {'screen': 'CustomerCreate', 'name': '产品续费', 'img': require('../images/drag_chanpinxufei.png')}],
  // ['129', {'screen': 'CustomerCreate', 'name': '测试129', 'img': require('../images/drag_chanpinxufei.png')}],
  // ['135', {'screen': 'CustomerCreate', 'name': '测试135', 'img': require('../images/drag_chanpinxufei.png')}],
  // ['136', {'screen': 'CustomerCreate', 'name': '测试136', 'img': require('../images/drag_chanpinxufei.png')}],
  // ['137', {'screen': 'CustomerCreate', 'name': '测试137', 'img': require('../images/drag_chanpinxufei.png')}],
]);
export default privilegesMap;
