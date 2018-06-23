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
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  AsyncStorage,
  Linking,
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
class Signup extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      email:'',
      password:'',
      fullName:'',
      device_token: '',
      device_type: '',
      user_auth: '',
    }
    // console.log('props ******* next_lottery_time constructor ******** ',props)
  }

  componentDidMount(){
    AsyncStorage.multiGet(["X-User-Authorization", 'email', 'password']).then((data) => {
      if(data[0][1]) {
        console.log('X-user--->', data);
        this.setState({
          user_auth: data[0][1],
          email: data[1][1],
          password: data[2][1],
        })
        this.props.userActions.login({...this.state});
        //this.props.navigation.navigate('Signup', {...this.state});
      }
    }).done();
       RestClient.get("events/next_lottery_time", null, "d8bbb56f-fac3-40f5-974b-d8628b02cf6e", null).then((result) => {
         //console.log('result ******* ',result)
          this.setState({nextLotteryTime:result.success})
        }).catch(error => {
          console.log("error=> " ,error)
        });
        console.log('Params-->', this.props.navigation.state.params);
        this.setState({
          device_token: this.props.navigation.state.params.device_token,
          device_type: this.props.navigation.state.params.device_type,
        })
  }

  signup(){
    let { dispatch } = this.props.navigation;
    let { email, password, fullName } = this.state;
    console.log('sign up api ******** ',email,password)
    // if(_.isEmpty(fullName.trim())) {
    //   dispatch(ToastActionsCreators.displayInfo('Please enter your name'));
    //   return;
    // }
    if(_.isEmpty(email.trim())) {
      dispatch(ToastActionsCreators.displayInfo('Please enter your email'));
      return;
    }
    if(!Regex.validateEmail(email.trim())) {
      dispatch(ToastActionsCreators.displayInfo('Please enter a valid email address'));
      return;
    }
    if(_.isEmpty(password)) {
      dispatch(ToastActionsCreators.displayInfo(enterPassword));
      return;
    }
    let requestObject = {
      email: this.state.email,
      password: this.state.password,
      device_type: this.state.device_type,
      device_token: this.state.device_token,
      tac_consent: true,
    }
    RestClient.post("users/register",requestObject).then((result) => {
      console.log('result ******* ',result)
      if(result.hasOwnProperty('success')) {
        AsyncStorage.multiSet([
          ["X-User-Authorization", result.success.user_id],
          ["email", requestObject.email],
          ["password", requestObject.password],
        ]);
        this.props.navigation.navigate('Typeform');        
      }
      if(result.hasOwnProperty('error')) {
        if(result.error.indexOf('already registered') !== -1 ) {
          dispatch(ToastActionsCreators.displayInfo('The email is already registered'));
        }
        if(result.error.indexOf('stronger') !== -1 ) {
          dispatch(ToastActionsCreators.displayInfo('Password is not strong enough'));          
        }
      }
    }).catch(error => {
      console.log("error=> " ,error)
    });
    //this.props.userActions.signup({...this.state});

  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const titleConfig = {
      title: 'SIGN UP',
      tintColor:Constants.Colors.White
    };
    // console.log('props ******* next_lottery_time render ******** ',this.props)
    return (
      <View style={{flex:1}}>
        <NavigationBar
          title={titleConfig}
          style={{backgroundColor: 'rgb(32,73,157)'}}
          statusBar={{hidden:false,tintColor:'rgb(32,73,157)'}}
          leftButton={<TouchableOpacity style={{marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2.5,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*.8}} onPress={()=>goBack()}><Icon color={Constants.Colors.White} name='chevron-circle-left' size={30} /></TouchableOpacity>} />
          <ImageBackground source={Constants.Images.user.bgImg}  style={styles.container}>
            <ScrollView>
              <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                <Text style={{fontSize:24,textAlign:'center',marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*10,color:Constants.Colors.White,fontWeight:'700', fontFamily: 'Museo'}}>WIN A FAST PASS FOR YOU AND A FRIEND</Text>
                <View style={styles.flexDirRowStyle}>
                  <Image source={Constants.Images.user.logo} style={styles.logoStyle} resizeMode={'contain'}/>
                  <Image source={Constants.Images.user.mamby} style={styles.logo2Style} resizeMode={'contain'}/>
                </View>
                <Text style={{textAlign:'center',fontWeight:'600', fontFamily:'Muli', fontSize:16,color:Constants.Colors.White}}>OUR NEXT DRAWING !</Text>
                <View style={{borderWidth:1, width:Constants.BaseStyle.DEVICE_WIDTH/100*70,alignSelf:'center',borderColor:'rgba(255,255,255,.6)'}} />

                <TimerComponent nextLotteryTime={new Date('2018-06-30T09:00:00')}/>
                
                {/*<View style={styles.textInputContainer}>
                  <View style={styles.icon}>
                    <Icon color={Constants.Colors.White} name={'user'} size={20} />
                  </View>
                  <TextInput
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholder={'FULL NAME'}
                    placeholderTextColor={Constants.Colors.White}
                    onChangeText={(fullName)=>this.setState({fullName})}
                    style={styles.textInput} />
                </View>*/}
                <View style={styles.textInputContainer}>
                  <View style={styles.icon}>
                    <Icon color={Constants.Colors.White} name={'envelope'} size={20} />
                  </View>
                  <TextInput
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={'EMAIL'}
                    placeholderTextColor={Constants.Colors.White}
                    onChangeText={(email)=>this.setState({email})}
                    keyboardType={'email-address'}
                    style={styles.textInput} />
                </View>
                <View style={styles.textInputContainer}>
                  <View style={styles.icon}>
                    <Icon color={Constants.Colors.White} name={'lock'} size={20} />
                  </View>
                  <TextInput
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={'PASSWORD'}
                    placeholderTextColor={Constants.Colors.White}
                    onChangeText={(password)=>this.setState({password})}
                    secureTextEntry={true}
                    style={styles.textInput} />
                </View>
                {/*<SubmitButton _Press={()=>navigate('Login')} text={'LOG IN'} textStyle={styles.buttonText} buttonStyle={styles.button} />*/}
                <SubmitButton _Press={()=>this.signup()} text={'SIGN UP'} textStyle={styles.buttonText} buttonStyle={[styles.button]} />
                <Text onPress={()=>navigate('Login')} style={{color:Constants.Colors.White, textAlign:'center',marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3 }}> By tapping Signup, you agree to the Illinois Lottery's</Text>
                <Text onPress={()=>Linking.openURL('https://il-lottery-events.herokuapp.com/')} style={{color:'rgb(215,181,93)', textAlign:'center',marginTop:10 }}> Terms and Conditons</Text>
                <Text style={{color:'rgb(116,135,180)', fontSize:12, textAlign:'center',marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*3}}>Already have an account?<Text onPress={()=>navigate('Login')} style={{color:'rgb(215,181,93)'}}> Log In</Text></Text>
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
  textInputContainer:{
    flexDirection:'row',
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT/100*1.5,
    // height: Constants.BaseStyle.DEVICE_HEIGHT/100*7.5,
    // width: Constants.BaseStyle.DEVICE_WIDTH/100*80,
    //borderWidth:1
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100 * 5,
  },
  textInput: {
    //fontSize: 20,
    textAlign:'center',
    marginLeft: Constants.BaseStyle.DEVICE_HEIGHT/100*1.2,
    height: Constants.BaseStyle.DEVICE_HEIGHT/100*7,
    flex:.85,
    borderWidth:1,
    borderColor:Constants.Colors.White,
    color:Constants.Colors.White
  },
  icon:{
    flex:.15,
    borderWidth:1,
    alignItems:'center',
    borderColor:Constants.Colors.White,
    justifyContent:'center',
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

export default connect(null, mapDispatchToProps)(Signup);
