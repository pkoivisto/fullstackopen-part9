import patientsData from "../../data/patients-full";
import {
  Gender,
  NewPatient,
  Patient,
  PublicPatientData,
} from "../types/patient";
import { v1 as uuid } from "uuid";
import { Diagnosis } from "../types/diagnosis";
import { EntryWithoutId } from "../types/entry";

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
  return patient;
};

export const createPatient = (newPatient: unknown) => {
  if (!parseNewPatient(newPatient)) {
    throw new Error("Incorrect details provided for new patient:" + newPatient);
  }

  const patient: Patient = { ...newPatient, id: uuid() };
  patients.push(patient);

  return patient;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseHealthCheckEntry = (entry: Object) => {
  if (!("healthCheckRating" in entry)) {
    throw new Error("Missing health check rating for entry: " + entry);
  }

  const { healthCheckRating } = entry;

  if (
    !(
      healthCheckRating === 0 ||
      healthCheckRating === 1 ||
      healthCheckRating === 2 ||
      healthCheckRating === 3
    )
  ) {
    throw new Error("Incorrect health check rating: " + healthCheckRating);
  }
  return true;
};

const parseHospitalEntry = (entry: Object) => {
  // discharge was interpreted as an optional field;
  // if it's missing, we're done parsing
  if (!("discharge" in entry)) {
    return true;
  }
  const { discharge } = entry;
  if (!isObject(discharge)) {
    throw new Error("Incorrect or missing discharge: " + discharge);
  }
  if (!("date" in discharge && isString(discharge["date"]))) {
    throw new Error("Incorrect or missing discharge date: " + discharge);
  }
  if (!("criteria" in discharge && isString(discharge["criteria"]))) {
    throw new Error("Incorrect or missing discharge criteria: " + discharge);
  }
  return true;
};

const parseOccupationalHealthCareEntry = (entry: Object) => {
  if (!("employerName" in entry && isString(entry["employerName"]))) {
    throw new Error("Incorrrect or missing employerName: " + entry);
  }
  // sickLeave is optional - validate only if present
  if (!("sickLeave" in entry)) {
    return true;
  } else {
    const { sickLeave } = entry;
    if (!isObject(sickLeave)) {
      throw new Error("Incorrect or missing sickLeave: " + sickLeave);
    }
    if (!("startDate" in sickLeave && isString(sickLeave["startDate"]))) {
      throw new Error(
        "Incorrect or missing startDate for sickLeave: " + sickLeave
      );
    }
    if (!("endDate" in sickLeave && isString(sickLeave["endDate"]))) {
      throw new Error(
        "Incorrect or missing endDate for sickLeave: " + sickLeave
      );
    }
    return true;
  }
};

const parseEntryTypeSpecificFields = (entry: Object) => {
  if (!("type" in entry)) {
    throw new Error("Missing type for entry: " + entry);
  }

  switch (entry["type"]) {
    case "HealthCheck":
      return parseHealthCheckEntry(entry);
    case "Hospital":
      return parseHospitalEntry(entry);
    case "OccupationalHealthCare":
      return parseOccupationalHealthCareEntry(entry);
    default:
      throw new Error("Incorrect type for entry: " + entry);
  }
};

const parseNewEntry = (entry: unknown): entry is EntryWithoutId => {
  if (!isObject(entry)) {
    throw new Error("Incorrect or missing entry");
  }

  if (!("description" in entry && isString(entry["description"]))) {
    throw new Error("Incorrect or missing description: " + entry);
  }

  if (!("date" in entry && isString(entry["date"]))) {
    throw new Error("Incorrect or missing date: " + entry);
  }

  if (!("specialist" in entry && isString(entry["specialist"]))) {
    throw new Error("Incorrect or missing specialist: " + entry);
  }

  if (!parseEntryTypeSpecificFields(entry)) {
    throw new Error(
      "Incorrect or missing type or fields incompatible with type: " + entry
    );
  }

  return true;
};

export const createPatientEntry = (patient: Patient, entry: unknown) => {
  if (!parseNewEntry(entry)) {
    throw new Error("Incorrect entry details");
  }

  const updatedPatientData = {
    ...patient,
    entries: [
      ...patient.entries,
      { ...entry, id: uuid(), diagnosisCodes: parseDiagnosisCodes(entry) },
    ],
  };

  const patientsIdx = patients.findIndex(({ id }) => id === patient.id);
  patients[patientsIdx] = updatedPatientData;

  return updatedPatientData;
};
