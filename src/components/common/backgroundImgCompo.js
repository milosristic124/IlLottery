'use strict';

import React, { Component, PropTypes } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View
} from 'react-native'; 

const BackgroundImgCompo = (props) => {

  return (<View>
   <ImageBackground  source={Constants.Images.user.bgImg}  style={styles.bgImageStyle}>
    {props.children}
    </ImageBackground>
    </View>
   
  )
}

BackgroundImgCompo.propTypes = {
  // info: PropTypes.string,
  // backgroundColor: PropTypes.string,
};

BackgroundImgCompo.defaultProps = {
  // info: 'Coming Soon',
  // backgroundColor: '#fff'
};

const styles = StyleSheet.create({
  bgImageStyle: {
    flex: 1,

  },
  
});

module.exports = BackgroundImgCompo;

