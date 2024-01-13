import React, { useEffect, useState } from "react";
import TableProcessor from "./ProcessData";
import Simple from "./CardDecks";
import { Gridnav } from "./Gridnav";


const Cards = () => {
  const [showTable, setShowTable] = useState(true)
  const [showAns, setShowAns] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [currentNo, setCurrentNo] = useState(0)
  const [wordsData, setWordsData] = useState([]);
  const [showDeck, setShowDeck] = useState(true)
  

 // Function to shuffle the array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const shuffleWords = () =>{
  // Clone the initial data to avoid modifying it directly
  const clonedData = [...wordsData];

  // Shuffle the cloned data
  shuffleArray(clonedData);

  // Update the state with the shuffled data
  setWordsData(clonedData);
}; // The empty dependency array ensures this runs once on mount


  useEffect(() => {
    if(wordsData.length!=0 && !showDeck){
      var datalist = new Gridnav('#datalist',setCurrentNo)

      const handleKeyDown = (event) => {
        const wordDiv=(typeof document !== "undefined" && document.getElementById(`word-${wordsData[currentNo].number}`))
    
        switch (event.key) {
          case ' ':
            setShowAns(!showAns);
            break;
          case 'n':
            wordDiv.style.backgroundColor = "#860000";
            break;
          case 'Enter':
            wordDiv.style.backgroundColor = "";
            break;
          case 'y':
            wordDiv.style.backgroundColor = "#359600";
            break;
          default:
            return;
        }
      };
      if(typeof document !== "undefined"){
        document.addEventListener('keydown', handleKeyDown);
      }
      
      return () => {
        if(typeof document !== "undefined"){
        document.removeEventListener('keydown', handleKeyDown);
      }
      };     
    }
  }, [wordsData,currentNo,showAns,showDeck]);




 const Header = () => {
   return (
    <div className="hero__subtitle" style={{textAlign:"center", marginTop:"10px"}}>
    <h2 style={{fontSize:"25px",lineHeight:"30px", margin:"0px"}} >
    SpreadSheet2Cards 
    </h2>
    <small style={{fontSize:"10px"}}>
    Convert spreadsheet table into flash cards 
    </small>
    </div>
   )
 }

const [showMenu, setShowMenu] = useState(true)
  return (
<div id="spreadSheetApp"> 
<svg onClick={()=>setShowMenu(!showMenu)}
      stroke="currentColor"
      fill="none"
      strokeWidth={0}
      viewBox="0 0 24 24"
      className="menubar"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        scale: 2,
        position: "absolute",
        top: 15,
        left: 15
      }}
    >
      <path
        d="M2 5.995c0-.55.446-.995.995-.995h8.01a.995.995 0 010 1.99h-8.01A.995.995 0 012 5.995zM2 12c0-.55.446-.995.995-.995h18.01a.995.995 0 110 1.99H2.995A.995.995 0 012 12zM2.995 17.01a.995.995 0 000 1.99h12.01a.995.995 0 000-1.99H2.995z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
<div style={{display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center", color:"white", height:showMenu?null:"100vh"}}>
    <div style={{display:showMenu?"block":"none"}}>
    <Header/>
    <button onClick={()=>{setShowTable(!showTable)}} style={{minWidth:"80px",margin:"5px",backgroundColor:showTable&&"white",color:showTable&&"black" }} >{showTable?"Hide input":"Show input"}</button>
    <button onClick={()=>shuffleWords()} style={{minWidth:"80px",margin:"5px" }}>Shuffle</button>
    <button onClick={()=>{
   for(let i=0;i<wordsData.length;i++){
    console.log(i+1)
    if(typeof document !== "undefined"){
      var a=document.getElementById(`word-${i+1}`)
      a.style.backgroundColor = "";
    }
  }
    }} 
    style={{display:showDeck&&"none",minWidth:"80px",margin:"5px" }}>Reset</button>
    <button onClick={()=>setShowInfo(!showInfo)} style={{minWidth:"80px",margin:"5px",backgroundColor:showInfo&&"white",color:showInfo&&"black"  }}>{showInfo?"Hide Info":"How to use?"}</button>
    <button onClick={()=>{setShowDeck(!showDeck)}} style={{minWidth:"80px",margin:"5px" }} >{showDeck?"Switch to KeyBoard":"Switch to FlashCard"}</button>
    </div>

    <div style={{fontSize:"14px",display:showInfo?"block":"none", border:"white 1px solid", padding:"10px",width:"400px", marginBottom:"10px"}}>
<h2>How to use it?</h2>
<p>There are two modes:</p>
<ul>
  <li>FlashCard Mode (default)</li>
  <li>KeyBoard Mode</li>
</ul>
<h3>Instruction for FlashCard Mode</h3>
<ul>
  <li>Swipe left or click left button if you don't know the meaning.</li>
  <li>Swipe right or click right button if you know the meaning.</li>
  <li>Click on the word to toggle visibility of answer for each cards.</li>
  <li>Click on the <strong>Ans</strong> to toggle visibility of all answers.</li>
   <li>
   <strong>Shuffle</strong> button shuffles the words
   </li>
</ul>
<h3>Instruction for KeyBoard Mode</h3>
Click on "Switch to KeyBoard" button to open KeyBoard Mode.
<ul>
    <li>
    <strong>Click on any word</strong>  in the grid to start navigation.
    </li>
    <li>
   <strong>Shuffle</strong> button shuffles the words
    </li>
    <li>
   <strong>Reset</strong> button removes highlights from all words
    </li>
   </ul>    
<table>
  <tr>
    <th>KeyStrokes</th>
    <th>Function</th>
  </tr>
  <tr>
    <td>ArrowKeys</td>
    <td>Navigates in the grid</td>
  </tr>
  <tr>
    <td>Space</td>
    <td>Shows/Hides meanings of current word</td>
  </tr>
  <tr>
    <td>y</td>
    <td>Highlights current word green</td>
  </tr>
  <tr>
    <td>n</td>
    <td>Highlights current word red</td>
  </tr>
  <tr>
    <td>Enter</td>
    <td>Removes highlight from current word</td>
  </tr>
 </table>

    </div>
    <div style={{display:showTable?"block":"none", border:"white 1px solid", padding:"10px",maxWidth:"400px"}}>
    <TableProcessor  setShowTable={setShowTable} setWordsData={setWordsData}/>
    </div>
  
<div>
  {wordsData.length!=0&&!showDeck&&
   <ul id="datalist" data-amount="6" data-element="button" style={{display:"grid", gridTemplateColumns:"auto auto auto auto auto auto", gap:"10px",marginTop:"15px"}}>
     {wordsData.map((item) => (
       <li key={item.number} style={{listStyle:"none"}}>
          <button id={`word-${item.number}`} style={{minWidth:"150px",minHeight:"40px"}}>{item.word}</button>
        </li>
      ))
    } 
    </ul>
}
</div>
{
  showDeck&&wordsData.length!=0&&
      <Simple wordsData={wordsData}/>
  }

{
  showAns&&!showDeck&&
  <div className="centered-div" style={{border:"white 1px solid", padding:"10px", background:"#222222", minHeight:"200px", minWidth:"200px", borderRadius:"10px"}}>
        <div style={{fontSize:"20px", minHeight:"50px"}}><strong>{toTitleCase(wordsData[currentNo].word)}</strong></div>
        <div>{wordsData[currentNo].meaning}</div>
  </div>
}
</div>
</div>
    )
  }
  
export default Cards

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

