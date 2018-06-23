/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import Constants from '../constants';
import SubmitButton from '../components/common/FormSubmitButton';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../redux/modules/user';
import Regex from '../utilities/Regex';
import { ToastActionsCreators } from 'react-native-redux-toast';
import _ from 'lodash';
import TimerComponent from '../components/common/TimerComponent';
import RestClient from '../utilities/RestClient';

type Props = {};
class Home extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      email:'',
      password:'',
      fullName:''
    }
    // console.log('props ******* next_lottery_time constructor ******** ',props)
  }
  componentDidMount(){
    RestClient.get("events/next_lottery_time", null, "d8bbb56f-fac3-40f5-974b-d8628b02cf6e", null).then((result) => {
      //console.log('result ******* ',result)
       this.setState({nextLotteryTime:result.success})
     }).catch(error => {
       console.log("error=> " ,error)
     });
  }

  logout(){
    console.log('log out ******** ')
    AsyncStorage.multiRemove(['X-User-Authorization', 'email', 'password']);
    this.props.navigation.navigate('Welcome');
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const titleConfig = {
      title: 'Home',
      tintColor:Constants.Colors.White
    };
    // console.log('props ******* next_lottery_time render ******** ',this.props)
    return (
      <View style={{flex:1}}>
        <NavigationBar
          title={titleConfig}
          style={{backgroundColor: 'rgb(32,73,157)'}}
          statusBar={{hidden:false,tintColor:'rgb(32,73,157)'}} />
          <ImageBackground source={Constants.Images.user.bgImg}  style={styles.container}>
            <ScrollView>
              <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                <Text style={{fontSize:24,textAlign:'center',marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*10,color:Constants.Colors.White,fontWeight:'700', fontFamily: 'Museo'}}>WIN A FAST PASS FOR YOU AND A FRIEND</Text>
                <View style={styles.flexDirRowStyle}>
                  <Image source={Constants.Images.user.logo} style={styles.logoStyle} resizeMode={'contain'}/>
                  <Image source={Constants.Images.user.mamby} style={styles.logo2Style} resizeMode={'contain'}/>
                </View>
                <Text style={{textAlign:'center',fontWeight:'600',fontSize:16,color:Constants.Colors.White, fontFamily: 'Muli'}}>OUR NEXT DRAWING !</Text>
                <View style={{borderWidth:1, width:Constants.BaseStyle.DEVICE_WIDTH/100*70,alignSelf:'center',borderColor:'rgba(255,255,255,.6)'}} />

              <TimerComponent nextLotteryTime={new Date('2018-06-30T09:00:00')}/>
                
                <SubmitButton _Press={()=>this.logout()} text={'LOG OUT'} textStyle={styles.buttonText} buttonStyle={[styles.button]} />
                <Text style={{color:Constants.Colors.White, fontSize:12, textAlign:'center',marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*3}}>{Constants.i18n.common.toc_consent}</Text>
              </KeyboardAvoidingView>
            </ScrollView>
          </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  flexDirRowStyle:{
    flexDirection: "row",
    justifyContent:'center',
    alignItems: 'center'
  },
  logoStyle:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*25,
    height: Constants.BaseStyle.DEVICE_HEIGHT/100*25,
    // alignSelf: 'center'
  },
  logo2Style:{
    width: Constants.BaseStyle.DEVICE_WIDTH/100*20,
    height: Constants.BaseStyle.DEVICE_HEIGHT/100*20,
    marginLeft: Constants.BaseStyle.DEVICE_WIDTH/100*5,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100*3,
    // alignSelf: 'center'
  },
  buttonText:{
    //fontFamily:'Belizio Black'
  },
  button:{
    // borderWidth:2,
    // borderColor:Constants.Colors.White,
    height:Constants.BaseStyle.DEVICE_HEIGHT/100 *5,
    borderRadius:0,
    backgroundColor:'transparent',
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100 *2,
    width:Constants.BaseStyle.DEVICE_WIDTH/100 * 30,
    alignSelf:'center',
    backgroundColor:'rgb(52,151,66)'
  }
});

const mapStateToProps = state => ({
  next_lottery_time : state.next_lottery_time
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Home);
