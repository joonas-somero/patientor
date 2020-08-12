import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";
import { EntryFormValues } from "../types";

const getAll = async () => {
  try {
    const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getById = async (id: string) => {
  try {
    const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const addEntry = async (id: string, entry: EntryFormValues) => {
  try {
    const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, entry);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export default { getAll, getById, addEntry };