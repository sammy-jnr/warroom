import { useState, useEffect, useContext } from 'react'
import closeIcon from "../../../Assets/Icons/closeIcon.svg"
import sendIcon from "../../../Assets/Icons/sendIcon.svg"
import ImageFullView from './ImageFullView'
import { PreviewImagesProps } from '../../../Interface'
import { MainContext } from "../../../context/GeneralContext"


const PreviewImages: React.FC<PreviewImagesProps> = (props) => {

  const [currentImageSRC, setcurrentImageSRC] = useState<string>("");
  const [showFullScreen, setshowFullScreen] = useState<boolean>(false);

  const {
    uploadImageLoading,
    setuploadImageLoading
  } = useContext(MainContext)

  useEffect(() => {
    if (props.previewArray.length > 0 && currentImageSRC === "") {
      setcurrentImageSRC(props.previewArray[0])
    }
  }, [props.previewArray]);



  const removeMediaFromPreviewArray = (src: string) => {
    let clonedImageArray = [...props.previewArray]
    if (currentImageSRC === src) {
      setcurrentImageSRC(clonedImageArray[props.previewArray.indexOf(src) + 1])
    }
    clonedImageArray.splice(props.previewArray.indexOf(src), 1)
    props.setpreviewArray(clonedImageArray)
    if (clonedImageArray.length === 0) {
      props.setshowPreviewImagePage(false)
    }
  }


  const mappedThumbnails = props.previewArray.map((src, index) => {
    if (src.substring(5, 10) === "image") {
      return (
        <div key={index} className="thumbnailDiv">
          <img src={src}
            alt=""
            className='thumbnailImgs hoverable'
            onClick={() => setcurrentImageSRC(src)}
          />
          <img src={closeIcon}
            alt=""
            className="removeThumbnail hoverable"
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

  return (
    <>
      {
        showFullScreen ?
          <ImageFullView currentImageSRC={currentImageSRC} setshowFullScreen={setshowFullScreen} />
          :
          <div className='previewImages'>
            {uploadImageLoading && <div className='uploadImageLoading'>
              <span className='uploadImageLoadingLoader'></span>
              <p>Uploading files</p>
            </div>
            }
            <img src={closeIcon}
              alt=""
              id='previewBackIcon'
              className='hoverable'
              onClick={() => {
                props.setshowPreviewImagePage(false)
                props.setpreviewArray([])
              }}
            />
            <div className="previewCurrentImage">
              {currentImageSRC &&
                <>
                  {
                    currentImageSRC.substring(5, 10) === "image"
                      ?
                      <img src={currentImageSRC} alt=""
                        onClick={() => setshowFullScreen(true)}
                        className='currentImg hoverable'
                      />
                      :
                      <video src={currentImageSRC}
                        onClick={() => setshowFullScreen(true)}
                        controls
                        autoPlay
                        className='currentImg'
                      />
                  }
                </>
              }
            </div>

            <div className="bottomHalfPreviewImg">
              <section className="previewImgThumbnailsContainer">
                {mappedThumbnails}
              </section>
              <section id='imageTextDiv'>
                <input type="text" placeholder='message...' onChange={(e) => props.setimageMessage(e.target.value)} />
                <img src={sendIcon} alt="" className='sendIcon hoverable'
                  onClick={() => {
                    props.sendMedia()
                    setuploadImageLoading(true)
                  }}
                />
              </section>
            </div>
          </div>
      }
    </>

  )
}

export default PreviewImages