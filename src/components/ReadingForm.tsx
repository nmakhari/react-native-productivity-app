import React from 'react';
import { ITodoListStore } from '../../stores/TodoListStore';
import * as yup from 'yup';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import SharedStyles from '../shared/SharedStyles';
import { Colors } from '../shared/Colors';
import BasicButton from './BasicButton';
import { IReading, IReadingTodo } from '../../db/Readings';

export type ExistingReading = {
  id: number;
  creationDate: Date;
  readings: Realm.List<IReadingTodo>;
  initialValues: ReadingFormValues;
};

export type ReadingFormValues = {
  name: string;
  pagesComplete: string;
  pagesTotal: string;
};

interface IProps {
  todoListStore: ITodoListStore;
  onFormSubmit: () => void;
  existingReading?: ExistingReading;
}

const schema = yup.object().shape({
  name: yup.string().required('Reading Name is Required'),
  pagesTotal: yup
    .number()
    .integer('Page Count must be an integer')
    .moreThan(0, 'Enter a valid page count')
    .required('Reading page count is required'),
  pagesComplete: yup
    .number()
    .integer()
    .nullable()
    .min(0, 'Cannot complete less than 0 pages')
    .max(yup.ref('pagesTotal'), 'Cannot complete more than total pages'),
});

const ReadingForm: React.FunctionComponent<IProps> = ({
  todoListStore,
  onFormSubmit,
  existingReading,
}) => {
  return (
    <Formik
      validationSchema={schema}
      initialValues={
        existingReading
          ? existingReading.initialValues
          : { name: '', pagesTotal: '', pagesComplete: '' }
      }
      onSubmit={(values) => {
        if (existingReading) {
          const updatedReading: IReading = {
            id: existingReading.id,
            name: values.name,
            creationDate: existingReading.creationDate,
            pagesComplete: values.pagesComplete
              ? parseInt(values.pagesComplete, 10)
              : 0,
            pagesTotal: parseInt(values.pagesTotal, 10),
            readings: existingReading.readings,
          };
          todoListStore.updateReading(updatedReading);
          onFormSubmit();
          return;
        }
        todoListStore.createReading(
          values.name,
          parseInt(values.pagesTotal, 10),
          values.pagesComplete ? parseInt(values.pagesComplete, 10) : 0,
        );
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
              placeholder="Reading Name"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.titleText}
            />
            {errors.name && (
              <Text style={SharedStyles.formErrorText}>{errors.name}</Text>
            )}

            <TextInput
              keyboardType="numeric"
              onChangeText={handleChange('pagesTotal')}
              onBlur={handleBlur('pagesTotal')}
              value={values.pagesTotal.toString()}
              placeholder="Page Count"
              placeholderTextColor={Colors.textInputPlaceholder}
              style={Styles.secondaryText}
              multiline={false}
            />
            {errors.pagesTotal && (
              <Text style={SharedStyles.formErrorText}>
                {errors.pagesTotal}
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
            title={existingReading ? 'Update' : 'Create'}
            onPress={handleSubmit}
            disabled={!isValid}
            style={Styles.button}
          />
        </View>
      )}
    </Formik>
  );
};

export default ReadingForm;

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
