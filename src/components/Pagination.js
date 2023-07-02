import React from 'react'

export default function Pagination({ setNextPage, setPrevPage }) {
    return (
        <div>
            {setPrevPage && <button onClick={setPrevPage}>Previous</button>}
            {setNextPage && <button onClick={setNextPage}>Next</button>}
        </div>
    )
}
