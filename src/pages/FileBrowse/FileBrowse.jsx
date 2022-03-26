import React from 'react'
import { images } from '../../constants'
import './filebrowser.css'
const FileBrowse = ({image}) => {
  return (
    <div className="file-browse">
        <center>
            <img src={images.browse} className="browse-icon"/>
            <p className="browse-title">{image}</p>
        </center>
    </div>
  )
}

export default FileBrowse
