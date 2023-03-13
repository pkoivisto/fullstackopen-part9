import patientsData from "../../data/patients";
import {
  Gender,
  NewPatient,
  Patient,
  PublicPatientData,
} from "../types/patient";
import { v1 as uuid } from "uuid";

const isString = (value: unknown): value is string => {
  return typeof value === "string" || value instanceof String;
};

const isObject = (value: unknown): value is Object => {
  return !!value && typeof value === "object";
};

const isGender = (value: string): value is Gender => {
  return (
    !!value &&
    Object.values(Gender)
      .map((v) => v.toString())
      .includes(value)
  );
};

const parseNewPatient = (newPatient: unknown): newPatient is NewPatient => {
  if (!isObject(newPatient)) {
    throw new Error("Incorrect or missing data");
  }

  if (!("name" in newPatient && isString(newPatient["name"]))) {
    throw new Error("Incorrect or missing name: " + newPatient);
  }

  if (!("dateOfBirth" in newPatient && isString(newPatient["dateOfBirth"]))) {
    throw new Error("Incorrect or missing date of birth: " + newPatient);
  }

  if (!("ssn" in newPatient && isString(newPatient["ssn"]))) {
    throw new Error("Incorrect or missing ssn: " + newPatient);
  }

  if (!("occupation" in newPatient && isString(newPatient["occupation"]))) {
    throw new Error("Incorrect or missing occupation: " + newPatient);
  }

  if (!("gender" in newPatient && isString(newPatient["gender"]))) {
    throw new Error("Incorrect or missing gender: " + newPatient);
  } else {
    const { gender } = newPatient;
    if (!isGender(gender)) {
      throw new Error("Could not parse gender: " + gender);
    }
  }

  return true;
};

const parsePatient = (patient: unknown): patient is Patient => {
  if (!isObject(patient)) {
    throw new Error("Incorrect or missing data");
  }

  if (!("id" in patient && isString(patient["id"]))) {
    throw new Error("Incorrect or missing id");
  }

  return parseNewPatient(patient);
};

const patients: Array<Patient> = [...patientsData].filter(parsePatient);

export const getPatients: () => Array<PublicPatientData> = () =>
  patients.map(({ ssn, ...rest }) => rest);

export const getPatient: (id: string) => Patient | undefined = (id: string) => {
  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    return { ...patient, entries: [] };
  }
  return;
};

export const createPatient = (newPatient: unknown) => {
  if (!parseNewPatient(newPatient)) {
    throw new Error("Incorrect details provided for new patient:" + newPatient);
  }

  const patient: Patient = { ...newPatient, id: uuid() };
  patients.push(patient);

  return patient;
};
