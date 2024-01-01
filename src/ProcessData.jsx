import React, { useState } from 'react';

const TableProcessor = ({ wordsData,setWordsData}) => {
  const [tableBody, setOutputTable] = useState(null);
  const [tableData, setTableData] = useState('');
  const [dataJson, setDataJson] = useState([]);
  
  const processTable = () => {
    const rows = tableData.split('\n');
    const headers = [
    "word",
    "meaning",]

        // Create an array of objects representing each row
        const jsonData = rows.slice(0).map((row,rowIndex) => {
          const cells = row.split('\t').map(cell => cell.trim());
          const rowObject = {};
          rowObject["number"] = rowIndex+1
          headers.forEach((header, index) => {
          rowObject[header] = cells[index]          
          });
          return rowObject;
        });
    
        // Log the JSON data for demonstration purposes
        setWordsData(jsonData);
        setDataJson(jsonData)
        console.log("jsonData",jsonData);


    const table = (
        <tbody>
          {rows.slice(0).map((row, rowIndex) => (

            <tr key={rowIndex}>
              <td>{rowIndex+1}</td>
              
              {row.split('\t').map((cell, cellIndex) => (
            
             (cellIndex <= 2) ? (
              <td key={cellIndex}>{cell.trim()}</td>
            ) : null       
            ))}
            </tr>
          ))}
        </tbody>
    );
    setOutputTable(table);
  };

  return (

    <div style={{fontSize:"14px", display:"flex", flexDirection:"column"}}>
 
   <p style={{fontSize:"12px",color:"white"}}>
    Copy a table from a spreadsheet program such as Google Sheets or Excel and paste it in the field below. The first row should not be the headers of the table. The first column should be words and second column should be meanings.
    </p>
      <textarea
        placeholder="Paste your table here"
        value={tableData}
        rows="8" cols="50"
        onChange={(e) => {setTableData(e.target.value)}}
        ></textarea>
        <div>

      <button  style={{width:"150px", margin:"5px"}}  onClick={processTable}>Process Table</button>
      <CopyButton textToCopy={JSON.stringify(dataJson, null, 2)}/>
      </div>
      <div  style={{overflowY:"scroll", height:"200px",overflow:"scroll"}}>
      <table className="output-table" >
        <thead>
          <tr>
            {/* Default headings */}
            <th>SN</th>
            <th>Word</th>
            <th>Meaning</th>
          </tr>
        </thead>
        {tableBody}
      </table>
        </div> 
    </div>
  );
};

export default TableProcessor;



function CopyButton({textToCopy}) {
  console.log(textToCopy)
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => setIsCopied(true))
      .catch((error) => console.log(error));
  };

  return (
    <button style={{width:"200px"}} onClick={()=>{copyToClipboard(); alert("JSON Copied to Clipboard")}}>📋Copy data as JSON</button>
  );
}

