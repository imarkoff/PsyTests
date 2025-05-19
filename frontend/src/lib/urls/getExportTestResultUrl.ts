const getExportTestResultUrl = (patientId: string, testId: string) =>
    `/api/doctor/patients/${patientId}/tests/history/${testId}/export`;

export default getExportTestResultUrl;