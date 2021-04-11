import React from 'react';
import { ITodoListStore } from '../../stores/TodoListStore';
import * as yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import SharedStyles from '../shared/SharedStyles';
import { Colors } from '../shared/Colors';
import BasicButton from './BasicButton';
import { IGroup, IGroupTodo } from '../../db/Groups';

export type ExistingGroup = {
  id: number;
  creationDate: Date;
  pointsCompleted: number;
  pointsTotal: number;
  items: Realm.List<IGroupTodo>;
  initialValues: GroupFormValues;
};

export type GroupFormValues = {
  name: string;
  description?: string;
};

interface IProps {
  todoListStore: ITodoListStore;
  onFormSubmit: () => void;
  existingGroup?: ExistingGroup;
}

const schema = yup.object().shape({
  name: yup.string().required('Group Name is Required'),
  description: yup.string(),
});

const GroupForm: React.FunctionComponent<IProps> = ({
  todoListStore,
  onFormSubmit,
  existingGroup,
}) => {
  return (
    <Formik
      validationSchema={schema}
      initialValues={
        existingGroup
          ? existingGroup.initialValues
          : { name: '', description: '' }
      }
      onSubmit={(values) => {
        if (existingGroup) {
          const updatedGroup: IGroup = {
            id: existingGroup.id,
            name: values.name,
            creationDate: existingGroup.creationDate,
            description: values.description,
            pointsCompleted: existingGroup.pointsCompleted,
            pointsTotal: existingGroup.pointsTotal,
            items: existingGroup.items,
          };
          todoListStore.updateGroup(updatedGroup);
          onFormSubmit();
          return;
        }
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
            title={existingGroup ? 'Update' : 'Create'}
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
