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
import { ProgressState } from '../../shared/Utils';

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

const AddTodo: React.FunctionComponent<IProps> = ({ navigation, route }) => {
  const { todoListStore, progressState } = route.params;
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ name: '', description: '' }}
      onSubmit={(values) => {
        const newTodo = todoListStore.createTodo(
          values.name,
          values.description,
        );
        if (newTodo) {
          switch (progressState) {
            case ProgressState.Complete:
              todoListStore.toggleTodoDoneState(newTodo.id);
              break;
            case ProgressState.InProgress:
              todoListStore.toggleTodoProgressState(newTodo.id);
              break;
            default:
              break;
          }
        }
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
};

export default AddTodo;

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
