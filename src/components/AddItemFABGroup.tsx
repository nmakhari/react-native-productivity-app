import React from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';
import { Colors } from '../shared/Colors';

interface IProps {
  open: boolean;
  onPress: () => void;
  onClosePressed: () => void;
  onTodoPressed: () => void;
  onGroupPressed: () => void;
  onReadingPressed: () => void;
}

const AddItemFABGroup: React.FunctionComponent<IProps> = ({
  open,
  onPress,
  onClosePressed,
  onTodoPressed,
  onGroupPressed,
  onReadingPressed,
}) => {
  return (
    <Provider>
      <Portal>
        <FAB.Group
          fabStyle={{ backgroundColor: Colors.secondaryGreen }}
          open={open}
          visible={true}
          icon={open ? 'close' : 'plus'}
          color={'black'}
          actions={[
            {
              icon: 'book-open-page-variant',
              label: 'Reading',
              color: Colors.secondaryGreen,
              onPress: onReadingPressed,
              small: false,
            },
            {
              icon: 'lightbulb-group',
              label: 'Group',
              color: Colors.secondaryGreen,
              onPress: onGroupPressed,
              small: false,
            },
            {
              icon: 'format-list-checkbox',
              label: 'Todo',
              color: Colors.secondaryGreen,
              onPress: onTodoPressed,
              small: false,
            },
          ]}
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
