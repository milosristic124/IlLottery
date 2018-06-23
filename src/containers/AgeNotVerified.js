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
  Picker,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';
import Constants from '../constants';
import SubmitButton from '../components/common/FormSubmitButton';
import { Dropdown } from 'react-native-material-dropdown';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {};
export default class Welcome extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      day:Constants.i18n.common.day,
      month:Constants.i18n.common.month,
      selectedMonth:'',
      selectedDay:'',
      selectedYear:'',
      year:[]
    }
  }

  componentWillMount(){
    const thisYear = (new Date()).getFullYear();
    const minOffset = 0;
    const maxOffset = 70;
    const options = [];
    
    for (let i = minOffset; i <= maxOffset; i++) {
      const year = thisYear - i;
      options.push({'label':year.toString(), 'value':year});
      
    }
    this.setState({
      year:options,
      selectedYearVal:thisYear
    })
  }

  render() {
    const titleConfig = {
      title: 'Welcome',
      tintColor:Constants.Colors.White
    };
    let uri = 'http://www.illinoislottery.com';
    let {navigate, goBack} = this.props.navigation;
    return (
      <ImageBackground  source={Constants.Images.user.bgImg}  style={styles.bgImageStyle}>
        <NavigationBar
          title={titleConfig}
          style={{backgroundColor: 'rgb(32,73,157)'}}
          statusBar={{hidden:false,tintColor:'rgb(32,73,157)'}}
          leftButton={<TouchableOpacity style={{marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2.5,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*.8}} onPress={()=>goBack()}><Icon color={Constants.Colors.White} name='chevron-circle-left' size={30} /></TouchableOpacity>} />
        <Text style={{fontSize:22,textAlign:'center',marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*10,color:Constants.Colors.White,fontWeight:'700', fontFamily: 'Museo'}}>Sorry! You must be 18 or over to participate</Text>
        <Image source={Constants.Images.user.logo} style={styles.logoStyle} resizeMode={'contain'}/>
        <Text style={{color:Constants.Colors.White, fontSize:12, textAlign:'center',marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100*3}}>Visit our website for more information</Text>
        <SubmitButton text={'GO TO WEBSITE'} textStyle={styles.buttonText} buttonStyle={styles.button} _Press={() => Linking.openURL(uri)}/>
        <Text style={{color:Constants.Colors.White, fontSize:12, textAlign:'center',marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*8}}>{Constants.i18n.common.toc_consent}</Text>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bgImageStyle: {
    flex: 1,
   // alignItems: 'center',
  },
  text:{
    textAlign:'center',
    marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100 * 1.5,
    color: 'white'
  },
  dropDownContainer:{
    flex:1,
    marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH * .02,
    padding:0,
    height:Constants.BaseStyle.DEVICE_HEIGHT *.05,
    borderWidth:1,
    borderColor:'rgba(255,255,255,.6)'
  },
  dropDown:{ 
    backgroundColor: 'transparent', 
    paddingLeft: Constants.BaseStyle.PADDING*0.02,
    color:Constants.Colors.White,
    marginLeft:10
  },
  buttonText:{
    fontFamily:'Muli'
  },
  logoStyle:{
    width: Constants.BaseStyle.DEVICE_HEIGHT/100*25,
    height: Constants.BaseStyle.DEVICE_WIDTH/100*25,
    alignSelf: 'center',
    marginVertical: Constants.BaseStyle.DEVICE_HEIGHT/100*2
  },
  button:{
    borderWidth:2,
    borderColor:Constants.Colors.White,
    borderRadius:0,
    backgroundColor:'transparent',
    //marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100 *5,
    width:Constants.BaseStyle.DEVICE_WIDTH/100 * 40,
    alignSelf:'center'
  }
});
