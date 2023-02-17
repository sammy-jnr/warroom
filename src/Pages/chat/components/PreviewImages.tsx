import { useState, useEffect, useContext } from 'react'
import closeIcon from "../../../Assets/Icons/closeIcon.svg"
import sendIcon from "../../../Assets/Icons/sendIcon.svg"
import ImageFullView from './ImageFullView'
import { MainContext } from "../../../context/GeneralContext"

interface PreviewImagesProps {
  setshowPreviewImagePage: React.Dispatch<React.SetStateAction<boolean>>,
  previewArray: string[],
  setpreviewArray: React.Dispatch<React.SetStateAction<string[]>>,
  sendMedia: () => void,
  setimageMessage: React.Dispatch<React.SetStateAction<string>>
}
const PreviewImages: React.FC<PreviewImagesProps> = (props) => {
  const {
    sendMediaToDB
  } = useContext(MainContext)

  const [currentImageSRC, setcurrentImageSRC] = useState<string>("");
  const [showFullScreen, setshowFullScreen] = useState<boolean>(false);


  useEffect(() => {
    if (props.previewArray.length > 0 && currentImageSRC === "") {
      setcurrentImageSRC(props.previewArray[0])
    }
  }, [props.previewArray]);



  const removeMediaFromPreviewArray = (src: string) => {
    let clonedImageArray = [...props.previewArray]
    if (currentImageSRC === src) {
      setcurrentImageSRC(clonedImageArray[props.previewArray.indexOf(src) - 1])
    }
    clonedImageArray.splice(props.previewArray.indexOf(src), 1)
    props.setpreviewArray(clonedImageArray)
    if (clonedImageArray.length === 0) {
      props.setshowPreviewImagePage(false)
    }
    console.log(clonedImageArray)
  }


  const mappedThumbnails = props.previewArray.map((src, index) => {
    if (src.substring(5, 10) === "image") {
      return (
        <div key={index} className="thumbnailDiv">
          <img src={src}
            alt=""
            className='thumbnailImgs'
            onClick={() => setcurrentImageSRC(src)}
          />
          <img src={closeIcon}
            alt=""
            className="removeThumbnail"
            onClick={() => removeMediaFromPreviewArray(src)}
          />
        </div>
      )
    }
    if (src.substring(5, 10) === "video") {
      return (
        <div key={index} className="thumbnailDiv">
          <video src={src}
            className='thumbnailImgs'
            onClick={() => setcurrentImageSRC(src)}
          />
          <img src={closeIcon}
            alt=""
            className="removeThumbnail"
            onClick={() => removeMediaFromPreviewArray(src)}
          />
        </div>
      )
    }
  })

  //TODO FIX THUMBNAIL SIZE ERROR
  return (
    <>
      {
        showFullScreen ?
          <ImageFullView currentImageSRC={currentImageSRC} setshowFullScreen={setshowFullScreen} />
          :
          <div className='previewImages'>
            <img src={closeIcon}
              alt=""
              id='previewBackIcon'
              onClick={() => {
                props.setshowPreviewImagePage(false)
                props.setpreviewArray([])
              }}
            />
            <div className="previewCurrentImage">
              {
                currentImageSRC.substring(5, 10) === "image"
                  ?
                  <img src={currentImageSRC} alt=""
                    onClick={() => setshowFullScreen(true)}
                    className='currentImg'
                  />
                  :
                  <video src={currentImageSRC}
                    onClick={() => setshowFullScreen(true)}
                    controls
                    autoPlay
                    className='currentImg'
                  />
              }
            </div>

            <div className="bottomHalfPreviewImg">
              <section className="previewImgThumbnailsContainer">
                {mappedThumbnails}
              </section>
              <section id='imageTextDiv'>
                <input type="text" placeholder='message...' onChange={(e) => props.setimageMessage(e.target.value)} />
                <img src={sendIcon} alt="" className='sendIcon'
                  onClick={props.sendMedia}
                />
              </section>
            </div>

          </div>
      }
    </>

  )
}

export default PreviewImages