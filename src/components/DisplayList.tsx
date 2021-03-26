import React from 'react';
import {
  SectionList,
  StyleSheet,
  SectionListData,
  Text,
  View,
} from 'react-native';
import { Colors } from '../shared/Colors';
import { IGroup } from '../../db/Groups';
import { IReading } from '../../db/Readings';
import { ITodo } from '../../db/Todo';
import { SectionTitles } from '../shared/Utils';
import TodoCard from '../components/TodoCard';
import GroupCard from '../components/GroupCard';
import ReadingCard from '../components/ReadingCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type DisplayItem = IGroup | IReading | ITodo;

export interface IDisplayItemSection {
  title: string;
  data: DisplayItem[];
}

interface IProps {
  data: IDisplayItemSection[];
}

// contentContainerStyle on SectionList needs to be set to flexGrow 1 in order
// to center the resulting view on the screen
export default class DisplayList extends React.Component<IProps> {
  render() {
    return (
      <SectionList
        style={Styles.list}
        sections={this.props.data}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        ListEmptyComponent={
          <View style={Styles.listEmptyRoot}>
            <Text style={Styles.listEmptySubtitle}>Nothing here...</Text>
            <Text style={Styles.listEmptyTitle}>Time to get started! </Text>
            <MaterialCommunityIcons
              name="notebook"
              color={'white'}
              size={40}
              style={Styles.listEmptyIcon}
            />
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    );
  }

  // The default case is a reading, it was written as default in order to keep the
  // function type as JSX.Element instead of JSX.Element | undefined
  private renderItem = ({
    item,
    section,
  }: {
    item: DisplayItem;
    section: SectionListData<DisplayItem, IDisplayItemSection>;
  }) => {
    switch (section.title) {
      case SectionTitles.Groups.toString():
        return <GroupCard group={item as IGroup} />;
      case SectionTitles.Todos.toString():
        return <TodoCard todo={item as ITodo} />;
      default:
        return <ReadingCard reading={item as IReading} />;
    }
  };

  private renderSectionHeader = ({
    section,
  }: {
    section: IDisplayItemSection;
  }) => <Text style={Styles.sectionHeaderText}>{section.title}</Text>;
}

// Known issues with bold font on certain devices, changed font family
// to fix the problem
const Styles = StyleSheet.create({
  list: {
    backgroundColor: Colors.primaryGrey,
  },
  sectionHeaderText: {
    fontSize: 32,
    color: 'white',
    marginLeft: 20,
    fontWeight: 'bold',
  },
  listEmptySubtitle: {
    fontSize: 18,
    color: 'white',
  },
  listEmptyTitle: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'sans-serif-bold',
    fontWeight: 'bold',
  },
  listEmptyIcon: {
    marginTop: 30,
  },
  listEmptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
