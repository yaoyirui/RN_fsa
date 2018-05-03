/**
 * Created by yaoyirui on 2018/1/26.
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
  FlatList,
  ToastAndroid,
  DatePickerAndroid
} from 'react-native'


import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import payMethodMap from '../utils/payMethods'
import ModalRechargeSearchDetail from "./ModalRechargeSearchDetail"
import ListLoading from './ListLoading'
import {
  runAfterInteractionsWithToast,
  runAfterInteractionsWithLoading,
  runAfterInteractionsBasic
} from '../utils/interactionManagerUtils'

import {getDateModal} from '../utils/chooseDateModal'

var width = Dimensions.get('window').width;


@connect(({app, accept, payment}) => {
  return {
    ...app,
    operatorCode: app.operCode,
    ...accept,
    startDate: payment.startDate,
    endDate: payment.endDate
  }
})
class AcceptSearch extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      customerName: '',
      contractPhone: '',
      startDate: '',
      endDate: '',
      start: 0
    };
  }

  componentDidMount() {
    const date = new Date();
    this.props.dispatch(createAction('accept/setQueryDate')({
      startDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      endDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
    }));
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('accept/reset')());
      this.props.dispatch(NavigationActions.back())
    })
  }

  onPressToOpenQueryCondition = () => {
    this.props.accepts.length > 0 ? (this.refs.acceptsFl ? this.refs.acceptsFl.scrollToIndex({
      viewPosition: 0,
      index: 0
    }) : null) : null;
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('accept/openQueryCondition')())
    });
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

  onPressToReQueryAccepts = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('accept/queryAcceptsByConditions')({
        ...this.state,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        dispatch: this.props.dispatch
      }))
    })
  }

  onPressToReset = () => {
    this.setState({
      customerName: '',
      contractPhone: '',
      startDate: '',
      endDate: ''
    })
  }


  renderQueryCondition = () => {
    if (this.props.queryConditionOpen) {
      return <View
        style={styles.viewFourOpen}>
        <View style={styles.viewFourOpenInner}>
          <Text style={styles.textInViewSecond}>{'开始日期'}</Text>
          <TextInput
            ref={'startDate'}
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            defaultValue={this.props.startDate}
            underlineColorAndroid="transparent"
            onFocus={() => {
              getDateModal(this.props.dispatch, 'startDate', this.props.endDate)
              this.refs.startDate.blur();
            }}
            onChangeText={(text) => this.setState({'startDate': text})}
          />
        </View>
        <TouchableOpacity onPress={() => {
          getDateModal(this.props.dispatch, 'endDate', this.props.startDate)
        }}>
          <View style={styles.viewFourOpenInner}>
            <Text style={styles.textInViewSecond}>{'结束日期'}</Text>
            <TextInput
              ref={'endDate'}
              style={styles.textInputStyle}
              multiline={true}
              placeholder='请输入'
              defaultValue={this.props.endDate}
              underlineColorAndroid="transparent"
              onFocus={() => {
                getDateModal(this.props.dispatch, 'endDate', this.props.endDate)
                this.refs.endDate.blur();
              }}
              onChangeText={(text) => this.setState({'endDate': text})}
            />
          </View>
        </TouchableOpacity>
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
        <View style={styles.viewFourOpenInnerBottom}>
          <TouchableOpacity onPress={this.onPressToReQueryAccepts}>
            <View style={styles.queryViewButtonStyle}>
              <Text style={{fontSize: 18, color: 'white'}}>{'查询'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressToReset}>
            <View
              style={[styles.queryViewButtonStyle, {backgroundColor: 'white', borderColor: 'red', borderWidth: 1}]}>
              <Text style={{fontSize: 18, color: 'red'}}>{'重置'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    } else {
      return <View/>
    }
  }


  _keyExtractor = (item, index) => item.id + '';

  onPressRenderItem = (item) => {
    ToastAndroid.show('查询受理明细', ToastAndroid.SHORT);
    // runAfterInteractionsBasic(() => {
    //   this.props.dispatch(createAction('accept/queryAcceptDetail')({
    //     id: item.id,
    //     dispatch: this.props.dispatch
    //   }));
    // });
  }

  _renderItem = ({item}) => {
    return <TouchableOpacity
      key={item.id}
      onPress={() => this.onPressRenderItem(item)}><View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center'
      }}>
      <View style={[styles.viewRenderItemInViewFiveBottom, {paddingLeft: 10}]}>
        <View style={{width: width - 100, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={styles.textInRenderItemInnerTop}>{item.customerName + '(' + item.actionName + ')'}</Text>
          <Text
            style={styles.textInRenderItemInnerTop}>{item.acceptSheetStatus + '/' + item.paymentSign}</Text>
        </View>
        <Text style={styles.textInRenderItemInnerBottom}>{item.acceptTime}</Text>
      </View>
      <Image
        style={styles.imageInViewFiveInner}
        source={require('../images/arrow_right.png')}
      />
    </View>
    </TouchableOpacity>
  };

  _itemSeparatorComponent = () => {
    return <View style={{
      height: 0.5,
      width: width - 40, backgroundColor: 'grey',
      marginRight: 5,
      marginLeft: 20
    }}/>
  }

  renderAccepts = ({accepts, count}) => {
    return <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={[styles.viewSecond]}>
        <Text style={styles.textInViewSecond}>{`查询结果 ${count}个`}</Text>
      </View>
      <FlatList
        ref={'acceptsFl'}
        data={accepts}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._itemSeparatorComponent}
        onEndReachedThreshold={0.01}
        initialNumToRender={12}
        showsVerticalScrollIndicator={true}
        getItemLayout={(data, index) => ({length: 50.5, offset: 50.5 * index, index})}
        onEndReached={(info) => {
          if (count > 12 && count > accepts.length) {
            this.props.dispatch(createAction('accept/queryAcceptsForPage')({
              ...this.state,
              start: accepts.length,
              startDate: this.props.startDate,
              endDate: this.props.endDate,
              row: 12,
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
          <Text style={styles.topTextStyle}>受理查询</Text>
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
        {this.renderAccepts(this.props)}
        <ModalRechargeSearchDetail/>
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
    width: width,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    paddingLeft: 30
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
    height: 280,
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
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    backgroundColor: '#F5F5F5',
    padding: 20
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
    width: width - 100,
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
  viewConditionTitle: {
    height: 40,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingLeft: 20
  },
  viewConditionTitleInner: {
    height: 40,
    width: width / 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    alignItems: 'center'
  },
  textInViewFour: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  viewPayMethods: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  viewPayMethodsInner: {
    height: 40,
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignSelf: 'center',
    borderBottomWidth: 0.4
  },
  viewPayMethodsInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    alignSelf: 'center'
  },
  textInPayMethodsInnerLeft: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  imageInViewPayMethodsInner: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  viewFiveInner: {
    height: 40,
    width: width - 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderBottomWidth: 0.4,
    alignItems: 'center'
  },
  textInViewFiveInner: {
    fontSize: 17,
    color: 'grey',
    marginLeft: 20
  },
  imageInViewFiveInner: {
    width: 25,
    height: 25
  },
  viewTen: {
    height: 150,
    width: width,
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonConfirm: {
    width: width - 80,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textConfirmStyle: {
    fontSize: 18,
    color: 'white'
  },
})

export default AcceptSearch
