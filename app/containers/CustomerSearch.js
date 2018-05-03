/**
 * Created by yaoyirui on 2017/9/5.
 */

import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  FlatList, ToastAndroid,
} from 'react-native'
import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'

import ListLoading from './ListLoading'
import {
  runAfterInteractionsWithToast,
  runAfterInteractionsBasic
} from '../utils/interactionManagerUtils'

var width = Dimensions.get('window').width;

@connect(({customer, app}) => {
  return {
    ...customer,
    operatorCode: app.operCode
  }
})
class CustomerSearch extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      customerCode: '',
      customerName: '',
      serviceNumber: '',
      resourceNumber: '',
      contractPhone: '',
      certificateNumber: '',
      contractAddress: '',
      start: 0,
      customers: []
    };
  }

  goBack = () => {
    runAfterInteractionsWithToast(this.dispatchGoBack)
  }

  dispatchGoBack = () => {
    this.props.dispatch(createAction('customer/reset')());
    this.props.dispatch(NavigationActions.navigate({routeName: 'BusinessChoosePage'}));
  }

  onPressToSearchCustomer = () => {
    runAfterInteractionsBasic(this.searchCustomer)
  }

  searchCustomer = () => {
    this.setState({start: 0}, () => {
      this.props.dispatch(createAction('customer/queryCustomers')({...this.state, dispatch: this.props.dispatch}))
    });
  }

  onPressToReset = () => {
    this.setState({
      customerCode: '',
      customerName: '',
      serviceNumber: '',
      resourceNumber: '',
      contractPhone: '',
      certificateNumber: '',
      contractAddress: '',
      mobilePhone: ''
    })
  }

  dispatchToOpenQueryCondition = () => {
    this.props.dispatch(createAction('customer/openQueryCondition')())
  }

  dispatchToOpenHistoryCondition = () => {
    this.props.dispatch(createAction('customer/openHistoryCondition')())
  }

  onPressToOpenHistoryCondition = () => {
    runAfterInteractionsWithToast(() => {
      this.dispatchToOpenHistoryCondition();
    })
  }

  onPressToOpenQueryCondition = () => {
    this.refs.customersFl ? this.refs.customersFl.scrollToIndex({viewPosition: 0, index: 0}) : null;
    runAfterInteractionsWithToast(() => {
      this.dispatchToOpenQueryCondition();
    })
  }

  renderQueryConditionUpOrDown = () => {
    if (this.props.queryConditionOpen) {
      return <Image
        style={styles.imageInViewInner}
        source={require('../images/up.png')}
      />
    }
    return <Image
      style={styles.imageInViewInner}
      source={require('../images/down.png')}
    />
  }

  renderHistoryQueryConditionUpOrDown = () => {
    if (this.props.historyConditionOpen) {
      return <Image
        style={styles.imageInViewInner}
        source={require('../images/up.png')}
      />
    }
    return <Image
      style={styles.imageInViewInner}
      source={require('../images/down.png')}
    />
  }

  renderQueryCondition = () => {
    if (this.props.queryConditionOpen) {
      return <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}><View
        style={styles.viewFourOpen}>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'客户编码'}</Text>
          <TextInput
            ref={'customerCode'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.customerCode}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'customerCode': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'客户名称'}</Text>
          <TextInput
            ref={'customerName'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.customerName}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'customerName': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'服务号码'}</Text>
          <TextInput
            ref={'serviceNumber'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.serviceNumber}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'serviceNumber': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'资源编码'}</Text>
          <TextInput
            ref={'resourceNumber'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.resourceNumber}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'resourceNumber': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'联系电话'}</Text>
          <TextInput
            ref={'contractPhone'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.contractPhone}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'contractPhone': text})}
          />
        </View>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'证件号码'}</Text>
          <TextInput
            ref={'certificateNumber'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.certificateNumber}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'certificateNumber': text})}
          />
        </View>
        <View style={[styles.viewFourOpenInner, {borderBottomWidth: 0}]}>
          <Text style={styles.textInViewSecond}>{'联系地址'}</Text>
          <TextInput
            ref={'contractAddress'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.state.contractAddress}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'contractAddress': text})}
          />
        </View>
        <View style={styles.viewFourOpenInnerBottom}>
          <TouchableOpacity onPress={this.onPressToSearchCustomer}>
            <View style={styles.queryViewButtonStyle}>
              <Text style={{fontSize: 18, color: 'white'}}>{'查询'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressToReset}>
            <View style={[styles.queryViewButtonStyle, {backgroundColor: 'white', borderColor: 'red', borderWidth: 1}]}>
              <Text style={{fontSize: 18, color: 'red'}}>{'重置'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    }
    return <View/>
  }

  renderHistoryCondition = () => {
    if (this.props.showHistoryCondition) {
      return <TouchableOpacity onPress={this.onPressToOpenHistoryCondition}>
        <View style={styles.viewFour}>
          <View style={styles.viewInViewFourInnerLeft}>
            <Image
              style={styles.imageInViewInner}
              source={require('../images/history.png')}
            />
            <Text style={styles.textInViewFourAndFiveStyle}>{'历史记录'}</Text>
          </View>
          {this.renderHistoryQueryConditionUpOrDown()}
        </View>
      </TouchableOpacity>
    }
    return <View/>
  }

  renderHistoryItems = () => {
    if (this.props.historyConditionOpen) {
      return <View style={styles.viewFive}><FlatList
        data={this.props.customersHistoryQuery}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._itemSeparatorComponent}
        initialNumToRender={12}
        getItemLayout={(data, index) => ({length: 50.5, offset: 50.5 * index, index})}
      /></View>
    }
  }

  _keyExtractor = (item, index) => item.id + '';

  onPressRenderItem = (item) => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/queryCustomerById')({customerId: item.id}));
    })
  }

  _renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.onPressRenderItem(item)}>
      <View style={styles.viewRenderItemInViewFiveBottom}>
        <Text
          style={styles.textInRenderItemInnerTop}>{item.customerCode + ' ' + item.customerName + '  ' + ((!item.certificateNum || item.certificateNum == 'undefined') ? '' : item.certificateNum)}</Text>
        <Text style={styles.textInRenderItemInnerBottom}>{item.addressName}</Text>
      </View>
    </TouchableOpacity>
  );

  _itemSeparatorComponent = () => {
    return <View style={{
      height: 0.5,
      width: width - 40, backgroundColor: 'grey',
      marginRight: 5
    }}/>
  }


  renderQueryResult = ({count, customers}) => {
    if (count > 0) {
      return <View style={styles.viewFive}>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`查询结果 ${count}个`}</Text>
        </View>
        <FlatList
          ref={'customersFl'}
          data={customers}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._itemSeparatorComponent}
          onEndReachedThreshold={0.01}
          initialNumToRender={12}
          showsVerticalScrollIndicator={true}
          getItemLayout={(data, index) => ({length: 50.5, offset: 50.5 * index, index})}
          onEndReached={(info) => {
            if (count > 12 && count > customers.length) {
              this.props.dispatch(createAction('customer/queryCustomersForPage')({
                ...this.state,
                start: customers.length,
                dispatch: this.props.dispatch
              }))
            } else {
              if (count > 0) {
                ToastAndroid.show('没有更多数据了', ToastAndroid.LONG);
              }
            }
          }}
        />
        <ListLoading loading={this.props.listLoading}/>
      </View>
    }
    return <View/>
  }

  render() {
    const {operatorCode} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.viewTop}>
          <View style={styles.viewInViewTopInnerLeft}>
            <TouchableOpacity onPress={this.goBack}>
              <Image
                style={styles.imageInTopViewInnerLeft}
                source={require('../images/back.png')}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.topTextStyle}>{'客户查询'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operatorCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        <TouchableOpacity onPress={this.onPressToOpenQueryCondition}>
          <View style={styles.viewFour}>
            <View style={styles.viewInViewFourInnerLeft}>
              <Image
                style={styles.imageInViewInner}
                source={require('../images/search.png')}
              />
              <Text style={styles.textInViewFourAndFiveStyle}>{'查询条件'}</Text>
            </View>
            {this.renderQueryConditionUpOrDown()}
          </View>
        </TouchableOpacity>
        {this.renderQueryCondition()}
        {this.renderQueryResult(this.props)}
        {this.renderHistoryCondition()}
        {this.renderHistoryItems()}
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
    backgroundColor: '#FFFFFF'
  },
  icon: {
    width: 32,
    height: 32,
  },
  imageInTopViewInnerLeft: {
    width: 20,
    height: 20
  },
  viewTop: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: borderColor,
    borderBottomWidth: borderWhith
  },
  viewInViewTopInnerLeft: {
    width: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewInViewTopInnerRight: {
    width: 30
  },
  topTextStyle: {
    fontSize: 18,
    marginLeft: 10
  },
  viewSecond: {
    height: 50,
    width: width - 40,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor
  },
  textInViewSecond: {
    fontSize: 15,
    alignSelf: 'center'
  },
  viewThree: {
    height: 10,
    borderColor: borderColor,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith
  },
  viewFour: {
    height: 50,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },

  viewInViewFourInnerLeft: {
    height: 50,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageInViewInner: {
    width: 30,
    height: 30
  },
  viewFourOpen: {
    height: 450,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewFourOpenInner: {
    height: 50,
    width: width - 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewFourOpenInnerBottom: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    padding: 40,
    backgroundColor: '#F5F5F5'
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  textInputStyle: {
    height: 35,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  },
  queryViewButtonStyle: {
    width: 120,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFive: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  viewRenderItemInViewFiveBottom: {
    height: 50,
    width: width - 40,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  textInRenderItemInnerTop: {
    fontSize: 13,
    color: 'black'
  },
  textInRenderItemInnerBottom: {
    fontSize: 10,
    color: 'gray'
  },
})

export default CustomerSearch
