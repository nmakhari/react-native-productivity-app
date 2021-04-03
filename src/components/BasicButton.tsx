import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '../shared/Colors';

interface IProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BasicButton: React.FunctionComponent<IProps> = ({
  title,
  onPress,
  disabled,
  style,
}) => {
  return (
    <TouchableHighlight onPress={onPress} style={style} disabled={disabled}>
      <View style={disabled ? [Styles.root, { opacity: 0.5 }] : Styles.root}>
        <Text style={Styles.title}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default BasicButton;

const Styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.secondaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  title: {
    color: Colors.primaryGreyDark,
    fontSize: 25,
  },
});
