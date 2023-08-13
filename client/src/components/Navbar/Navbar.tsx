//import React from 'react';
import { Navbar } from 'flowbite-react';
import ConnectWalletButton from '../ConnectWalletButton/CWButton';

const CustomNavBar = () => {
    return (
        <Navbar className='bg-background1'>
            <Navbar.Brand href={import.meta.env.VITE_HOSTSITE || "localhost:3000"}>
                <img
                    alt="Loot Royale Logo"
                    className="mr-3 h-fit"
                    src="lootroyalelogo.jpg"
                />
                </Navbar.Brand>
            
            <div className="flex md:order-2">
                <ConnectWalletButton/>
                <Navbar.Toggle className="hover:bg-green-400" />
            </div>

            {/* <Navbar.Collapse>
                <Navbar.Link
                active
                href="#"
                >
                <p>
                    Home
                </p>
                </Navbar.Link>
                <Navbar.Link href="#">
                About
                </Navbar.Link>
                <Navbar.Link href="#">
                Services
                </Navbar.Link>
                <Navbar.Link href="#">
                Pricing
                </Navbar.Link>
                <Navbar.Link href="#">
                Contact
                </Navbar.Link>
            </Navbar.Collapse> */}
            
        </Navbar>
    )
}

export default CustomNavBar