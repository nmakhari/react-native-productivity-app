import React from 'react';
import { Text } from 'react-native';

interface IProps {
  readonly groupTodoId?: number;
  readonly readingTodoId?: number;
  readonly todoodoId?: number;
}

export class EditItem extends React.Component<IProps> {
  render() {
    return <Text>EDITITEM Screen</Text>;
  }
}
