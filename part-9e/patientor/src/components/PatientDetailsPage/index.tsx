import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box } from "@mui/system";

import patientService from "../../services/patients";
import { Patient, Entry } from "../../types";
import { Typography } from "@mui/material";

const EntryDetails = ({ entry }: { entry: Entry }) => {
  return (
    <Typography variant="body1">
      <>
        {entry.date} <i>{entry.description}</i>
      </>
      <ul>
        {entry.diagnosisCodes?.map((code, i) => (
          <li key={i}>{code}</li>
        ))}
      </ul>
    </Typography>
  );
};

const Entries = ({ patient }: { patient: Patient }) => {
  return (
    <>
      <Typography variant="h4">Entries</Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}
    </>
  );
};

const RenderPatientDetails = ({ patient }: { patient: Patient }) => {
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
      <Entries patient={patient} />
    </Box>
  );
};

export const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);

  useEffect(() => {
    if (patientId) {
      patientService.get(patientId).then((p) => setPatientDetails(p));
    }
  }, [patientId]);

  if (patientDetails) {
    return <RenderPatientDetails patient={patientDetails} />;
  } else {
    return null;
  }
};
