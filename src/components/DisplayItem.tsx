import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../shared/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { computed } from 'mobx';
import { IProgressData } from './DisplayList';
import SharedStyles from '../shared/SharedStyles';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// lowerContent precedence = parentName, progressValue, null
interface IProps {
  name: string;
  onClosePress: () => void;
  upperContent?: JSX.Element;
  parentName?: string;
  progressValue?: IProgressData;
}

export default class DisplayItem extends React.Component<IProps> {
  render() {
    return (
      <View style={Styles.root}>
        <View style={Styles.popup}>
          <MaterialCommunityIcons
            name="close"
            color={Colors.secondaryGreen}
            size={30}
            style={Styles.icon}
            onPress={this.props.onClosePress}
          />
          <Text style={Styles.nameText}>{this.props.name}</Text>

          {this.props.upperContent}
          {this.bottomContent}
        </View>
      </View>
    );
  }

  @computed
  private get bottomContent(): JSX.Element | undefined {
    if (this.props.parentName) {
      return <Text style={Styles.parentNameText}>{this.props.parentName}</Text>;
    }

    if (this.props.progressValue) {
      const { completed, total } = this.props.progressValue;
      const amountCompleted = (completed / total) * 100;
      return (
        <AnimatedCircularProgress
          size={60}
          width={7}
          fill={amountCompleted}
          tintColor={Colors.secondaryGreen}
          rotation={0}
          children={(fill) => {
            return (
              <Text style={SharedStyles.circularProgressChildText}>
                {completed}/{total}
              </Text>
            );
          }}
        />
      );
    }
  }
}

const Styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    borderRadius: 10,
    backgroundColor: Colors.primaryGreyDark,
    height: 500,
    width: 350,
    padding: 20,
    alignItems: 'center',
  },
  nameText: {
    marginTop: 8,
    color: Colors.secondaryGreen,
    fontSize: 24,
  },
  icon: {
    alignSelf: 'flex-end',
  },
  parentNameText: {
    fontSize: 20,
    color: Colors.secondaryGreen,
  },
});
