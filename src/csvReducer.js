// csvReducer.js
const initialState = {
    csvData: [],
    headers: [],
  };
  
  const csvReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPLOAD_CSV':
        return {
          ...state,
          csvData: action.payload.csvData,
          headers: action.payload.headers,
        };
      default:
        return state;
    }
  };
  
  export default csvReducer;
  