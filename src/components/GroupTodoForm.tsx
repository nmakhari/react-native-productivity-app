import { ITodoListStore } from '../../stores/TodoListStore';
import { ProgressState } from '../shared/Utils';
import * as yup from 'yup';
import { Formik } from 'formik';
import React from 'react';
import { IGroup, IGroupTodo } from '../../db/Groups';
import SharedStyles from '../shared/SharedStyles';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../shared/Colors';
import { RadioButton } from 'react-native-paper';
import BasicButton from './BasicButton';

export type ExistingGroupTodo = {
  id: number;
  group: IGroup;
  initialValues: GroupTodoFormValues;
};

export type GroupTodoFormValues = {
  name: string;
  points: string;
};

interface IProps {
  todoListStore: ITodoListStore;
  parentGroupId: number;
  progressState: ProgressState;
  onFormSubmit: () => void;
  existingGroupTodo?: ExistingGroupTodo;
}

const schema = yup.object().shape({
  name: yup.string().required('Task Name is Required'),
  points: yup
    .number()
    .integer('Point Value must be an Integer')
    .moreThan(-1, 'Enter a valid Point Value')
    .max(50, 'Task Point Value should be >= 50')
    .required('Task Point Value is Required'),
});

const GroupTodoForm: React.FunctionComponent<IProps> = ({
  todoListStore,
  parentGroupId,
  progressState,
  onFormSubmit,
  existingGroupTodo,
}) => {
  const [progress, setProgress] = React.useState(progressState);

  return (
    <Formik
      validationSchema={schema}
      initialValues={
        existingGroupTodo?.initialValues ?? { name: '', points: '' }
      }
      onSubmit={(values) => {
        const pointValue = values.points ? parseInt(values.points, 10) : 0;

        if (existingGroupTodo) {
          const updatedGroupTodo: IGroupTodo = {
            id: existingGroupTodo.id,
            name: values.name,
            group: existingGroupTodo.group,
            points: pointValue,
            done: false,
            in_progress: false,
          };
          switch (progress) {
            case ProgressState.Complete:
              updatedGroupTodo.done = true;
              break;
            case ProgressState.InProgress:
              updatedGroupTodo.in_progress = true;
              break;
          }
          todoListStore.updateGroupTodo(updatedGroupTodo);
          onFormSubmit();
          return;
        }
        const parentGroup = todoListStore.getGroup(parentGroupId);
        if (parentGroup) {
          const newGroupTodo = todoListStore.createGroupTodo(
            values.name,
            pointValue,
            parentGroup,
          );
          if (newGroupTodo) {
            switch (progressState) {
              case ProgressState.Complete:
                todoListStore.toggleGroupTodoDoneState(newGroupTodo.id);
                break;
              case ProgressState.InProgress:
                todoListStore.toggleGroupTodoProgressState(newGroupTodo.id);
                break;
            }
          }
        }
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
          <View>
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

            <TextInput
              keyboardType="numeric"
              onChangeText={handleChange('points')}
              onBlur={handleBlur('points')}
              value={values.points.toString()}
              placeholder="Point Value"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.secondaryText}
              multiline={false}
            />
            {errors.points && (
              <Text style={SharedStyles.formErrorText}>{errors.points}</Text>
            )}
          </View>

          {existingGroupTodo && (
            <RadioButton.Group
              onValueChange={(value) => {
                switch (value) {
                  case ProgressState.Pending.toString():
                    setProgress(ProgressState.Pending);
                    return;
                  case ProgressState.InProgress.toString():
                    setProgress(ProgressState.InProgress);
                    return;
                  default:
                }
                setProgress(ProgressState.Complete);
              }}
              value={progress.toString()}>
              <RadioButton.Item
                label="Todo"
                labelStyle={Styles.radioLabel}
                value={ProgressState.Pending.toString()}
                color={Colors.secondaryGreen}
                uncheckedColor={Colors.primaryGreyLight}
              />
              <RadioButton.Item
                label="In Progress"
                labelStyle={Styles.radioLabel}
                value={ProgressState.InProgress.toString()}
                color={Colors.secondaryGreen}
                uncheckedColor={Colors.primaryGreyLight}
              />
              <RadioButton.Item
                label="Complete"
                labelStyle={Styles.radioLabel}
                value={ProgressState.Complete.toString()}
                color={Colors.secondaryGreen}
                uncheckedColor={Colors.primaryGreyLight}
              />
            </RadioButton.Group>
          )}

          <BasicButton
            title={existingGroupTodo ? 'Update' : 'Create'}
            onPress={handleSubmit}
            disabled={!isValid}
            style={Styles.button}
          />
        </View>
      )}
    </Formik>
  );
};

export default GroupTodoForm;

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
  radioLabel: {
    color: Colors.secondaryGreenLight,
    fontSize: 20,
  },
});
