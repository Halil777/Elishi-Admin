import React from 'react';
import images from '../../constants/images';
import './empty.css';


const Empty = () => {
  return (
    <div className="emptyContainer">
      <center>
        <img src={images.empty} className='emptyImage' /> 
        <p>No data</p>
      </center>
    </div>
  )
}

export default Empty
