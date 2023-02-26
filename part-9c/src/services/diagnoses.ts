import { Diagnosis } from "../types/diagnosis";
import diagnoses from "../../data/diagnoses";

export const getDiagnoses: () => Array<Diagnosis> = () => diagnoses;
