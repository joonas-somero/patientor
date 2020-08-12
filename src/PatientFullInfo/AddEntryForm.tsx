import React from "react";
import { Field, Formik, Form } from "formik";
import { Button, Segment, Select } from "semantic-ui-react";

import { useStateValue } from "../state";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { HospitalField, OccupationalHealthcareField, HealthCheckField } from "./FormField";
import { EntryFormValues, Entry } from "../types";
import { assertNever, isDate, isRating, isPeriod, isYYYYMMDD } from "../utils";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
}

interface FormTypeOption {
  key: number;
  value: Entry["type"];
  text: string;
}

const formTypeOptions: FormTypeOption[] = [
  { key: 0, value: "Hospital", text: "Hospital admission" },
  { key: 1, value: "OccupationalHealthcare", text: "Occupational healthcare" },
  { key: 2, value: "HealthCheck", text: "Health check" }
];

export const AddEntryForm: React.FC<Props> = ({ onSubmit }) => {
  const [{ diagnoses }] = useStateValue();
  const [show, setShow] = React.useState<boolean>(false);
  const [formType, setFormType] = React.useState(formTypeOptions[0].value);

  const getInitialValues = (type: FormTypeOption["value"]): EntryFormValues => {
    const hospitalValues: EntryFormValues = {
      type: "Hospital",
      description: "",
      specialist: "",
      diagnosisCodes: [],
      discharge: {
        date: "",
        criteria: ""
      }
    };

    const occupationalValues: EntryFormValues = {
      type: "OccupationalHealthcare",
      description: "",
      specialist: "",
      diagnosisCodes: [],
      employerName: "",
      sickLeave: {
        startDate: "",
        endDate: ""
      }
    };

    const healthCheckValues: EntryFormValues = {
      type: "HealthCheck",
      description: "",
      specialist: "",
      diagnosisCodes: [],
      healthCheckRating: 0
    };

    switch (type) {
      case "Hospital":
        return hospitalValues;
      case "OccupationalHealthcare":
        return occupationalValues;
      case "HealthCheck":
        return healthCheckValues;
      default:
        return assertNever(type);
    }
  };

  const getContextualFields = (type: FormTypeOption["value"]) => {
    switch (type) {
      case "Hospital":
        return <Field component={HospitalField} />;
      case "OccupationalHealthcare":
        return <Field component={OccupationalHealthcareField} />;
      case "HealthCheck":
        return <Field component={HealthCheckField} />;
      default:
        return assertNever(type);
    }
  };

  return <>
    <Button
      onClick={() => setShow(!show)}
      content={show ? "Cancel" : "New entry"} />
    {show
      ? <>
        <Select
          defaultValue={formType}
          text="Entry type"
          onChange={(e, { value }) => {
            switch (value) {
              case "Hospital":
                return setFormType("Hospital");
              case "OccupationalHealthcare":
                return setFormType("OccupationalHealthcare");
              case "HealthCheck":
                return setFormType("HealthCheck");
              default:
                console.log(value);
            }
          }}
          options={formTypeOptions}
        />
        <Formik
          enableReinitialize
          initialValues={getInitialValues(formType)}
          onSubmit={onSubmit}
          validate={values => {
            const errors: { [field: string]: { [field: string]: string } | string } = {};
            const errorStrings = {
              requiredError: "Field is required",
              dateError: "Invalid date",
              periodError: "Start must predate end",
              formatError: "Invalid format (use YYYY-MM-DD)",
              ratingError: "Invalid health check rating (must be 0-3)"
            };

            if (!values.description) {
              errors.description = errorStrings.requiredError;
            }
            if (!values.specialist) {
              errors.specialist = errorStrings.requiredError;
            }

            switch (values.type) {
              case "Hospital": {
                if (values.discharge?.date && !isYYYYMMDD(values.discharge.date)) {
                  errors.discharge = { date: errorStrings.formatError };
                }
                if (values.discharge?.date && !values.discharge.criteria) {
                  errors.discharge = { criteria: errorStrings.requiredError };
                }
                if (values.discharge?.criteria && !values.discharge.date) {
                  errors.discharge = { date: errorStrings.requiredError };
                }
                break;
              }
              case "OccupationalHealthcare": {
                if (!values.employerName) {
                  errors.employerName = errorStrings.requiredError;
                }
                if (values.sickLeave?.startDate
                  && values.sickLeave?.endDate
                  && !isPeriod(values.sickLeave.startDate, values.sickLeave.endDate)) {
                  errors.sickLeave = {
                    startDate: errorStrings.periodError,
                    endDate: errorStrings.periodError
                  };
                }
                if (values.sickLeave?.startDate && !isDate(values.sickLeave.startDate)) {
                  errors.sickLeave = { startDate: errorStrings.dateError };
                }
                if (values.sickLeave?.endDate && !isDate(values.sickLeave.endDate)) {
                  errors.sickLeave = { endDate: errorStrings.dateError };
                }
                if (values.sickLeave?.startDate && !isYYYYMMDD(values.sickLeave.startDate)) {
                  errors.sickLeave = { startDate: errorStrings.formatError };
                }
                if (values.sickLeave?.endDate && !isYYYYMMDD(values.sickLeave.endDate)) {
                  errors.sickLeave = { endDate: errorStrings.formatError };
                }
                if (values.sickLeave?.startDate && !values.sickLeave.endDate) {
                  errors.sickLeave = { endDate: errorStrings.requiredError };
                }
                if (values.sickLeave?.endDate && !values.sickLeave.startDate) {
                  errors.sickLeave = { startDate: errorStrings.requiredError };
                }
                break;
              }
              case "HealthCheck": {
                if (!isRating(values.healthCheckRating)) {
                  errors.healthCheckRating = errorStrings.ratingError;
                }
                break;
              }
            }
            return errors;
          }}
        >
          {({ values, isValid, dirty, setFieldValue, setFieldTouched }) => {
            return (
              <Segment>
                <Form className="form ui">
                  {getContextualFields(values.type)}
                  <Field
                    label="Description"
                    placeholder="Description"
                    name="description"
                    component={TextField}
                  />
                  <Field
                    label="Specialist"
                    placeholder="Specialist"
                    name="specialist"
                    component={TextField}
                  />
                  <Field
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    diagnoses={Object.values(diagnoses)}
                    component={DiagnosisSelection}
                  />
                  <Button
                    type="submit"
                    content="Add"
                    disabled={!dirty || !isValid}
                  />
                </Form>
              </Segment>
            );
          }}
        </Formik>
      </>
      : null}
  </>;
};