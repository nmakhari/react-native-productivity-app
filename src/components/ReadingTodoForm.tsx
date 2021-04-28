import { ITodoListStore } from '../../stores/TodoListStore';
import { ProgressState } from '../shared/Utils';
import * as yup from 'yup';
import { Formik } from 'formik';
import React from 'react';
import SharedStyles from '../shared/SharedStyles';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../shared/Colors';
import { RadioButton } from 'react-native-paper';
import BasicButton from './BasicButton';
import { IReading, IReadingTodo } from '../../db/Readings';

export type ExistingReadingTodo = {
  id: number;
  reading: IReading;
  initialValues: GroupTodoFormValues;
};

export type GroupTodoFormValues = {
  name: string;
  pageStart: string;
  pageEnd: string;
};

interface IProps {
  todoListStore: ITodoListStore;
  parentReadingId: number;
  progressState: ProgressState;
  onFormSubmit: () => void;
  existingReadingTodo?: ExistingReadingTodo;
}

const schema = yup.object().shape({
  name: yup.string().required('Task Name is Required'),
  pageStart: yup
    .number()
    .integer('Start Page must be an Integer')
    .moreThan(-1, 'Enter a valid start page')
    .max(150, 'Task Point Value should be <= 150')
    .required('Start Page is Required'),
  pageEnd: yup
    .number()
    .integer('End Page must be an Integer')
    .moreThan(yup.ref('pageStart'), 'End Page must be after start')
    .required('End Page is required'),
});

const ReadingTodoForm: React.FunctionComponent<IProps> = ({
  todoListStore,
  parentReadingId,
  progressState,
  onFormSubmit,
  existingReadingTodo,
}) => {
  const [progress, setProgress] = React.useState(progressState);

  return (
    <Formik
      validationSchema={schema}
      initialValues={
        existingReadingTodo?.initialValues ?? {
          name: '',
          pageStart: '',
          pageEnd: '',
        }
      }
      onSubmit={(values) => {
        const pageStart = values.pageStart ? parseInt(values.pageStart, 10) : 0;
        const pageEnd = values.pageEnd ? parseInt(values.pageEnd, 10) : 0;

        if (existingReadingTodo) {
          const updatedReadingTodo: IReadingTodo = {
            id: existingReadingTodo.id,
            name: values.name,
            reading: existingReadingTodo.reading,
            pageStart: pageStart,
            pageEnd: pageEnd,
            done: false,
            in_progress: false,
          };
          switch (progress) {
            case ProgressState.Complete:
              updatedReadingTodo.done = true;
              break;
            case ProgressState.InProgress:
              updatedReadingTodo.in_progress = true;
              break;
          }
          todoListStore.updateReadingTodo(updatedReadingTodo);
          onFormSubmit();
          return;
        }
        const parentReading = todoListStore.getReading(parentReadingId);
        if (parentReading) {
          const newReadingTodo = todoListStore.createReadingTodo(
            values.name,
            pageStart,
            pageEnd,
            parentReading,
          );
          if (newReadingTodo) {
            switch (progressState) {
              case ProgressState.Complete:
                todoListStore.toggleReadingTodoDoneState(newReadingTodo.id);
                break;
              case ProgressState.InProgress:
                todoListStore.toggleReadingTodoProgressState(newReadingTodo.id);
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
              onChangeText={handleChange('pageStart')}
              onBlur={handleBlur('pageStart')}
              value={values.pageStart}
              placeholder="Start Page"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.secondaryText}
              multiline={false}
            />
            {errors.pageStart && (
              <Text style={SharedStyles.formErrorText}>{errors.pageStart}</Text>
            )}

            <TextInput
              keyboardType="numeric"
              onChangeText={handleChange('pageEnd')}
              onBlur={handleBlur('pageEnd')}
              value={values.pageEnd}
              placeholder="End Page"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.secondaryText}
              multiline={false}
            />
            {errors.pageEnd && (
              <Text style={SharedStyles.formErrorText}>{errors.pageEnd}</Text>
            )}
          </View>

          {existingReadingTodo && (
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
            title={existingReadingTodo ? 'Update' : 'Create'}
            onPress={handleSubmit}
            disabled={!isValid}
            style={Styles.button}
          />
        </View>
      )}
    </Formik>
  );
};

export default ReadingTodoForm;

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
