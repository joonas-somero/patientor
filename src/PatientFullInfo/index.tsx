import React from "react";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { useStateValue, addPatient } from "../state";
import { genderSemanticUIIcon, assertNever, hasNonEmptyStringProp } from "../utils";
import patientApi from "../services/patientService";

import { EntryDetails } from "./EntryDetails";
import { AddEntryForm } from "./AddEntryForm";
import { EntryFormValues } from "../types";

const PatientFullInfo: React.FC = () => {
  const { patient: id } = useParams<{ patient: string }>();

  const [{ patients }, dispatch] = useStateValue();

  React.useEffect(() => {
    const fetchPatientFullInfo = async () => {
      const patientFromApi = await patientApi.getById(id);
      if (patientFromApi)
        dispatch(addPatient(patientFromApi));
    };

    if (!patients[id]?.ssn)
      fetchPatientFullInfo();
  }, [dispatch, patients, id]);

  const parseValues = (values: EntryFormValues) => {
    switch (values.type) {
      case "Hospital":
        return hasNonEmptyStringProp(values.discharge)
          ? values
          : { ...values, discharge: undefined };
      case "OccupationalHealthcare":
        return hasNonEmptyStringProp(values.sickLeave)
          ? values
          : { ...values, sickLeave: undefined };
      case "HealthCheck":
        return values;
      default:
        return assertNever(values);
    }
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const newEntry = await patientApi.addEntry(id, parseValues(values));
      if (newEntry) {
        dispatch(addPatient({
          ...patients[id],
          entries: [
            ...patients[id].entries,
            newEntry
          ]
        }
        ));
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  return patients[id]
    ? <>
      <h2>
        {patients[id].name}
        <Icon name={genderSemanticUIIcon(patients[id].gender)} />
      </h2>
      <div>ssn:{` ${patients[id].ssn}`}</div>
      <div>occupation:{` ${patients[id].occupation}`}</div>
      <AddEntryForm onSubmit={submitNewEntry} />
      {patients[id].entries?.map(entry =>
        <EntryDetails key={entry.id} entry={entry} />
      )}
    </>
    : <>
      patient not found
    </>;
};

export default PatientFullInfo;