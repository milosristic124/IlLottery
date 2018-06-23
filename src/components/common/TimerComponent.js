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
  Image
} from 'react-native';
import Constants from '../../constants';
import RestClient from '../../utilities/RestClient';

type Props = {};
export default class TimerComponent extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      nextLotteryTime:new Date(),
      getLotteryDay : new Date(this.props.nextLotteryTime) - new Date().getDate(),
      getLotteryHour : 0,
      getLotteryMinutes : 0,
      getLotterySeconds : 0
    }
  }

  componentWillMount(){
    
  }

  componentDidMount(){
    // console.log('props ******* next_lottery_time did mount ******** ',this.props)
    setInterval( () => {
      this.setState({
        getLotteryDay: Math.floor((this.props.nextLotteryTime.getTime()- new Date().getTime()) / (1000 * 60 * 60 * 24)),
        getLotteryHour: Math.floor(((this.props.nextLotteryTime.getTime()- new Date().getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        getLotteryMinutes: Math.floor(((this.props.nextLotteryTime.getTime()- new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60)),
        getLotterySeconds: Math.floor(((this.props.nextLotteryTime.getTime()- new Date().getTime()) % (1000 * 60)) / 1000),
      })
    },1000)
  }

  render() {
    return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}>
          <View style={{marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*5,height:Constants.BaseStyle.DEVICE_HEIGHT/100*8,width:Constants.BaseStyle.DEVICE_WIDTH/100*14,borderWidth:2,borderColor:Constants.Colors.White,transform:[{rotate: '45deg'}],alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontWeight:'700',fontSize:22,color:Constants.Colors.White,transform:[{rotate:'-45deg'}]}}>{this.state.getLotteryDay}</Text>
          </View>
          <Text style={{marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,textAlign:'center',fontWeight:'600',fontSize:16,color:Constants.Colors.White}}>DAYS</Text>
        </View>
        <View style={{flex:1}}>
          <View style={{marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*5,height:Constants.BaseStyle.DEVICE_HEIGHT/100*8,width:Constants.BaseStyle.DEVICE_WIDTH/100*14,borderWidth:2,borderColor:Constants.Colors.White,transform:[{rotate: '45deg'}],alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontWeight:'700',fontSize:22,color:Constants.Colors.White,transform:[{rotate:'-45deg'}]}}>{this.state.getLotteryHour}</Text>
          </View>
          <Text style={{marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,textAlign:'center',fontWeight:'600',fontSize:16,color:Constants.Colors.White}}>HR</Text>
        </View>
        <View style={{flex:1}}>
          <View style={{marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*5,height:Constants.BaseStyle.DEVICE_HEIGHT/100*8,width:Constants.BaseStyle.DEVICE_WIDTH/100*14,borderWidth:2,borderColor:Constants.Colors.White,transform:[{rotate: '45deg'}],alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontWeight:'700',fontSize:22,color:Constants.Colors.White,transform:[{rotate:'-45deg'}]}}>{this.state.getLotteryMinutes}</Text>
          </View>
          <Text style={{marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,textAlign:'center',fontWeight:'600',fontSize:16,color:Constants.Colors.White}}>MIN</Text>
        </View>
        <View style={{flex:1}}>
          <View style={{marginHorizontal:Constants.BaseStyle.DEVICE_WIDTH/100*4,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*5,height:Constants.BaseStyle.DEVICE_HEIGHT/100*8,width:Constants.BaseStyle.DEVICE_WIDTH/100*14,borderWidth:2,borderColor:Constants.Colors.White,transform:[{rotate: '45deg'}],alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontWeight:'700',fontSize:22,color:Constants.Colors.White,transform:[{rotate:'-45deg'}]}}>{this.state.getLotterySeconds}</Text>
          </View>
          <Text style={{marginBottom:Constants.BaseStyle.DEVICE_HEIGHT/100*2,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*2,textAlign:'center',fontWeight:'600',fontSize:16,color:Constants.Colors.White}}>SEC</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
