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

type AddTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'AddTodo'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddTodoScreenRouteProp = RouteProp<TodoStackNavigatorParamList, 'AddTodo'>;

interface IProps {
  navigation: AddTodoScreenNavigationProp;
  route: AddTodoScreenRouteProp;
}

const schema = yup.object().shape({
  name: yup.string().required('Task Name is Required'),
  description: yup.string(),
});

export class AddTodo extends React.Component<IProps> {
  render() {
    const todoListStore = this.props.route.params.todoListStore;
    return (
      <Formik
        validationSchema={schema}
        initialValues={{ name: '', description: '' }}
        onSubmit={(values) => {
          todoListStore.createTodo(values.name);
          this.props.navigation.pop();
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
            <>
              <TextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Task"
                placeholderTextColor={Colors.textInputPlaceholder}
                style={Styles.titleText}
              />
              {errors.name && (
                <Text style={SharedStyles.formErrorText}>{errors.name}</Text>
              )}
            </>
            <>
              <TextInput
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Description"
                placeholderTextColor={Colors.textInputPlaceholder}
                textAlignVertical={'top'}
                style={Styles.descriptionText}
                multiline={true}
              />
              {errors.description && (
                <Text style={SharedStyles.formErrorText}>
                  {errors.description}
                </Text>
              )}
            </>

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
  }
}

const Styles = StyleSheet.create({
  titleText: {
    color: 'white',
    fontSize: 20,
    marginTop: 8,
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    flex: 1,
  },
  button: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
});
