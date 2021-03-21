import React from 'react';
import { SectionList, StyleSheet, SectionListData, Text } from 'react-native';
import { Colors } from '../shared/Colors';
import { IGroup } from '../../db/Groups';
import { IReading } from '../../db/Readings';
import { ITodo } from '../../db/Todo';

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

  private renderItem = ({
    item,
    section,
  }: {
    item: DisplayItem;
    section: SectionListData<DisplayItem, IDisplayItemSection>;
  }) => <Text>ITEM</Text>;

  private renderSectionHeader = ({
    section,
  }: {
    section: IDisplayItemSection;
  }) => <Text>{section.title}</Text>;
}

const Styles = StyleSheet.create({
  rightContent: {
    color: Colors.secondaryGreen,
  },
  list: {
    backgroundColor: Colors.primaryGreyLight,
  },
});
