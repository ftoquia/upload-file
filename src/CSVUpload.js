// CSVUpload.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Papa from "papaparse";
import { uploadCSV } from "./actions";
import "./style/style.css";

const CSVUpload = () => {
  const dispatch = useDispatch();
  const [csvData, setCSVData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [currentRow, setCurrentRow] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [prevData, setPrevData] = useState({ headers: [], data: [] });
  const [prevListData, setPrevListData] = useState([]);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        const data = result.data;
        const headers = data[0];
        const csvData = data
          .slice(1)
          .filter((row) => row.some((cell) => cell.trim() !== ""));

        setHeaders(headers);
        setCSVData(csvData);
        // Dispatch the action to store the CSV data in Redux
        dispatch(uploadCSV(csvData, headers));
      },
    });
    setHasUploadedFile(true);
  };

  const handleInputChange = (cellIndex, value) => {
    const updatedRow = currentRow.map((val, i) => {
      if (i === cellIndex) {
        return value;
      }
      return val;
    });
    setCurrentRow(updatedRow);
    const updatedList = csvData.map((row, index) => {
      if (index === currentRowIndex) {
        return updatedRow;
      }
      return row;
    });
    setPrevData(csvData);
    setCSVData(updatedList);
  };

  const handleEditTable = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      const tableData = {
        headers,
        data: prevData.data ? csvData : prevData,
      };
      const jsonString = JSON.stringify(tableData);
      const obj = JSON.parse(jsonString);
      setPrevData(obj);
      const prevList = prevListData;
      prevListData.push(obj);
      setPrevListData(prevList);
      console.log("prev data", prevData);
      console.log("current data", tableData);
      setHasUpdate(true);
    }
  };

  const handleCurrentRow = (row, rowIndex) => {
    setCurrentRow(row);
    setCurrentRowIndex(rowIndex);
  };

  const renderPrevDataTable = () => {
    if (hasUpdate) {
      return (
        <div>
          <br />
          <hr />
          <h3>History</h3>
          {prevListData?.map((obj, index) => (
            <div>
              <span>
                <b>{`version ${index + 1}`}</b>{" "}
              </span>
              <table key={`prev-table-${index}`}>
                <thead>
                  <tr>
                    {obj.headers?.map((header, index) => (
                      <th key={`prev-th-${index}`}>{header}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {obj.data.map((row, rowIndex) => (
                    <tr key={`prev-table-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`prev-table-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      Upload file:{" "}
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <div className="current-table-container">
        <div>
          {hasUploadedFile && (
            <div>
              <div className="actions">
                <h3>Current Data</h3>

                <button onClick={() => handleEditTable()}>
                  {isEditable ? "Save" : "Edit data"}
                </button>
              </div>
              {csvData.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {isEditable ? (
                              <input
                                onFocus={() => handleCurrentRow(row, rowIndex)}
                                type="text"
                                value={cell}
                                onChange={(e) =>
                                  handleInputChange(
                                    cellIndex,
                                    e.currentTarget.value
                                  )
                                }
                              />
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      {renderPrevDataTable()}
    </div>
  );
};

export default CSVUpload;
