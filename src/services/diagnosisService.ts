import axios from "axios";

import { apiBaseUrl } from "../constants";
import { Diagnosis } from "../types";

const getAll = async () => {
  try {
    const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
    return data;
  } catch (e) {
    console.error(e);
  }
};

export default { getAll };