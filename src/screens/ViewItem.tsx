import React from 'react';
import { Text } from 'react-native';

interface IProps {
  readonly canEdit: boolean;
  readonly groupId?: number;
  readonly groupTodoId?: number;
  readonly readingId?: number;
  readonly readingTodoId?: number;
  readonly todoId?: number;
}

export class ViewItem extends React.Component<IProps> {
  render() {
    return <Text>VIEW ITEM SCREEN</Text>;
  }
}
