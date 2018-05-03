/**
 * Created by yaoyirui on 2018/2/5.
 */
import React, {PureComponent} from 'react';
import {Modal} from 'antd-mobile';
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Dimensions, ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from '../utils'
import {runAfterInteractionsWithToast} from '../utils/interactionManagerUtils'

const height = Dimensions.get('window').height

@connect(({customer}) => {
    return {
      ...customer
    }
  }
)
class ModalChoose extends PureComponent {


  onChoose = (choose) => {
    const {dispatch, type} = this.props;
    runAfterInteractionsWithToast(() => {
      /*
      * type:
      * 1->证件类型
      * 2->运营区域
      * 3->社会类别
      * 4->区域类别
      * */
      dispatch(createAction('customer/chooseBasicData')({...choose, type}));
      this.closeChooseModal();
    })
  }

  closeChooseModal = () => {
    this.props.dispatch(createAction('customer/openOrCloseChooseModal')({showChooseModal: false}))
  }

  renderDatas = () => {
    const {type, dics} = this.props;
    if (dics) {
      return dics.map((dic, index) => {
        return <TouchableOpacity key={index} onPress={() => {
          this.onChoose(dic)
        }}><View style={styles.viewOneInner}>
          <Text style={styles.textInViewOneInner}>{type === 2 ? dic.saleAreaName : dic.dictionaryDataName}</Text>
        </View>
        </TouchableOpacity>
      })
    }
  }

  render() {
    const {type, showChooseModal} = this.props;
    let title = '';
    switch (type) {
      case 1:
        title = '证件类型';
        break;
      case 2:
        title = '运营区域';
        break;
      case 3:
        title = '社会类别';
        break;
      case 4:
        title = '区域类别';
        break;
      default:
    }

    return (
      <Modal style={styles.modal}
             visible={showChooseModal}
             transparent={true}
             maskClosable={true}
             onClose={this.closeChooseModal}
      >
        <View style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.viewTopBetween}/>
            <View style={styles.viewTopCenter}>
              <Text style={styles.textInTopView}>{title}</Text>
            </View>
            <View style={styles.viewTopBetween}>
              <TouchableOpacity onPress={this.closeChooseModal}>
                <Image
                  style={styles.ic_icon}
                  source={require('../images/del.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.viewTitle, {paddingLeft: 20}]}>
            <Text>请选择{title}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps={'always'}>
            <View style={styles.viewOne}>
              {this.renderDatas()}
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 250,
    width: 260
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textInTopView: {
    fontSize: 20,
    alignSelf: 'center'
  },
  viewTop: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    width: 260,
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
    borderTopWidth: borderWhith
  },
  viewOneInner: {
    height: 50,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: borderWhith,
    borderBottomColor: borderColor,
    marginRight: 30,
    marginLeft: 30
  },
  textInViewOneInner: {
    fontSize: 20,
    color: 'grey'
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
  }
})

export default ModalChoose
