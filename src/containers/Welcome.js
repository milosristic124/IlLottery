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
  AsyncStorage,
} from 'react-native';
import Constants from '../constants';
import SubmitButton from '../components/common/FormSubmitButton';
import { Dropdown } from 'react-native-material-dropdown';
import moment from 'moment';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../redux/modules/user';
import { generateSecureRandom } from 'react-native-securerandom';
import RestClient from '../utilities/RestClient';

type Props = {};
class Welcome extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      day:Constants.i18n.common.day,
      month:Constants.i18n.common.month,
      selectedMonth:'',
      selectedDay:'',
      selectedYear:'',
      year:[],
      device_token: null,
      device_type: null,
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
      selectedYearVal:thisYear,
      device_type: Platform.OS,
    })

    //Get Device Token
    generateSecureRandom(12).then(randomBytes => 
      this.setState({device_token: randomBytes.join('')})
    );
    AsyncStorage.multiGet(["X-User-Authorization", 'email', 'password']).then((data) => {
      if(data[0][1]) {
        console.log('X-user--->', data);
        this.props.navigation.navigate('Signup', {...this.state});
      }
    }).done();
  }

  checkUserDob(){
    let { selectedMonth, selectedDay, selectedYear } = this.state;
    let eighteenYearsAgo = moment().subtract(18, "years");
    let birthday = moment(selectedMonth+'/'+selectedDay+'/'+selectedYear);
    let date_of_birth = selectedMonth + '/' + selectedDay + '/' + selectedYear;
    
    if (!birthday.isValid()) {
      alert("invalid date")    
    }
    else if (eighteenYearsAgo.isAfter(birthday)) {
      let requestObject = {
        device_token: this.state.device_token,
        device_type: this.state.device_type,
        date_of_birth: date_of_birth,
        //date_of_birth:
      }
      RestClient.post("events/verify_dob",requestObject).then((result) => {
        console.log('Verify_Dob response ******* ',result);
        if(result.hasOwnProperty('success')) {
          this.props.userActions.ageVerify();
          this.props.navigation.navigate('Signup', {...this.state});                        
        }
      }).catch(error => {
        console.log("error=> " ,error)
        dispatch(stopLoading());
      });
      console.log('Age verified-->', this.props.isAgeVerified);
      // if(this.props.isAgeVerified) {
      //}    
    }
    else {
      this.props.navigation.navigate('AgeNotVerified') 
    }
  }

  render() {
    console.log('State-->', this.state.device_token);
    return (
      <ImageBackground  source={Constants.Images.user.bgImg}  style={styles.bgImageStyle}>
      <View style={styles.container}>
      <Image source={Constants.Images.user.logo} style={styles.logoStyle} resizeMode={'contain'}/>
        <Text style={[styles.text,{bottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2}]}>DATE OF BIRTH</Text>
        <Text style={[styles.text,{bottom:Constants.BaseStyle.DEVICE_HEIGHT/100*4}]}>{this.state.selectedMonth}{(this.state.selectedMonth) && '/'}{this.state.selectedDay}{(this.state.selectedDay) && '/'}{this.state.selectedYear}</Text>
        <View style={{marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*10}}>
          <View style={{flexDirection:'row'}}>
            <Dropdown
              label='MM'
              baseColor={Constants.Colors.White}
              data={this.state.month}
              containerStyle={styles.dropDownContainer}
              style={styles.dropDown}
              rippleOpacity={0}
              dropdownOffset={{top: 0, left: 0}}
              onChangeText={(month)=>this.setState({selectedMonth:month})}
            />

            <Dropdown
              label='DD'
              baseColor={Constants.Colors.White}
              data={this.state.day}
              containerStyle={styles.dropDownContainer}
              style={styles.dropDown}
              rippleOpacity={0}
              dropdownOffset={{top: 0, left: 0}}
              onChangeText={(day)=>this.setState({selectedDay:day})}
            />
            
            <Dropdown
              label='YYYY'
              baseColor={Constants.Colors.White}
              data={this.state.year}
              containerStyle={styles.dropDownContainer}
              style={styles.dropDown}
              rippleOpacity={0}
              dropdownOffset={{top: 0, left: 0}}
              onChangeText={(year)=>this.setState({selectedYear:year})}
            />
          </View>
        </View>
        <SubmitButton text={'ENTER'} textStyle={styles.buttonText} buttonStyle={styles.button} _Press={()=>this.checkUserDob()}/>
      </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bgImageStyle: {
    flex: 1,
  },
  text:{
    textAlign:'center',
    marginVertical:Constants.BaseStyle.DEVICE_HEIGHT/100 * 1.5,
    color: 'white',
    fontFamily: 'Muli'
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
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100 *5,
    width:Constants.BaseStyle.DEVICE_WIDTH/100 * 30,
    alignSelf:'center'
  }
});

const mapStateToProps = state => ({
  isAgeVerified : state.auth.isAgeVerified,
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);