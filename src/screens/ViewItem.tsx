import React from 'react';
import { Text } from 'react-native';

export interface IViewItemProps {
  readonly canEdit: boolean;
  readonly groupId?: number;
  readonly groupTodoId?: number;
  readonly readingId?: number;
  readonly readingTodoId?: number;
  readonly todoId?: number;
}

export class ViewItem extends React.Component<IViewItemProps> {
  render() {
    return <Text>VIEW ITEM SCREEN</Text>;
  }
}
