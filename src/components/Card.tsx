import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Colors } from '../shared/Colors';

interface IProps {
  title: string;
  description?: string;
  logo?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  titleStyle?: any;
  descriptionStyle?: any;
}

export default class Card extends React.Component<IProps> {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={Styles.root}
        onLongPress={this.props.onLongPress}>
        <View style={Styles.wrapper}>
          <View style={Styles.leftContent}>
            <Text
              style={
                this.props.titleStyle
                  ? [Styles.title, this.props.titleStyle]
                  : Styles.title
              }>
              {this.props.title}
            </Text>
            {this.props.description ? (
              <Text
                style={
                  this.props.descriptionStyle
                    ? [Styles.description, this.props.descriptionStyle]
                    : Styles.description
                }>
                {this.props.description}
              </Text>
            ) : null}
            {this.props.logo ? (
              <View style={Styles.logo}>{this.props.logo}</View>
            ) : null}
          </View>
          {this.props.rightContent}
        </View>
      </TouchableHighlight>
    );
  }
}

const Styles = StyleSheet.create({
  root: {
    minHeight: 100,
    padding: 15,
    backgroundColor: Colors.primaryGreyDark,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  leftContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  logo: {
    paddingTop: 15,
  },
  title: {
    fontSize: 25,
    color: Colors.secondaryGreen,
  },
  description: {
    fontSize: 15,
    color: 'white',
  },
});
