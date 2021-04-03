import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

const SharedStyles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: Colors.primaryGrey,
    justifyContent: 'space-between',
  },
  listRoot: {
    flex: 1,
    backgroundColor: Colors.primaryGrey,
  },
  circularProgressChildText: {
    color: Colors.secondaryGreen,
    fontSize: 14,
  },
  formErrorText: {
    color: Colors.secondaryGreen,
    fontSize: 10,
  },
});

export default SharedStyles;
