import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
//import LobbyTable from './components/LobbyTable/LobbyTable';
import LobbyTable from './components/LobbyTable/LobbyTableManual';
import TableBrowserPanel from './components/LobbyTable/TableBrowserPanel';
import ChatWindow from './components/ChatWindow/ChatWindow';

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
            
            <div className="w-full md:w-[768px] mx-auto
              flex flex-col
              p-0 h-screen
              border-2 border-red-700
            ">
              <LobbyTable/>
              <TableBrowserPanel />
              <div className="border-prime2 border
              h-1/3 min-h-[240px] mt-1
              rounded-b-lg
              ">
                <ChatWindow />
              </div>
              </div>

          </main>
        <Footer />
    </>
  )
}

export default App
