import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

const SharedStyles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: Colors.primaryGreyDark,
    justifyContent: 'space-between',
  },
  listRoot: {
    flex: 1,
    backgroundColor: Colors.primaryGreyDark,
  },
  circularProgressChildText: {
    color: Colors.secondaryGreen,
    fontSize: 14,
  },
  formErrorText: {
    color: Colors.secondaryGreen,
    fontSize: 10,
  },
  navHeader: {
    backgroundColor: Colors.primaryGreyDark,
  },
});

export default SharedStyles;
