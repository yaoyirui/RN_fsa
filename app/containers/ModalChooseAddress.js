/**
 * Created by yaoyirui on 2017/11/1.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList
} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsBasic} from '../utils/interactionManagerUtils'
import ListLoading from './ListLoading'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

@connect(({customer}) => {
    return {
      ...customer
    }
  }
)
class ModalChooseAddress extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      searchStr: ''
    };
  }


  onSubmitEditing = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/showAddressList')({showAddressList: true}))
      this.props.dispatch(createAction('customer/queryAddresses')({
        queryStr: this.state.searchStr,
        dispatch: this.props.dispatch,
        start: 0
      }))
    })
  }

  onPressToChooseAddress = (item) => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/chooseAddress')({
        chooseAddress: item,
        showChooseAddressModal: false,
        addresses: [],
        showAddressList: false
      }))
    })
  }

  closeChooseAddressModal = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('customer/openOrCloseChooseModal')({showChooseAddressModal: false}))
    })
  }


  renderAddress = () => {
    const {addresses, showAddressList, count, dispatch} = this.props;
    if (showAddressList) {
      return <FlatList
        ref={'addressesFl'}
        data={addresses}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._itemSeparatorComponent}
        onEndReachedThreshold={0.1}
        initialNumToRender={12}
        showsVerticalScrollIndicator={true}
        onEndReached={(info) => {
          if (count > 12) {
            dispatch(createAction('customer/queryAddressesForPage')({
              queryStr: this.state.searchStr,
              start: addresses.length,
              rows: 12,
              dispatch
            }))
          }
        }}
      />
    }

  }

  _renderItem = ({item}) => (
    <View style={{justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => {
        this.onPressToChooseAddress(item)
      }}>
        <View style={styles.viewFour}>
          <View style={styles.viewInViewFourInnerLeft}>
            <Text style={styles.textInViewFourAndFiveStyle}>{item.addressName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  _itemSeparatorComponent = () => {
    return <View style={{
      height: 0.5,
      width: width - 40, backgroundColor: 'grey',
      marginRight: 5
    }}/>
  }

  _keyExtractor = (item, index) => item.addressId + '';


  render() {

    const {showChooseAddressModal} = this.props;

    return (
      <Modal style={styles.modal}
             visible={showChooseAddressModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeChooseAddressModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={[styles.textInputViewStyle, styles.textInputViewStyleCode]}>
              <TouchableOpacity onPress={this.onSubmitEditing}>
                <View style={styles.view_icon_style}>
                  <Image
                    style={styles.ic_icon}
                    source={require('../images/search.png')}
                  />
                </View>
              </TouchableOpacity>
              <TextInput
                ref={'textInputSearch'}
                style={styles.textInputStyle}
                placeholder='输入地址名称'
                returnKeyType='search'
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({'searchStr': text})}
                onSubmitEditing={this.onSubmitEditing}
              />

            </View>
          </View>
          <View style={styles.viewOne}>
            {this.renderAddress()}
            <ListLoading loading={this.props.listLoading}/>
          </View>
        </View>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 150,
    width: 280
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  textInTopView: {
    fontSize: 20,
    alignSelf: 'center'
  },
  viewTop: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    width: 280,
    paddingBottom: 20
  },
  viewTopBetween: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingRight: 10
  },
  viewTopCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 2,
  },
  ic_icon: {
    width: 35,
    height: 35
  },
  viewOne: {
    height: height - 290,
    width: 280,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderTopWidth: borderWhith,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  viewTwo: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textInViewOneInner: {
    fontSize: 15,
    color: 'grey'
  },
  textInputViewStyle: {
    width: 220,
    height: 35,
    borderColor: 'grey',
    paddingRight: 10,
    paddingLeft: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 60,
    marginRight: 60,
    alignItems: 'center'
  },
  textInputViewStyleCode: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  textInputStyle: {
    width: 170,
    height: 35,
    marginTop: 3,
  },
  viewButton1: {
    width: 120,
    height: 45,
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 2
  },
  viewButton2: {
    width: 120,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1Style: {
    fontSize: 18,
    color: 'red'
  },
  text2Style: {
    fontSize: 18,
    color: 'white'
  },
  viewOneBottom: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  viewProductDetail: {
    width: 250,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWhith,
    borderColor: borderColor
  },
  viewFour: {
    height: 40,
    width: 260,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewInViewFourInnerLeft: {
    height: 50,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  textInViewFourAndFiveStyle: {
    fontSize: 18,
    color: 'black'
  },
  imageInViewInner: {
    width: 30,
    height: 30
  },
  viewProductDetailPricePlanTop: {
    width: 215,
    height: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInViewProductDetailChooseTop: {
    fontSize: 15,
    color: 'grey'
  },
  viewButtonPricePlan: {
    width: 200,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWhith,
    borderColor: 'red',
    margin: 2
  },
  viewButtonPricePlanChoosen: {
    width: 200,
    height: 45,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  textInViewButtonPricePlan: {
    fontSize: 15,
    color: 'white'
  },
  viewValidDuration: {
    width: 215,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  viewValidDurationBottom: {
    width: 235,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  viewButtonValidDuration: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWhith,
    borderColor: 'red',
    margin: 2
  },
  viewButtonValidDurationChoosen: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  textInViewButtonValidDuration: {
    fontSize: 15,
    color: 'red'
  },
  viewComponetDetailTop: {
    width: 205,
    height: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor
  }
})

export default ModalChooseAddress
