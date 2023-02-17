import { useContext } from 'react'
import "./Home.css"
import { MainContext } from "../../context/GeneralContext"



function Home() {
  const { setgeneralLoading, setpopupEvent } = useContext(MainContext)
  return (
    <div className='homeContainer'>
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