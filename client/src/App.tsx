import Navbar from './components/Navbar/Navbar';
import ConnectWalletButton from './components/ConnectWalletButton/CWButton';

function App() {

  return (
    <>
    
      <main className='
        bg-[#34222E]
        sm:bg-red-400 
        md:bg-orange-400
        lg:bg-yellow-200
        xl:bg-green-300
        2xl:bg-blue-400
        flex flex-col min-h-screen
        '>
          <Navbar/>
          <div className="w-full md:w-[768px] mx-auto
            p-2
            border-2 border-red-700
            h-fit
          ">
            Hello World
            </div>
        </main>
    </>
  )
}

export default App
