import React from "react";
import { Text, TouchableOpacity } from 'react-native';

const CircleButton = props => (
    <TouchableOpacity
      style={{
        margin: props.margin,
        height: props.size,
        width: props.size,
        backgroundColor: props.color,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: props.size * 2,
      }}
      onPress={props.onPress}>
      <Text style={{color: props.textColor, fontSize: props.fontSize}}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );

const HelpButton = props => (
    <CircleButton
          text="?"
          size={30}
          color="#2196f3"
          textColor="white"
          fontSize={20}
          margin={10}
          onPress={props.onPress}
        />
  );

export default HelpButton;