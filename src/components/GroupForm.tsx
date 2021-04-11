import React from 'react';
import { ITodoListStore } from '../../stores/TodoListStore';
import * as yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import SharedStyles from '../shared/SharedStyles';
import { Colors } from '../shared/Colors';
import BasicButton from './BasicButton';

interface IProps {
  todoListStore: ITodoListStore;
  onFormSubmit: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Group Name is Required'),
  description: yup.string(),
});

const GroupForm: React.FunctionComponent<IProps> = ({
  todoListStore,
  onFormSubmit,
}) => {
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ name: '', description: '' }}
      onSubmit={(values) => {
        todoListStore.createGroup(values.name, values.description);
        onFormSubmit();
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
              placeholder="Group Name"
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

export default GroupForm;

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
