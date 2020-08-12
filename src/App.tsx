import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue, setPatientList, setDiagnosisList } from "./state";
import patientApi from "./services/patientService";
import diagnoseApi from "./services/diagnosisService";

import PatientListPage from "./PatientListPage";
import PatientFullInfo from "./PatientFullInfo";

const App: React.FC = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchLists = async () => {
      const patientListFromApi = await patientApi.getAll();
      if (patientListFromApi)
        dispatch(setPatientList(patientListFromApi));
      const diagnosisListFromApi = await diagnoseApi.getAll();
      if (diagnosisListFromApi)
        dispatch(setDiagnosisList(diagnosisListFromApi));
    };
    fetchLists();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route exact path="/">
              <PatientListPage />
            </Route>
            <Route path="/patients/:patient">
              <PatientFullInfo />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
