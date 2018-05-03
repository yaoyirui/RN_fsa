import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import payMethodMap from "../utils/payMethods";

function PayMethod({loginData, choosenPayMethodId, onPressToChoosePayMethod}) {
  if (loginData && loginData.jsonData && loginData.jsonData.payMethodIds) {
    const payMethodIdsArray = loginData.jsonData.payMethodIds.split(',');
    return payMethodIdsArray.map(
      (payMethodId, index) => {
        const payMethod = payMethodMap.get(payMethodId);
        if (payMethod) {
          return <TouchableOpacity key={index} onPress={() => {
            onPressToChoosePayMethod(payMethodId, payMethod)
          }}>{
            index === payMethodIdsArray.length - 1 ?
              <View style={[styles.viewPayMethodsInner, {borderBottomWidth: 0}]}>
                <View style={styles.viewPayMethodsInnerLeft}>
                  <Text style={styles.textInPayMethodsInnerLeft}>{payMethod}</Text>
                </View>
                {
                  choosenPayMethodId === payMethodId ?
                    <Image
                      style={styles.imageInViewPayMethodsInner}
                      source={require('../images/selected.png')}
                    /> : <View/>
                }
              </View> : <View style={styles.viewPayMethodsInner}>
                <View style={styles.viewPayMethodsInnerLeft}>
                  <Text style={styles.textInPayMethodsInnerLeft}>{payMethod}</Text>
                </View>
                {
                  choosenPayMethodId === payMethodId ?
                    <Image
                      style={styles.imageInViewPayMethodsInner}
                      source={require('../images/selected.png')}
                    /> : <View/>
                }
              </View>
          }
          </TouchableOpacity>
        }
      }
    )
  }
}

const borderWhith = 0.4;
const borderColor = '#C0C0C0';
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  viewPayMethods: {
    flex: 1,
    borderWidth: borderWhith,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: borderColor,
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
  }
});

export default PayMethod;
