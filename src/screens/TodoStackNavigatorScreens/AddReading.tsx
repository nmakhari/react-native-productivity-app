import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';
import SharedStyles from '../../shared/SharedStyles';
import { Formik } from 'formik';
import { TextInput } from 'react-native-gesture-handler';
import BasicButton from '../../components/BasicButton';
import { Colors } from '../../shared/Colors';
import * as yup from 'yup';

type AddReadingScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'AddReading'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddReadingScreenRouteProp = RouteProp<
  TodoStackNavigatorParamList,
  'AddReading'
>;

interface IProps {
  navigation: AddReadingScreenNavigationProp;
  route: AddReadingScreenRouteProp;
}

const schema = yup.object().shape({
  name: yup.string().required('Reading Name is Required'),
  totalPages: yup
    .number()
    .integer('Page Count must be an integer')
    .moreThan(0, 'Enter a valid page count')
    .required('Reading page count is required'),
  pagesComplete: yup
    .number()
    .integer()
    .nullable()
    .min(0, 'Cannot complete less than 0 pages')
    .max(yup.ref('totalPages'), 'Cannot complete more than total pages'),
});

const AddReading: React.FunctionComponent<IProps> = ({ navigation, route }) => {
  const { todoListStore } = route.params;
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ name: '', totalPages: '', pagesComplete: '' }}
      onSubmit={(values) => {
        todoListStore.createReading(
          values.name,
          parseInt(values.totalPages, 10),
          values.pagesComplete ? parseInt(values.pagesComplete, 10) : 0,
        );
        navigation.pop();
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isValid,
      }) => (
        <View style={SharedStyles.screenRoot}>
          <View>
            <TextInput
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Reading Name"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.titleText}
            />
            {errors.name && (
              <Text style={SharedStyles.formErrorText}>{errors.name}</Text>
            )}

            <TextInput
              keyboardType="numeric"
              onChangeText={handleChange('totalPages')}
              onBlur={handleBlur('totalPages')}
              value={values.totalPages.toString()}
              placeholder="Page Count"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.secondaryText}
              multiline={false}
            />
            {errors.totalPages && (
              <Text style={SharedStyles.formErrorText}>
                {errors.totalPages}
              </Text>
            )}

            <TextInput
              keyboardType="numeric"
              onChangeText={handleChange('pagesComplete')}
              onBlur={handleBlur('pagesComplete')}
              value={values.pagesComplete.toString()}
              placeholder="Pages Complete"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.secondaryText}
              multiline={false}
            />
            {errors.pagesComplete && (
              <Text style={SharedStyles.formErrorText}>
                {errors.pagesComplete}
              </Text>
            )}
          </View>

          <BasicButton
            title={'Create'}
            onPress={handleSubmit}
            disabled={!isValid}
            style={Styles.button}
          />
        </View>
      )}
    </Formik>
  );
};

export default AddReading;

const Styles = StyleSheet.create({
  titleText: {
    color: 'white',
    fontSize: 20,
    marginTop: 8,
  },
  secondaryText: {
    color: 'white',
    fontSize: 16,
    marginTop: 25,
  },
  button: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  pageFieldTitle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
  },
});
