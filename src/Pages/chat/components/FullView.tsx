import { useState, useEffect, useRef, useContext } from 'react'
import closeIcon from "../../../Assets/Icons/closeIcon.svg"
import { MainContext } from "../../../context/GeneralContext"


// interface ImageFullViewProps {
//   currentImageSRC:string,
//   setshowFullScreen: React.Dispatch<React.SetStateAction<boolean>>
// }
const FullView: React.FC = () => {

  const {
    currentImageFullView,
    setcurrentImageFullView
  } = useContext(MainContext)

  return (
    <div className='imageFullView'>
      <img src={closeIcon}
        alt=""
        id='previewBackIcon'
        onClick={() => setcurrentImageFullView(undefined)}
      />
      {
        currentImageFullView?.type === "image"
          ?
          <img src={currentImageFullView.src} alt="" className="imageFullViewImage" />
          :
          <video src={currentImageFullView?.src} className="imageFullViewImage" controls autoPlay />
      }
    </div>
  )
}

export default FullView