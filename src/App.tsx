import "./Assets/general.css"
import Home from './Pages/Home/Home';
import Popup from './Pages/Popup/Popup';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Chat from './Pages/chat/Chat';
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <Router>
      <div className="App">
      <Popup/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route element={<ProtectedRoutes/>}>
          <Route path='/room/:roomID' element={<Chat/>}/>
          </Route>
        </Routes>
    </div>
    </Router>
  );
}

export default App;
