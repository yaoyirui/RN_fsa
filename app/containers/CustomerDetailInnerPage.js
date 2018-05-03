/**
 * Created by yaoyirui on 2017/9/8.
 */
import React, {PureComponent} from 'react'
import {StyleSheet, View, Dimensions, Text} from 'react-native'
import {connect} from 'react-redux'

var width = Dimensions.get('window').width;

@connect(({customer}) => {
    return {
      ...customer
    }
  }
)
class CustomerDetailInnerPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSubscribers = () => {
    const subscriberInfos = this.props.customerDetail.subscriberInfos;
    return subscriberInfos ? subscriberInfos.map((subscriber, index) => {
        const resourceInfos = subscriber.resourceInfos;
        const productInstanceInfos = subscriber.productInstanceInfos;
        return <View key={index}><View style={styles.viewTwoInnerBusiness}><Text
          style={styles.textInViewTwoInnerBusiness}>{
          subscriber.businessTypeId === 2 ? '数字电视业务用户(终端号:' + subscriber.terminalNum + ')' :
            (subscriber.businessTypeId === 3 ? '数据业务用户(终端号:' + subscriber.terminalNum + ')' : '')}</Text>
          <Text style={styles.textInViewTwoInnerBusiness}>{subscriber.statusId === 0 ? '有效' : '其他'}</Text>
        </View>
          {
            subscriber.businessTypeId !== 2 ? <View style={styles.viewTwoInnerResource}>
                <Text
                  style={styles.textInViewTwoInnerResource}>{'服务号码 ' + subscriber.serviceStr}</Text></View>
              : <View/>
          }

          {
            resourceInfos ? resourceInfos.map(function (resource, index) {
              return <View key={index} style={styles.viewTwoInnerResource}>
                <Text
                  style={styles.textInViewTwoInnerResource}>{resource.physicalProductName + ' ' + resource.resourceCode}</Text>
              </View>
            }) : <View/>
          }
          {
            productInstanceInfos ? <View style={{
              height: 0.5,
              alignSelf: 'center',
              width: width - 30,
              backgroundColor: 'grey'
            }}/> : <View/>
          }
          {
            productInstanceInfos ? productInstanceInfos.map((product, index) => {
              return <View key={index} style={styles.viewTwoInnerProduct}>
                <Text
                  style={styles.textInViewTwoInnerProductTop}>{product.productName + '(' + product.pricePlanName + ')'}</Text>
                <Text
                  style={styles.textInViewTwoInnerProductBottom}>{'计费期间:' + product.billStartDate + '~' + product.billEndDate}</Text>
              </View>
            }) : <View/>
          }
        </View>
      }
    ) : <View/>
  }

  render() {
    const {customerDetail} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.viewOne}>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'客户名称   '}</Text>
            <Text style={styles.textInViewOneInnerRight}>{customerDetail.customerName}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'联系电话   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{customerDetail.contactPhone + ' ' + customerDetail.mobilePhoneNum}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'联系地址   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{customerDetail.addressName}</Text>
          </View>
          <View style={styles.viewOneInner}>
            <Text style={styles.textInViewOneInnerLeft}>{'帐户余额   '}</Text>
            <Text
              style={styles.textInViewOneInnerRight}>{customerDetail.accountBalance}</Text>
          </View>
        </View>
        <View style={styles.viewTwo}>
          {this.renderSubscribers()}
        </View>
      </View>
    )
  }
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  viewOne: {
    height: 160,
    width: width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: borderWhith,
    paddingLeft: 20
  },
  viewOneInner: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  viewTwo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith
  },
  textInViewOneInnerLeft: {
    fontSize: 15,
    color: 'grey'
  },
  textInViewOneInnerRight: {
    fontSize: 16,
    color: 'black'
  },
  viewTwoInnerBusiness: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  viewTwoInnerResource: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  viewTwoInnerProduct: {
    height: 60,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginRight: 20
  },
  textInViewTwoInnerBusiness: {
    fontSize: 14,
    color: 'grey'
  },
  textInViewTwoInnerResource: {
    fontSize: 14,
    color: 'black'
  },
  textInViewTwoInnerProductTop: {
    fontSize: 14,
    color: 'black'
  },
  textInViewTwoInnerProductBottom: {
    fontSize: 12,
    color: 'grey'
  },
})

export default CustomerDetailInnerPage
