import { useState, useEffect, useRef, useContext } from 'react'
import "./Chat.css"
import menuWhiteIcon from "../../Assets/Icons/menuWhite.svg"
import closeIcon from "../../Assets/Icons/closeIcon.svg"
import copyIcon from "../../Assets/Icons/copyIcon.svg"
import Menu from './components/Menu'
import TextArea from './components/TextArea'
import TextDisplay from './components/TextDisplay'
import ShowEmoji from './components/ShowEmoji'
import { EmojiClickData } from "emoji-picker-react"
import { MainContext } from "../../context/GeneralContext"
import PreviewImages from './components/PreviewImages'
import FullView from './components/FullView'



function Chat() {

  const inputRef: React.Ref<HTMLTextAreaElement> | null = useRef(null)

  const filesRef: React.Ref<HTMLInputElement> | null = useRef(null)

  const {
    setnotificationObj,
    cookies,
    sendMediaToDB,
    name,
    creator,
    currentImageFullView,
    setcurrentImageFullView
  } = useContext(MainContext)

  const [showMenu, setshowMenu] = useState<boolean>(false);
  const [showSelectEmojiPage, setshowSelectEmojiPage] = useState<boolean>(false);
  const [choosenEmoji, setchoosenEmoji] = useState<EmojiClickData | undefined>();
  const [showCopyLinkText, setshowCopyLinkText] = useState<boolean>(false);
  const [message, setmessage] = useState("")
  const [showPreviewImagePage, setshowPreviewImagePage] = useState(false);

  const [previewArray, setpreviewArray] = useState<string[]>([]);

  const [imageMessage, setimageMessage] = useState<string>("");

  const [uploadedFiles, setuploadedFiles] = useState<FileList>();


  useEffect(() => {
    if (name === creator) {
      setshowCopyLinkText(true)
    }
  }, [creator]);

  useEffect(() => {
    if (!choosenEmoji) return
    inputRef.current?.focus()
    if (inputRef.current && choosenEmoji?.emoji) {
      let firstHalfOfTheValue = inputRef.current.value.substring(0, inputRef.current.selectionStart)
      let secondHalfOfTheValue = inputRef.current.value.substring(inputRef.current.selectionStart, inputRef.current.value.length)
      const finalText = firstHalfOfTheValue + choosenEmoji.emoji + secondHalfOfTheValue
      inputRef.current.value = finalText
      setmessage(finalText)
      setchoosenEmoji(undefined)
    }
  }, [choosenEmoji]);

  // delete the previous file from file input so that "onchange" will be called to read the new files
  useEffect(() => {
    if (showPreviewImagePage) return
    if (filesRef.current)
      filesRef.current.value = ""
  }, [showPreviewImagePage]);

  const clearInputField = () => {
    if (inputRef.current)
      inputRef.current.value = ""
  }

  // filereader for the preview for client
  const onNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    let largeFilesCount = 0
    if (files) {
      setuploadedFiles(files)
      Object.keys(files).forEach(i => {
        const file = files[Number(i)]
        console.log(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          let url: string
          if (typeof (e.target?.result) === "string") {
            url = e.target?.result
            setpreviewArray(prev => [...prev, url])
          }
        }
        reader.readAsDataURL(file)
        if (files[Number(i)].size > 102400000) {
          largeFilesCount += 1
          console.log(files[Number(i)])
        }
      })
      if (largeFilesCount > 0) {
        setnotificationObj({
          backgroundColor: "red",
          text: largeFilesCount === 1 ? "File is greater than 100MB" : "Some files are greater than 100MB!",
          status: true,
          time: 5000,
          fontSize: 14
        })
      }
    }
    setshowPreviewImagePage(true)
  }

  // get the click event from previewImages and call the sendMediaToDB function here
  const sendMedia = () => {
    let formData = new FormData()
    if (!uploadedFiles) return
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append("files", uploadedFiles[i])
    }
    formData.append("messages", imageMessage)
    formData.append("roomId", cookies.roomId)
    formData.append("joinPassword", cookies.joinPassword)
    if (name)
      formData.append("sender", name)
    sendMediaToDB(formData, imageMessage)
  }


  return (
    <div className='chatContainer'>
      {currentImageFullView?.display && <FullView />}
      {showPreviewImagePage && <PreviewImages setshowPreviewImagePage={setshowPreviewImagePage} previewArray={previewArray} setpreviewArray={setpreviewArray} sendMedia={sendMedia} setimageMessage={setimageMessage} />}
      <img src={menuWhiteIcon} alt="" className="menuIcon" onClick={() => setshowMenu(true)} />
      {showMenu && <Menu setshowMenu={setshowMenu} />}
      {showCopyLinkText && <div className="copyRoomLinkDiv">
        <div>
          <p><b>Room Id: </b>{cookies.roomId}</p>
          <img src={copyIcon}
            alt=""
            className='copyIcon'
            onClick={() => {
              navigator.clipboard.writeText(cookies.roomId)
              setnotificationObj({
                backgroundColor: "green",
                text: "copied!",
                status: true,
                time: 2000,
                fontSize: 16
              })
            }}
          />
        </div>
        <img src={closeIcon} alt=""
          className="closeLink"
          onClick={() => setshowCopyLinkText(false)}
        />
      </div>}
      <div className="fullChatArea"
        style={{
          height: !showCopyLinkText ? "calc(100%)" : "calc(100% - 70px)"
        }}
      >
        <div className="chatArea2">
          <Menu setshowMenu={setshowMenu} />
        </div>
        <div className="chatArea1">
          {showSelectEmojiPage && <ShowEmoji setchoosenEmoji={setchoosenEmoji} />}
          <TextDisplay />
          <TextArea
            clearInputField={clearInputField}
            inputRef={inputRef}
            setshowSelectEmojiPage={setshowSelectEmojiPage}
            message={message} setmessage={setmessage}
            setshowPreviewImagePage={setshowPreviewImagePage}
            onNewFile={onNewFile}
            filesRef={filesRef}
          />
        </div>

      </div>
    </div>
  )
}

export default Chat