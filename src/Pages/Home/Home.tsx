import React, { useContext, useState, useEffect } from 'react'
import "./Home.css"
import { MainContext } from "../../context/GeneralContext"
import questionMark from "../../Assets/Icons/questionMark.svg"
import { Link } from "react-router-dom";


function Home() {
  const [showHomePopup, setshowHomePopup] = useState(false);
  const { setgeneralLoading, setpopupEvent } = useContext(MainContext)

  useEffect(() => {
    const closeHomePopup = (e: MouseEvent) => {
      if((e.target as any).className !== "questionMark"){
        setshowHomePopup(false)
      }
    }
    window.addEventListener("click",(e) => closeHomePopup(e))
  return () => {
    window.removeEventListener("click",(e) => closeHomePopup(e))
  }
  }, []);
  

  return (
    <div className='homeContainer'>
      <img src={questionMark}
        alt=""
        className="questionMark"
        onClick={()=>setshowHomePopup(prev => !prev)} 
      />
      {showHomePopup &&
        <div className='homePopup'>
          <Link to={"/instructions"} className="links">
            <p className="homeopupItems">Instructions</p>
          </Link>
          <Link to={"/contact"} className="links">
            <p className="homeopupItems">Contact</p>
          </Link>
        </div>
      }
      <div className='homeContainerTop'>
        <h1>War Room</h1>
      </div>
      <div className='homeContainerBottom'>
        <div className="homeButtonDiv">
          <button className="homeButtons"
            id="createBtn"
            onClick={() => {
              setgeneralLoading(true)
              setpopupEvent("createRoom")
            }}
          >Create room</button>
          <button
            className="homeButtons"
            id="joinBtn"
            onClick={() => {
              setgeneralLoading(true)
              setpopupEvent("joinRoom")
            }}
          >Join room</button>
        </div>
      </div>
    </div>
  )
}

export default Home