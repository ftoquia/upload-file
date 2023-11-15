export const uploadCSV = (csvData, headers) => ({
    type: 'UPLOAD_CSV',
    payload: { csvData, headers },
  });
  
  