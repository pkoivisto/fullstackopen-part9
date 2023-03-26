import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box } from "@mui/system";

import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import {
  Patient,
  Entry,
  HospitalEntry,
  Diagnosis,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
} from "../../types";
import { Typography } from "@mui/material";

type Diagnoses = Array<Diagnosis>;

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <div>
      <b>Risk level</b> (0-3, lower is better): {entry.healthCheckRating}
    </div>
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  if (entry.discharge) {
    return (
      <div>
        <b>Discharged</b> on {entry.discharge.date}. Cause:{" "}
        {entry.discharge.criteria}.
      </div>
    );
  } else {
    return <div>Patient not discharged yet or discharge not recorded.</div>;
  }
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <div>
      <b>Employer</b>: {entry.employerName}
      <br />
      {entry.sickLeave ? (
        <>
          <b>Sick leave granted</b>: {entry.sickLeave.startDate} -{" "}
          {entry.sickLeave.endDate}
        </>
      ) : (
        <b>No sick leave granted.</b>
      )}
    </div>
  );
};

const getEntryType = (entry: Entry) => {
  switch (entry.type) {
    case "HealthCheck":
      return "Health check";
    case "Hospital":
      return "Hospital visit";
    case "OccupationalHealthcare":
      return "Occupational health care appointment";
  }
};

const getEntryDetailsByType = (entry: Entry) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
  }
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnoses;
}) => {
  return (
    <div style={{ padding: "4px", border: "2px dashed" }}>
      <i>{getEntryType(entry)}</i> on {entry.date}
      <br />
      <i>{entry.description}</i>
      {getEntryDetailsByType(entry)}
      {entry.diagnosisCodes ? (
        <>
          <b>Diagnoses</b>:
          <ul>
            {entry.diagnosisCodes?.map((code, i) => (
              <li key={i}>
                {code} {diagnoses.find((d) => d.code === code)?.name ?? ""}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <b>No recorded diagnoses.</b>
          <br />
        </>
      )}
      <b>Attending specialist</b>: {entry.specialist}
    </div>
  );
};

const Entries = ({
  patient,
  diagnoses,
}: {
  patient: Patient;
  diagnoses: Diagnoses;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        gap: "4px",
      }}
    >
      <Typography variant="h4">Entries</Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

const RenderPatientDetails = ({
  patient,
  diagnoses,
}: {
  patient: Patient;
  diagnoses: Diagnoses;
}) => {
  const PatientAttribute = ({ attribute }: { attribute: keyof Patient }) => {
    return (
      <Typography variant="body1">
        <>
          <b>{attribute}</b>: {patient[attribute]}
        </>
      </Typography>
    );
  };

  return (
    <Box className="app" style={{ padding: "1em 0" }}>
      <Typography variant="h4">{patient.name}</Typography>
      <PatientAttribute attribute="gender" />
      <PatientAttribute attribute="occupation" />
      <PatientAttribute attribute="ssn" />
      <br />
      <Entries patient={patient} diagnoses={diagnoses} />
    </Box>
  );
};

export const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnoses>([]);

  useEffect(() => {
    if (patientId) {
      patientService.get(patientId).then((p) => setPatientDetails(p));
      diagnosisService.getAll().then((p) => setDiagnoses(p));
    }
  }, [patientId]);

  if (patientDetails) {
    return (
      <RenderPatientDetails patient={patientDetails} diagnoses={diagnoses} />
    );
  } else {
    return null;
  }
};
