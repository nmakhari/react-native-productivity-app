import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

const SharedStyles = StyleSheet.create({
  listRoot: {
    flex: 1,
    paddingBottom: 15,
    backgroundColor: Colors.primaryGrey,
  },
  circularProgressChildText: {
    color: Colors.secondaryGreen,
    fontSize: 14,
  },
});

export default SharedStyles;
