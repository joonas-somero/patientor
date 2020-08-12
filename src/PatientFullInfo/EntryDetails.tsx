import React from "react";
import { Segment, Icon } from "semantic-ui-react";

import { Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../types";
import { assertNever, entrySemanticUIIcon, healthRatingColor } from "../utils";
import { Diagnoses } from "./Diagnoses";

const HospitalDetails: React.FC<{ entry: HospitalEntry }> = ({ entry }) =>
  entry.discharge
    ? <p>{`Discharged ${entry.discharge.date}: ${entry.discharge.criteria}`}</p>
    : null;

const OccupationalHealthcareDetails: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) =>
  entry.sickLeave
    ? <>
      <h5>{entry.employerName}</h5>
      <p>{`Sick leave from ${entry.sickLeave.startDate} to  ${entry.sickLeave.endDate}.`}</p>
    </>
    : null;

const HealthCheckDetails: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) =>
  <Icon name="heart" color={healthRatingColor(entry.healthCheckRating)} />;

export const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const renderDetails = () => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalDetails entry={entry} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareDetails entry={entry} />;
      case "HealthCheck":
        return <HealthCheckDetails entry={entry} />;
      default:
        return assertNever(entry);
    }
  };
  return <>
    <Segment>
      <h4>
        {entry.date}
        <Icon name={entrySemanticUIIcon(entry)} size="large" />
        {entry.specialist}
      </h4>
      <p><small>{entry.description}</small></p>
      {renderDetails()}
      {entry.diagnosisCodes
        ? <Diagnoses codes={entry.diagnosisCodes} />
        : null}
    </Segment>
  </>;
};