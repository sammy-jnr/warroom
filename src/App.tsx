import "./Assets/general.css"
import Home from './Pages/Home/Home';
import Popup from './Pages/Popup/Popup';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Chat from './Pages/chat/Chat';
import ProtectedRoutes from "./ProtectedRoutes";
import Notification from "./Pages/Notification/Notification";


function App() {
  return (
    <Router>
      <div className="App">
        <Popup />
        <Notification />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/room' element={<Chat />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
