import React from 'react'
import closeIcon from "../../../Assets/Icons/closeIcon.svg"
import { ImageFullViewProps } from '../../../Interface'

const ImageFullView: React.FC<ImageFullViewProps> = (props) => {


  return (
    <div className='imageFullView'>
      <img src={closeIcon}
        alt=""
        id='previewBackIcon'
        onClick={() => props.setshowFullScreen(false)}
      />
      {
        props.currentImageSRC.substring(5, 10) === "image"
          ?
          <img src={props.currentImageSRC} alt="" className="imageFullViewImage" />
          :
          <video src={props.currentImageSRC} className="imageFullViewImage" controls autoPlay />
      }
    </div>
  )
}

export default ImageFullView