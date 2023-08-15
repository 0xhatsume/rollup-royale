import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
//import LobbyTable from './components/LobbyTable/LobbyTable';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from './pages/Lobby';
import GameRoom from './pages/GameRoom';

function App() {

  return (
    <>
      <Navbar/>
        <main className='
          bg-[#34222E]
          sm:bg-red-400 
          md:bg-orange-400
          lg:bg-yellow-200
          xl:bg-green-300
          2xl:bg-background1
          flex flex-col min-h-screen
          pt-[88px]
          '>
          <Router>
              <Routes>
                <Route path='/' element={<Lobby/>}/>
                <Route path="/game/:id" element={<GameRoom />} />
              </Routes>
            </Router>
          </main>
      <Footer />
    </>
  )
}

export default App
