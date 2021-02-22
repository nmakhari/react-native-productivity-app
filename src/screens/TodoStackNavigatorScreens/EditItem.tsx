import React from 'react';
import { Text } from 'react-native';

export interface IEditItemProps {
  readonly groupTodoId?: number;
  readonly readingTodoId?: number;
  readonly todoodoId?: number;
}

export class EditItem extends React.Component<IEditItemProps> {
  render() {
    return <Text>EDITITEM Screen</Text>;
  }
}
