import { Typography } from '@material-ui/core'
import React from 'react'
import { images } from '../../constants'
import './filebrowser.css'
import {useTranslation} from '../../components/sidebar/Sidebar'
const FileBrowse = ({image}) => {
  const {t} = useTranslation();
  return (
    <div className="file-browse">
        <center>
            <img src={images.browse} className="browse-icon"/><br/>
            <Typography variant="paragraph" className="browse-title">{t(image)}</Typography>
        </center>
    </div>
  )
}

export default FileBrowse
