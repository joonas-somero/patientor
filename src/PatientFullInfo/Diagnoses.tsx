import React from "react";

import diagnosisApi from "../services/diagnosisService";
import { useStateValue, setDiagnosisList } from "../state";

export const Diagnoses: React.FC<{ codes: string[] }> = ({ codes }) => {
  const [{ diagnoses }, dispatch] = useStateValue();
  React.useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnosesFromApi = await diagnosisApi.getAll();
      if (diagnosesFromApi)
        dispatch(setDiagnosisList(diagnosesFromApi));
    };
    if (!diagnoses)
      fetchDiagnoses();
  }, [dispatch, diagnoses]);

  return <ul>
    {codes.map(code =>
      <li key={code}>
        <small>{`${code} ${diagnoses[code]?.name}`}</small>
      </li>
    )}
  </ul>;
};