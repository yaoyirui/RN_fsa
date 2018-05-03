/**
 * Created by yaoyirui on 2018/2/6.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ToastAndroid,
} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast, runAfterInteractionsBasic} from '../utils/interactionManagerUtils'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

@connect(({newInstall}) => ({...newInstall}))
class ModalChoosePhysicProducts extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  closeChoosePhysicProductModal = () => {
    runAfterInteractionsBasic(() => {
      this.props.dispatch(createAction('newInstall/closeChoosePhysicProductModal')())
    })
  }

  onChooseProducts = () => {
    const {resources, currentResourceTypeId} = this.props;
    runAfterInteractionsBasic(() => {
      this.closeChoosePhysicProductModal()
      if (resources && resources.length === 1) {
        this.props.dispatch(createAction('newInstall/showChoosenProduct')());
        this.props.dispatch(createAction('newInstall/calculateServiceProductsFee')({
          dispatch: this.props.dispatch
        }));
      } else {
        if (resources.length > 1) {
          for (let i = 0; i < resources.length; i++) {
            if (!resources[i].checked) {
              this.props.dispatch(createAction('newInstall/setCurrentResourceTypeId')({
                currentResourceTypeId: resources[i].resourceTypeId
              }));
              break;
            }
          }
        }
      }
    })
  }


  onPressToChooseProduct = (product) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/choosePhysicProducts')({product}))
    });
  }

  onPressToChoosePricePlan = (product, pricePlan) => {
    runAfterInteractionsWithToast(() => {
      this.props.dispatch(createAction('newInstall/choosePhysicProductPricePlan')({product, pricePlan}))
    });
  }


  checkChoosenProduct = (product) => {
    return true;
  }

  renderChooseOrNot = (obj) => {
    if (obj.choosen) {
      return <Image
        style={styles.imageInViewInner}
        source={require('../images/selected.png')}
      />
    } else {
      return <Image
        style={styles.imageInViewInner}
        source={require('../images/unselected.png')}
      />
    }
  }


  renderProducts = () => {
    const {physicProducts, currentResourceTypeId} = this.props;
    if (physicProducts && physicProducts.length > 0) {
      return physicProducts.map((product, index) => {
        if ((currentResourceTypeId === product.resourceTypeId) && !product.packageProId) {
          return <TouchableOpacity key={index} onPress={() => {
            this.onPressToChooseProduct(product)
          }}>
            <View style={[styles.viewFour, {marginLeft: 10}]}>
              <View style={styles.viewInViewFourInnerLeft}>
                <Text style={styles.textInViewFourAndFiveStyle}>{product.productName}</Text>
              </View>
              {this.renderChooseOrNot(product)}
            </View>
          </TouchableOpacity>
        }
      })
    }
    return <View/>
  }

  renderPricePlans = () => {
    const {choosePhysicProduct} = this.props;
    const {pricePlans} = choosePhysicProduct;
    if (pricePlans && pricePlans.length > 0) {
      return pricePlans.map((pricePlan, index) => {
        return <TouchableOpacity key={index} onPress={() => {
          this.onPressToChoosePricePlan(choosePhysicProduct, pricePlan)
        }}>
          <View style={[styles.viewFour, {marginLeft: 10}]}>
            <View style={styles.viewInViewFourInnerLeft}>
              <Text style={styles.textInViewFourAndFiveStyle}>{pricePlan.pricePlanName}</Text>
            </View>
            {this.renderChooseOrNot(pricePlan)}
          </View>
        </TouchableOpacity>
      })
    }
    return <View/>
  }


  renderButtons = () => {
    return <View style={styles.viewTwo}>
      <TouchableOpacity onPress={() => {
        this.closeChoosePhysicProductModal()
      }}>
        <View style={styles.viewButton1}>
          <Text style={styles.text1Style}>返回</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.onChooseProducts}>
        <View style={styles.viewButton2}>
          <Text style={styles.text2Style}>确认</Text>
        </View>
      </TouchableOpacity>
    </View>

  }

  render() {

    const {showChoosePhysicProductModal, currentResourceTypeId} = this.props;
    return (
      <Modal style={styles.modal}
             visible={showChoosePhysicProductModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeChoosePhysicProductModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>请选择物理产品</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeChoosePhysicProductModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
            <View style={{flex: 1}}>
              <View style={[styles.viewTitle, {paddingLeft: 20}]}>
                <Text>请选择{currentResourceTypeId === 1 ? '智能卡' : '机顶盒'}</Text>
              </View>
              {this.renderProducts()}
              <View style={[styles.viewTitle, {paddingLeft: 20}]}>
                <Text>请选择价格计划</Text>
              </View>
              {this.renderPricePlans()}
            </View>
          </ScrollView>
          {this.renderButtons()}
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
    justifyContent: 'flex-start',
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
    width: 25,
    height: 25
  },
  viewTitle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    width: 280,
    backgroundColor: '#F5F5F5',
    borderTopWidth: borderWhith,
    borderBottomWidth: borderWhith,
    borderColor: borderColor
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
    width: 280,
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
    justifyContent: 'space-between',
    borderBottomColor: borderColor,
    borderBottomWidth: borderWhith,
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
    width: 20,
    height: 20
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

export default ModalChoosePhysicProducts
