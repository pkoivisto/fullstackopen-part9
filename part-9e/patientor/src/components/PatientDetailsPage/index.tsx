import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box } from "@mui/system";

import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { Patient, Entry, Diagnosis } from "../../types";
import { Typography } from "@mui/material";

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Array<Diagnosis>;
}) => {
  return (
    <Typography variant="body1">
      <>
        {entry.date} <i>{entry.description}</i>
      </>
      <ul>
        {entry.diagnosisCodes?.map((code, i) => (
          <li key={i}>
            {code} {diagnoses.find((d) => d.code === code)?.name ?? ''}
          </li>
        ))}
      </ul>
    </Typography>
  );
};

const Entries = ({
  patient,
  diagnoses,
}: {
  patient: Patient;
  diagnoses: Array<Diagnosis>;
}) => {
  return (
    <>
      <Typography variant="h4">Entries</Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </>
  );
};

const RenderPatientDetails = ({
  patient,
  diagnoses,
}: {
  patient: Patient;
  diagnoses: Array<Diagnosis>;
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
  const [diagnoses, setDiagnoses] = useState<Array<Diagnosis>>([]);

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
