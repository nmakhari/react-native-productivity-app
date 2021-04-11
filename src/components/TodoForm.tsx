import React from 'react';
import { ITodoListStore } from '../../stores/TodoListStore';
import * as yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import SharedStyles from '../shared/SharedStyles';
import { Colors } from '../shared/Colors';
import BasicButton from './BasicButton';
import { ProgressState } from '../shared/Utils';
import { RadioButton } from 'react-native-paper';
import { ITodo } from '../../db/Todo';

export type ExistingTodo = {
  id: number;
  initialValues: TodoFormValues;
};

export type TodoFormValues = {
  name: string;
  description?: string;
};

interface IProps {
  todoListStore: ITodoListStore;
  progressState: ProgressState;
  onFormSubmit: () => void;
  existingTodo?: ExistingTodo;
}

const schema = yup.object().shape({
  name: yup.string().required('Task Name is Required'),
  description: yup.string(),
});

const TodoForm: React.FunctionComponent<IProps> = ({
  todoListStore,
  progressState,
  onFormSubmit,
  existingTodo,
}) => {
  const [progress, setProgress] = React.useState(progressState);

  return (
    <Formik
      validationSchema={schema}
      initialValues={
        existingTodo
          ? existingTodo.initialValues
          : { name: '', description: '' }
      }
      onSubmit={(values) => {
        if (existingTodo) {
          let updatedTodo: ITodo = {
            id: existingTodo.id,
            name: values.name,
            description: values.description,
            done: false,
            in_progress: false,
          };
          switch (progress) {
            case ProgressState.Complete:
              updatedTodo.done = true;
              break;
            case ProgressState.InProgress:
              updatedTodo.in_progress = true;
              break;
          }
          todoListStore.updateTodo(updatedTodo);
          onFormSubmit();
          return;
        }
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
              placeholder="Task"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.titleText}
            />
            {errors.name && (
              <Text style={SharedStyles.formErrorText}>{errors.name}</Text>
            )}
          </>
          {existingTodo && (
            <>
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
            </>
          )}
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
            title={existingTodo ? 'Update' : 'Create'}
            onPress={handleSubmit}
            disabled={!isValid}
            style={Styles.button}
          />
        </View>
      )}
    </Formik>
  );
};

export default TodoForm;

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
  radioLabel: {
    color: Colors.secondaryGreenLight,
    fontSize: 20,
  },
});
