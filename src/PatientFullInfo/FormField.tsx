import React from "react";
import { Field } from "formik";

import { TextField, NumberField } from "../AddPatientModal/FormField";

export const HospitalField: React.FC = () => (
  <>
    <h3>New hospital entry</h3>
    <Field
      label="Discharge date"
      placeholder="YYYY-MM-DD"
      name="discharge.date"
      component={TextField}
    />
    <Field
      label="Discharge criteria"
      placeholder="Discharge criteria"
      name="discharge.criteria"
      component={TextField}
    />
  </>
);

export const OccupationalHealthcareField: React.FC = () => (
  <>
    <h3>New occupational healthcare entry</h3>
    <Field
      label="Employer name"
      placeholder="Employer name"
      name="employerName"
      component={TextField}
    />
    <Field
      label="Sick leave start date"
      placeholder="YYYY-MM-DD"
      name="sickLeave.startDate"
      component={TextField}
    />
    <Field
      label="Sick leave end date"
      placeholder="YYYY-MM-DD"
      name="sickLeave.endDate"
      component={TextField}
    />
  </>
);

export const HealthCheckField: React.FC = () => (
  <>
    <h3>New health check entry</h3>
    <Field
      label="Health check rating"
      placeholder="0"
      name="healthCheckRating"
      component={NumberField}
      min={0}
      max={3}
    />
  </>
);