import React from 'react';
import {Image, StyleSheet} from 'react-native';

const logoImage = require('../../assets/nari-logo.png');

export default function NariLogoIcon({size = 80, style}) {
  return (
    <Image
      source={logoImage}
      style={[styles.logo, {width: size, height: size}, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});