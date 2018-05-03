/**
 * Created by yaoyirui on 2017/9/8.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  ToastAndroid,
  ScrollView
} from 'react-native'

import {connect} from 'react-redux'
import {createAction, NavigationActions} from '../utils'
import {
  runAfterInteractionsWithToast,
  runAfterInteractionsBasic
} from '../utils/interactionManagerUtils'
import ModalOperationFail from "./ModalOperationFail"
import ModalOperationSuccess from "./ModalOperationSuccess"
import ModalChoose from "./ModalChoose"
import ModalChooseAddress from "./ModalChooseAddress"
import {getDateModal} from "../utils/chooseDateModal";


var width = Dimensions.get('window').width;


@connect(({app, customer}) => {
  return {
    ...app,
    ...customer
  }
})
class CustomerCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerName: '',
      certificateNum: '',
      contactPhone: '',
      mobilePhoneNum: '',
      addressDetail: '',
      remarks: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(createAction('customer/reset')())
  }

  goBack = () => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(NavigationActions.back())
    })
  }

  checkAndCommit = (props) => {
    const {
      chooseCertificateDic,
      chooseSaleArea,
      chooseSocialTypeDic,
      chooseAreaTypeDic,
      chooseAddress,
      dispatch
    } = props;
    if (!chooseCertificateDic.dictionaryDataId) {
      ToastAndroid.show('证件类型不能为空！', ToastAndroid.SHORT);
      return;
    }

    if (this.state.certificateNum === null || this.state.certificateNum === '') {
      ToastAndroid.show('证件号码不能为空！', ToastAndroid.SHORT);
      return;
    }
    if ((this.state.contactPhone === null || this.state.contactPhone === '') && (this.state.mobilePhoneNum === null || this.state.mobilePhoneNum === '')) {
      ToastAndroid.show('联系电话和移动电话不能同时为空！', ToastAndroid.SHORT);
      return;
    }
    if (!chooseAddress.addressId) {
      ToastAndroid.show('地址不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (this.state.addressDetail === null || this.state.addressDetail === '') {
      ToastAndroid.show('详细地址不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (!chooseSaleArea.saleAreaId) {
      ToastAndroid.show('运营区域不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (!chooseSocialTypeDic.dictionaryDataId) {
      ToastAndroid.show('社会类别不能为空！', ToastAndroid.SHORT);
      return;
    }
    if (!chooseAreaTypeDic.dictionaryDataId) {
      ToastAndroid.show('区域类别不能为空！', ToastAndroid.SHORT);
      return;
    }
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/addCustomer')({
        dispatch,
        ...this.state,
        certificateType: chooseCertificateDic.dictionaryDataId,
        societyType: chooseSocialTypeDic.dictionaryDataId,
        areaType: chooseAreaTypeDic.dictionaryDataId,
        addressId: chooseAddress.addressId,
        saleAreaId: chooseSaleArea.saleAreaId
      }))
    })
  }

  onPressToShowChooseModal = (type) => {
    const {dispatch, chooseAddress, chooseSaleArea} = this.props;
    let paramObj = {};
    switch (type) {
      case 1:
        paramObj = {typeId: '1100'}
        break;
      case 2:
        if (!chooseAddress.addressId) {
          ToastAndroid.show('请先选择地址', ToastAndroid.SHORT);
          return;
        }
        paramObj = {addressId: chooseAddress.addressId}
        break;
      case 3:
        if (!chooseSaleArea.saleAreaId) {
          ToastAndroid.show('请先选择运营区域', ToastAndroid.SHORT);
          return;
        }
        paramObj = {typeId: '1202', saleAreaId: (chooseSaleArea.saleAreaId ? chooseSaleArea.saleAreaId : null)}
        break;
      case 4:
        if (!chooseSaleArea.saleAreaId) {
          ToastAndroid.show('请先选择运营区域', ToastAndroid.SHORT);
          return;
        }
        paramObj = {typeId: '1204', saleAreaId: (chooseSaleArea.saleAreaId ? chooseSaleArea.saleAreaId : null)}
        break;
      default:
        break;
    }
    runAfterInteractionsWithToast(() => {
      dispatch(createAction('customer/openOrCloseChooseModal')({
        showChooseModal: true,
        dics: [],
        type
      }))
      if (paramObj.typeId) {
        dispatch(createAction('customer/queryDicsByTypeId')({
          ...paramObj
        }))
      } else {
        dispatch(createAction('customer/querySaleArea')({
          ...paramObj
        }))
      }

    })
  }

  onPressToShowChooseAddressModal = () => {
    this.props.dispatch(createAction('customer/openOrCloseChooseModal')({
      showChooseAddressModal: true,
      addresses: []
    }))
  }


  renderCreateCustomerForm = () => {
    const {
      chooseCertificateDic,
      chooseSaleArea,
      chooseSocialTypeDic,
      chooseAreaTypeDic,
      chooseAddress
    } = this.props;
    return <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}><View style={{flex: 1}}>
      <View style={styles.viewFiveInner}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'客户名称'}</Text>
          <TextInput
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'customerName': text})}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        this.onPressToShowChooseModal(1)
      }}>
        <View style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'证件类型'}</Text>
            <TextInput
              style={styles.textInputStyle}
              ref='certificateType'
              multiline={true}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              onFocus={() => {
                this.onPressToShowChooseModal(1)
                this.refs.certificateType.blur();
              }}
              defaultValue={chooseCertificateDic.dictionaryDataId ? chooseCertificateDic.dictionaryDataName : ''}
            />
            <Image
              style={styles.imageInViewFiveInner}
              source={require('../images/arrow_right.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={[styles.viewFiveInner]}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'证件号码'}</Text>
          <TextInput
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'certificateNum': text})}
          />
        </View>
      </View>
      <View style={[styles.viewFiveInner]}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'联系电话'}</Text>
          <TextInput
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            keyboardType={'numeric'}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'contactPhone': text})}
          />
        </View>
      </View>
      <View style={[styles.viewFiveInner]}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'移动电话'}</Text>
          <TextInput
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            keyboardType={'numeric'}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'mobilePhoneNum': text})}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        this.onPressToShowChooseAddressModal()
      }}>
        <View style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'地址全称'}</Text>
            <TextInput
              style={styles.textInputStyle}
              multiline={true}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              ref='address'
              onFocus={() => {
                this.onPressToShowChooseAddressModal()
                this.refs.address.blur();
              }}
              defaultValue={chooseAddress.addressId ? chooseAddress.addressName : ''}
            />
            <Image
              style={styles.imageInViewFiveInner}
              source={require('../images/arrow_right.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.viewFiveInner}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'详细地址'}</Text>
          <TextInput
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'addressDetail': text})}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        this.onPressToShowChooseModal(2)
      }}>
        <View style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'运营区域'}</Text>
            <TextInput
              style={styles.textInputStyle}
              multiline={true}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              ref='saleArea'
              onFocus={() => {
                this.onPressToShowChooseModal(2)
                this.refs.saleArea.blur();
              }}
              defaultValue={chooseSaleArea.saleAreaId ? chooseSaleArea.saleAreaName : ''}
            />
            <Image
              style={styles.imageInViewFiveInner}
              source={require('../images/arrow_right.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        this.onPressToShowChooseModal(3)
      }}>
        <View style={styles.viewFiveInner}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'社会类别'}</Text>
            <TextInput
              style={styles.textInputStyle}
              multiline={true}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              ref='socialType'
              onFocus={() => {
                this.onPressToShowChooseModal(3)
                this.refs.socialType.blur();
              }}
              defaultValue={chooseSocialTypeDic.dictionaryDataId ? chooseSocialTypeDic.dictionaryDataName : ''}
            />
            <Image
              style={styles.imageInViewFiveInner}
              source={require('../images/arrow_right.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        this.onPressToShowChooseModal(4)
      }}>
        <View style={[styles.viewFiveInner]}>
          <View style={styles.viewFiveInnerLeft}>
            <Text style={styles.textInViewFiveInnerLeft}>{'区域类别'}</Text>
            <TextInput
              style={styles.textInputStyle}
              multiline={true}
              placeholder='请输入'
              underlineColorAndroid="transparent"
              ref='areaType'
              onFocus={() => {
                this.onPressToShowChooseModal(4)
                this.refs.areaType.blur();
              }}
              defaultValue={chooseAreaTypeDic.dictionaryDataId ? chooseAreaTypeDic.dictionaryDataName : ''}
            />
            <Image
              style={styles.imageInViewFiveInner}
              source={require('../images/arrow_right.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={[styles.viewFiveInner, {borderBottomWidth: 0}]}>
        <View style={styles.viewFiveInnerLeft}>
          <Text style={styles.textInViewFiveInnerLeft}>{'备注'}</Text>
          <TextInput
            style={styles.textInputStyle}
            multiline={true}
            placeholder='请输入'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({'remarks': text})}
          />
        </View>
      </View>
      <View style={styles.viewFourOpenInnerBottom}>
        <TouchableOpacity onPress={() => this.checkAndCommit(this.props)}>
          <View
            style={[styles.queryViewButtonStyle]}>
            <Text style={{fontSize: 18, color: 'white'}}>{'确认'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  }

  render() {
    const {operCode} = this.props;
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
          <Text style={styles.topTextStyle}>{'客户建档'}</Text>
          <View style={styles.viewInViewTopInnerRight}/>
        </View>
        <View style={styles.viewSecond}>
          <Text style={styles.textInViewSecond}>{`操作员  ${operCode}`}</Text>
        </View>
        <View style={styles.viewThree}/>
        {this.renderCreateCustomerForm()}
        <ModalOperationSuccess successTitleText='客户建档' successText='建档成功' goBack={this.goBack}/>
        <ModalOperationFail failTitleText='客户建档'/>
        <ModalChoose/>
        <ModalChooseAddress/>
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
    backgroundColor: 'white',
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
  viewFourOpenInnerBottom: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    padding: 40,
    backgroundColor: '#F5F5F5',
    paddingBottom: 70,
    height: 150
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  queryViewButtonStyle: {
    width: 230,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFive: {
    flex: 1,
    width: width,
    borderWidth: borderWhith,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    backgroundColor: 'white'
  },
  viewFiveInner: {
    height: 40,
    width: width - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: borderColor,
    alignSelf: 'center',
    borderBottomWidth: 0.4
  },
  viewFiveInnerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    alignSelf: 'center'
  },
  textInViewFiveInnerLeft: {
    width: 70,
    fontSize: 17,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'center'
  },
  imageInViewFiveInner: {
    width: 25,
    height: 25,
    alignSelf: 'center'
  },
  textInputStyle: {
    height: 35,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 4 : 5,
  },
  viewShowPwdViewStyle: {
    width: width - 30,
    height: 45,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 40
  },
  textShowPwdStyle: {
    fontSize: 18,
    marginTop: 12,
    marginLeft: 10
  }
})


export default CustomerCreate

