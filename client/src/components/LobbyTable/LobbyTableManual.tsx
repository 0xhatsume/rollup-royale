import React from 'react'

const TableRow = () => {
    return (
        <tr className="
        bg-lightbeige
        hover:bg-prime2 hover:text-alertred1
        border-purpgrey
        h-[3.8rem] min-h-[3.8rem]
        ">
                    
                    <td className="px-3 sm:px-6 py-4">
                        0123456789
                    </td>
                    <td className="px-3 sm:px-6">
                        0.1
                    </td>
                    <td className="px-3 sm:px-6">
                        10 x 10
                    </td>
                    <td className="px-3 sm:px-6">
                        2/4
                    </td>
                    <td className="px-3 sm:px-6">
                        <button className="
                                bg-prime1 rounded-lg text-white px-3 sm:px-6 py-1
                                hover:bg-palegreen
                            ">
                                Join
                            </button>
                    </td>
                </tr>
    )
}

const LobbyTableManual = () => {
    return (
        <div className="relative shadow-md 
        overflow-y-auto  h-[360px]
        bg-lightbeige
        border-prime2 rounded-lg border-2
        ">
            <table className="w-full 
                table-auto
                text-xs 
                sm:text-sm
                md:text-base
                text-center text-gray-500
                sm:font-bold
            ">
                <thead className="
                    text-white font-bold
                    border-b border-prime2
                ">
                    <tr className="
                    bg-greygreen
                    ">
                        <th scope="col" className="pl-4 pr-3 py-3">
                            Creator
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Stake (ETH)
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Board
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Players
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    <TableRow/>
                    <TableRow/>
                    <TableRow/>
                    <TableRow/>
                    <TableRow/>
                </tbody>
            </table>
        </div>
    )
}

export default LobbyTableManual