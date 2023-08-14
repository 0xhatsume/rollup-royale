import React from 'react';
import RoomSearch from './RoomSearch';
import TablePagination from './TablePagination';

const TableBrowserPanel = () => {
    return (
        <div className="
        pt-2 pb-1 px-2
        grid grid-cols-3
        items-center
        ">
            <button className="px-4 py-2
                text-xs sm:text-sm md:text-base
                text-white font-semibold
                bg-prime1
                border-orange-500 rounded-lg
                h-full w-[8rem] sm:w-auto mx-2 md:mr-7
                align-middle
                hover:bg-prime2 hover:text-white
                focus:ring-palegreen focus:border-palegreen
                focus:border-2
            ">
                Create Game + </button>
            <TablePagination/>
            <RoomSearch/>
        </div>
    )
}

export default TableBrowserPanel