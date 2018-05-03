/**
 * Created by yaoyirui on 2017/9/8.
 */
import React, {PureComponent} from 'react'
import PaymentAmount from "./PaymentAmount";

class PaymentAmountOnDemand extends PureComponent {

  render() {
    return <PaymentAmount onDemandOrNot={true}/>
  }
}

export default PaymentAmountOnDemand
