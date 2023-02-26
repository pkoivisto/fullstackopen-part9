import { PublicPatientData } from "../types/patient";
import patients from "../../data/patients";

export const getPatients: () => Array<PublicPatientData> = () =>
  patients.map(({ ssn, ...rest }) => rest);
