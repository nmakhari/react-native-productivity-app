import React from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';
import { Colors } from '../shared/Colors';

interface IProps {
  open: boolean;
  onPress: () => void;
  onClosePressed: () => void;
  onTodoPressed?: () => void;
  onGroupPressed?: () => void;
  onGroupTodoPressed?: () => void;
  onReadingPressed?: () => void;
  onReadingTodoPressed?: () => void;
}

const AddItemFABGroup: React.FunctionComponent<IProps> = ({
  open,
  onPress,
  onClosePressed,
  onTodoPressed,
  onGroupPressed,
  onGroupTodoPressed,
  onReadingPressed,
  onReadingTodoPressed,
}) => {
  const actions = [];
  if (onTodoPressed) {
    actions.push({
      icon: 'format-list-checkbox',
      label: 'Todo',
      color: Colors.secondaryGreen,
      onPress: onTodoPressed,
      small: false,
    });
  }

  if (onGroupPressed) {
    actions.push({
      icon: 'lightbulb-group',
      label: 'Group',
      color: Colors.secondaryGreen,
      onPress: onGroupPressed,
      small: false,
    });
  }

  if (onReadingPressed) {
    actions.push({
      icon: 'book-open-page-variant',
      label: 'Reading',
      color: Colors.secondaryGreen,
      onPress: onReadingPressed,
      small: false,
    });
  }

  if (onGroupTodoPressed) {
    actions.push({
      icon: 'format-list-checkbox',
      label: 'Todo',
      color: Colors.secondaryGreen,
      onPress: onGroupTodoPressed,
      small: false,
    });
  }

  if (onReadingTodoPressed) {
    actions.push({
      icon: 'book-open-page-variant',
      label: 'Todo',
      color: Colors.secondaryGreen,
      onPress: onReadingTodoPressed,
      small: false,
    });
  }

  return (
    <Provider>
      <Portal>
        <FAB.Group
          fabStyle={{ backgroundColor: Colors.secondaryGreen }}
          open={open}
          visible={true}
          icon={open ? 'close' : 'plus'}
          color={'black'}
          actions={actions}
          onPress={() => {
            if (open) {
              onClosePressed();
            } else {
              onPress();
            }
          }}
          onStateChange={({}) => {}}
        />
      </Portal>
    </Provider>
  );
};

export default AddItemFABGroup;
