import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../shared/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { computed, makeObservable } from 'mobx';
import { IProgressData } from './DisplayList';
import SharedStyles from '../shared/SharedStyles';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// lowerContent precedence = parentName, progressValue, null
interface IProps {
  name: string;
  onClosePress: () => void;
  description?: string;
  progressString?: string;
  parentName?: string;
  progressValue?: IProgressData;
}

export default class DisplayItem extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    makeObservable(this);
  }

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

          {this.upperContent}
          {this.bottomContent}
        </View>
      </View>
    );
  }

  @computed
  private get upperContent(): JSX.Element | undefined {
    if (this.props.description) {
      return (
        <Text style={Styles.descriptionText}>{this.props.description}</Text>
      );
    }

    if (this.props.progressString) {
      return (
        <Text style={Styles.progressText}>{this.props.progressString}</Text>
      );
    }
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
          style={Styles.circularProgress}
          size={100}
          width={10}
          fill={amountCompleted}
          tintColor={Colors.secondaryGreen}
          rotation={0}
          backgroundWidth={15}
          backgroundColor={Colors.primaryGrey}
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
    minWidth: 300,
    maxWidth: 350,
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    marginTop: 8,
    color: Colors.secondaryGreen,
    fontSize: 30,
    fontFamily: 'sans-serif-bold',
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  descriptionText: {
    marginTop: 35,
    color: 'white',
    fontSize: 20,
  },
  progressText: {
    marginTop: 35,
    color: Colors.secondaryGreen,
    fontSize: 16,
  },
  parentNameText: {
    marginTop: 50,
    fontSize: 25,
    color: Colors.secondaryGreen,
  },
  circularProgress: {
    marginTop: 50,
  },
});
