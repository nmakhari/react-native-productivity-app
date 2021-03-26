import React from 'react';
import { SectionList, StyleSheet, SectionListData, Text } from 'react-native';
import { Colors } from '../shared/Colors';
import { IGroup } from '../../db/Groups';
import { IReading } from '../../db/Readings';
import { ITodo } from '../../db/Todo';
import { SectionTitles } from '../shared/FormatSections';
import TodoCard from '../components/TodoCard';
import GroupCard from '../components/GroupCard';
import ReadingCard from '../components/ReadingCard';

export type DisplayItem = IGroup | IReading | ITodo;

export interface IDisplayItemSection {
  title: string;
  data: DisplayItem[];
}

export interface IDisplayListProps {
  data: IDisplayItemSection[];
}

export default class DisplayList extends React.Component<IDisplayListProps> {
  render() {
    return (
      <SectionList
        style={Styles.list}
        sections={this.props.data}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
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
});
