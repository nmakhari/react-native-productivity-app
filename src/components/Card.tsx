import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../shared/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ProgressState } from '../shared/Utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  title: string;
  description?: string;
  logo?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  titleStyle?: any;
  descriptionStyle?: any;
  progressState?: ProgressState;
  onSwipableLeftOpen?: () => void;
  onEditPressed?: () => void;
  onDeletePressed?: () => void;
}

export default class Card extends React.Component<IProps> {
  private swipeableRef: Swipeable | null;
  render() {
    const windowWidth = Dimensions.get('window').width;
    return (
      <Swipeable
        ref={(ref) => (this.swipeableRef = ref)}
        leftThreshold={windowWidth * 0.75}
        renderLeftActions={
          this.props.onSwipableLeftOpen ? this.renderLeftContent : undefined
        }
        onSwipeableLeftOpen={this.props.onSwipableLeftOpen}
        renderRightActions={this.renderRightContent}
        rightThreshold={50}>
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
      </Swipeable>
    );
  }

  private renderRightContent = (): JSX.Element | null => {
    const { onEditPressed, onDeletePressed } = this.props;
    if (!onEditPressed || !onDeletePressed) {
      return null;
    }

    return (
      <View style={Styles.rightActionRoot}>
        <TouchableOpacity
          onPress={() => {
            this.swipeableRef?.close();
            onEditPressed();
          }}>
          <Text style={Styles.rightActionEditText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.swipeableRef?.close();
            onDeletePressed();
          }}>
          <Text style={Styles.rightActionDeleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  private renderLeftContent = (): JSX.Element | null => {
    const { progressState } = this.props;
    if (progressState === ProgressState.Complete) {
      return null;
    }

    return (
      <View style={Styles.leftActionRoot}>
        {this.progressIcon}
        <Text style={Styles.leftText}>{this.progressText}</Text>
      </View>
    );
  };

  private get progressText(): string | undefined {
    switch (this.props.progressState) {
      case ProgressState.Pending:
        return 'Start';
      case ProgressState.InProgress:
        return 'Done';
    }
  }

  private get progressIcon(): JSX.Element | null {
    switch (this.props.progressState) {
      case ProgressState.Pending:
        return (
          <MaterialCommunityIcons
            name="progress-check"
            color={Colors.secondaryGreen}
            size={40}
          />
        );
      case ProgressState.InProgress:
        return (
          <MaterialCommunityIcons
            name="check-circle-outline"
            color={Colors.secondaryGreen}
            size={40}
          />
        );
      default:
    }
    return null;
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
  rightActionRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightActionEditText: {
    fontSize: 18,
    color: 'white',
    marginRight: 25,
    marginLeft: 10,
  },
  rightActionDeleteText: {
    fontSize: 18,
    color: 'red',
    marginRight: 25,
  },
  leftActionRoot: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftText: {
    marginLeft: 30,
    fontSize: 26,
    color: Colors.secondaryGreen,
  },
});
