import React, { useEffect, useState } from "react";
import TableProcessor from "./ProcessData";

const Cards = () => {
  const [showTable, setShowTable] = useState(true)
  const [showAns, setShowAns] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [currentNo, setCurrentNo] = useState(0)
  const [wordsData, setWordsData] = useState([]);

  var Gridnav = function (listelement,setCurrentNo) {
    /*
  Gridnav - a way to navigate lists with a keyboard in a
  2D fashion instea of item-by-item
  Copyright (c) 2016 Christian Heilmann
  Licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php
  Version:  1.0.0
*/
    var that = this;
    this.list =
      typeof listelement === "string"
        ? document.querySelector(listelement)
        : listelement;
    if (!this.list) {
      throw Error("List item could not be found");
    }
    this.setcodes = function (amount) {
      that.codes = {
        39: 1,
        // 68: 1,
        // 65: -1,
        37: -1,
        // 87: -that.amount,
        38: -that.amount,
        // 83: that.amount,
        40: that.amount,
      };
    };
    if (!this.list.getAttribute("data-element")) {
      this.element = this.list.firstElementChild.firstElementChild.tagName;
    } else {
      this.element = this.list.getAttribute("data-element").toUpperCase();
    }
    if (!this.list.getAttribute("data-amount")) {
      this.amount = 6502;
      this.setcodes(this.amount);
    } else {
      this.amount = +this.list.getAttribute("data-amount");
      this.setcodes(this.amount);
    }
    this.setcodes(this.amount);
    this.all = this.list.querySelectorAll(this.element);
    this.keynav = function (ev) {
      var t = ev.target;
      var c;
      var posx, posy;
      if (t.tagName === that.element) {
        for (var i = 0; i < that.all.length; i++) {
          if (that.all[i] === t) {
            c = i;
            posx = that.all[c].offsetLeft;
            posy = that.all[c].offsetTop;
            break;
          }
        }
        if (that.codes[ev.keyCode]) {
          var kc = that.codes[ev.keyCode];
          if (kc > -6502 && kc < 6502) {
            if (that.all[c + kc]) {
              that.all[c + kc].focus();
              setCurrentNo(c + kc)
              setShowAns(false)
            }
          } else {
            var add = kc < 0 ? -1 : 1;
            while (that.all[i]) {
              if (
                that.all[i].offsetLeft === posx &&
                that.all[i].offsetTop !== posy
              ) {
                that.all[i].focus();
                setCurrentNo(i)
                setShowAns(false) 
                break;
              }
              i += add;
            }
          }
        }
      }
    };
    this.list.addEventListener("keyup", this.keynav);
  };

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
    if(wordsData.length!=0){
      var datalist = new Gridnav('#datalist',setCurrentNo)

      const handleKeyDown = (event) => {
        const wordDiv=document.getElementById(`word-${wordsData[currentNo].number}`)
    
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

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };    
    }
  }, [wordsData,currentNo,showAns]);


  

 const Header = () => {
   return (
    <div className="hero__subtitle" style={{textAlign:"center", marginTop:"10px"}}>
    <h2 style={{fontSize:"30px",lineHeight:"30px", margin:"0px"}} >
    SpreadSheet2Cards 
    </h2>
    <small style={{fontSize:"13px"}}>
    Convert spreadsheet table into flash cards 
    </small>
    </div>
   )
 }


  return (
  
<div> 
<div style={{display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center", color:"white"}}>
    <Header/>
    <div>
    <button onClick={()=>{setShowTable(!showTable)}} style={{minWidth:"80px" }} >{showTable?"Hide table input":"Show table input"}</button>
    <button onClick={()=>shuffleWords()} style={{minWidth:"80px",margin:"10px" }}>Shuffle</button>
    <button onClick={()=>{
      for(let i=0;i<wordsData.length;i++){
        console.log(i+1)
        var a=document.getElementById(`word-${i+1}`)
        a.style.backgroundColor = "";
      }
    }} style={{minWidth:"80px" }}>Reset</button>
    <button onClick={()=>setShowInfo(!showInfo)} style={{minWidth:"80px",margin:"10px" }}>{showInfo?"Hide Info":"How to use the app?"}</button>
    </div>
   
    <div style={{fontSize:"14px",display:showInfo?"block":"none", border:"white 1px solid", padding:"10px",width:"400px", marginBottom:"10px"}}>
<strong>How to use it?</strong>
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
    <TableProcessor  wordsData={wordsData} setWordsData={setWordsData}/>
    </div>
  

  {wordsData.length!=0&&
   <ul id="datalist" data-amount="6" data-element="button" style={{display:"grid", gridTemplateColumns:"auto auto auto auto auto auto", gap:"10px",marginTop:"15px"}}>
     {wordsData.map((item) => (
        <li key={item.number} style={{listStyle:"none"}}>
          <button id={`word-${item.number}`} style={{minWidth:"150px",minHeight:"40px"}}>{item.word}</button>
        </li>
      ))
      } 
    </ul>
}

{
  showAns&&
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

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

