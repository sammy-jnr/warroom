import { useState, useRef, useContext, useEffect } from 'react'
import downIcon from "../../../Assets/Icons/downIcon.svg"
import playIcon from "../../../Assets/Icons/playIcon.svg"
import { MainContext } from "../../../context/GeneralContext"
import { CurrentImageFullViewInterface, Message } from "../../../Interface"


function TextDisplay() {

  const scrollRef: React.Ref<HTMLDivElement> | null = useRef(null)
  const bottomRef: React.Ref<HTMLDivElement> | null = useRef(null)

  const {
    messages,
    name,
    numberOfNewMessages,
    setcurrentImageFullView
  } = useContext(MainContext)

  const [showNewUnreadMessage, setshowNewUnreadMessage] = useState<boolean>(
    scrollRef.current?.clientHeight === scrollRef.current?.scrollHeight ? false : true
  );
  const [showUreadMessagesNumber, setshowUreadMessagesNumber] = useState(false);


  useEffect(() => {
    controlScrollBehaviour()
  }, [messages])


  const onScroll = () => {
    setshowUreadMessagesNumber(false)
    if (scrollRef.current?.scrollTop && scrollRef.current?.clientHeight) {
      if ((scrollRef.current?.scrollHeight - scrollRef.current?.scrollTop - scrollRef.current?.clientHeight) <= (120)) {
        setshowNewUnreadMessage(false)
      } else {
        setshowNewUnreadMessage(true)
      }
    }
  }
  const controlScrollBehaviour = () => {
    if (scrollRef.current?.scrollTop && scrollRef.current?.clientHeight) {
      if ((scrollRef.current?.scrollHeight - scrollRef.current?.scrollTop - scrollRef.current?.clientHeight) <= (150)) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setshowNewUnreadMessage(false)
      } else {
        setshowUreadMessagesNumber(true)
        setshowNewUnreadMessage(true)
        console.log(showNewUnreadMessage)
      }
    }
  }
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setshowNewUnreadMessage(false)

  }

  const fullyDisplayImage = (item: Message) => {
    if (item.mediaType && item.mediaUrl)
      setcurrentImageFullView({
        src: item.mediaUrl,
        display: true,
        type: item.mediaType
      })
  }

  const mappedMessages = messages?.map((item, index) => {
    return (
      <div className={item.sender === name ? 'myMessages' : 'otherMessages'}>
        {
          item.mediaType === "image"
            ?
            <img src={item.mediaUrl}
              alt=""
              className="displayImages_img"
              onClick={() => fullyDisplayImage(item)}
            />
            :
            item.mediaType === "video"
              ?
              <>
                <video src={item.mediaUrl}
                  className="displayVideo_Video"
                  onClick={() => fullyDisplayImage(item)}
                />
                <img src={playIcon} alt=""
                  onClick={() => fullyDisplayImage(item)}
                  id='videoPlayIcon' />
              </>
              :
              <p>{item.message}</p>
        }
      </div>
    )
  })


  return (
    <div className='displayChatsContainer' ref={scrollRef} onScroll={() => onScroll()}>
      {mappedMessages}
      <div ref={bottomRef}></div>
      {showNewUnreadMessage &&
        <div className="unReadMeassagesDisplay">
          {showUreadMessagesNumber && <div>
            {numberOfNewMessages}
          </div>}
          <img src={downIcon} alt="" className="downIcon" onClick={() => scrollToBottom()} />
        </div>
      }

    </div>
  )
}

export default TextDisplay