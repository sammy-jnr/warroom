import { useContext, useEffect } from 'react'
import { MainContext } from "../../context/GeneralContext"
import "./Notification.css"

const Notification = () => {
  const {
    notificationObj,
    setnotificationObj

  } = useContext(MainContext)


  useEffect(() => {
    if (!notificationObj?.status) return
    let notificationTimeout: NodeJS.Timeout
    notificationTimeout = setTimeout(() => {
      setnotificationObj({
        backgroundColor: "",
        text: "",
        status: false,
        time: 0,
        fontSize: 0
      })
    }, notificationObj.time)
    return () => {
      clearTimeout(notificationTimeout)
    }
  }, [notificationObj])


  return (
    <>
      {notificationObj &&
        <div className='NotificationContainer'
          style={{
            backgroundColor: notificationObj?.backgroundColor,
            fontSize: notificationObj?.fontSize,
            padding: notificationObj?.fontSize < 16 ? 5 : ""

          }}
        >
          {notificationObj?.text}
        </div>
      }
    </>
  )
}

export default Notification