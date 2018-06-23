/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  WebView,
  Linking
} from 'react-native';
import Constants from '../constants';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from '../redux/modules/user';
//import { ReactTypeformEmbed } from './react-typeform-embed/src/index.js';


type Props = {};
class Typeform extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      isLoading: true
    }
    this.jsCode = `
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function(message, targetOrigin, transfer) { 
        originalPostMessage(message, targetOrigin, transfer);
      };
    
      patchedPostMessage.toString = function() { 
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };
    
      window.postMessage = patchedPostMessage;
    `;
    // console.log('props ******* next_lottery_time constructor ******** ',props)
  }

  onNavigationStateChange = eve => {
    if (eve.loading !== this.state.isLoading) {
      this.setState({
        isLoading: eve.loading
      });
    }
    console.log('event ******* ',eve)
    if (eve.url == 'http://www.illinoislottery.com/en-us/home.html') {
      console.log('Submitted-->', eve.url);
      this.props.navigation.navigate('Home');
    }
    //if (eve.url.indexOf("api/orders/") > -1) {
      // this.props.navigation.navigate("Home", {
      //   url: eve.url,
      //   //id: this.props.navigation.state.params.id
      // });
    //}
  }
  onMessage(event) {
    var msg = event.nativeEvent.data;
    console.log("zzz " + "onMessage(): Received Message from WebView : ", event.nativeEvent);
    
  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const titleConfig = {
      title: 'SURVEY',
      tintColor:Constants.Colors.White
    };
    const uri = 'https://threadest1.typeform.com/to/vjS2Nx';
    return (
      <View style={{flex:1}}>
        <NavigationBar
          title={titleConfig}
          style={{backgroundColor: 'rgb(32,73,157)'}}
          statusBar={{hidden:false,tintColor:'rgb(32,73,157)'}}
          leftButton={<TouchableOpacity style={{marginLeft:Constants.BaseStyle.DEVICE_WIDTH/100*2.5,marginTop:Constants.BaseStyle.DEVICE_HEIGHT/100*.8}} onPress={()=>goBack()}><Icon color={Constants.Colors.White} name='chevron-circle-left' size={30} /></TouchableOpacity>} />
        <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        onNavigationStateChange={this.onNavigationStateChange}
        onMessage={this.onMessage.bind(this)}
        injectedJavaScript={this.jsCode}
      />
      {/* <ReactTypeformEmbed url={uri}/> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Typeform);
