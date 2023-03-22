import { Entry } from "./entry";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Array<Entry>;
}

export type NewPatient = Omit<Patient, "id">;

export type PublicPatientData = Omit<Patient, "ssn" | "entries">;
