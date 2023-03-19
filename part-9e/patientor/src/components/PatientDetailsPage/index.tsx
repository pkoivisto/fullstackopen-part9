import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box } from "@mui/system";

import patientService from "../../services/patients";
import { Patient } from "../../types";
import { Typography } from "@mui/material";

const RenderPatientDetails = ({ patient }: { patient: Patient }) => {
  const PatientAttribute = ({ attribute }: { attribute: keyof Patient }) => {
    return (
      <Typography variant="body1">
        <b>{attribute}</b>: {patient[attribute]}
      </Typography>
    );
  };

  return (
    <Box className="app" style={{ padding: "1em 0" }}>
      <Typography variant="h4">{patient.name}</Typography>
      <PatientAttribute attribute="gender" />
      <PatientAttribute attribute="occupation" />
      <PatientAttribute attribute="ssn" />
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
