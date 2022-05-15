import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import HelpIcon from '@mui/icons-material/Help';
import {useTranslation} from '../../components/sidebar/Sidebar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  

const UrlGuide = () => {
  const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button startIcon={<HelpIcon/>} onClick={handleClickOpen}>
          {t('Help?')}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {t('Help center')}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {t('Close')}
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <Typography variant="h4">
                {t('Why we need Url?')}
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
          <Typography variant="h6">
                {t('url1')}
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
          <Typography variant="h4">
               {t('How to enter url?')}
          </Typography>
          </ListItem>
          <Divider />
          <ListItem>
          <Typography variant="h6">
                {t('url2')}
                <br/><font color="orange"><b>https://www.instagram.com/yarmarka_masterov_tm/</b></font> {t('or')} <font color="orange"><b>https://www.100haryt.com/</b></font>
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
          <Typography variant="h6">
                {t('url4')}
                <br/><i>{t('url5')} </i>"<font color="orange"><b>?</b></font>"
                <br/>{t('url6')} <font color="orange"><b>?category_id=22</b></font><br/><i>{t('url7')}</i>
                <br/>{t('url8')} <font color="orange"><b>?sub_category_id=12</b></font><br/><i>{t('url9')}</i>
                <br/>{t('url10')} <font color="orange"><b>?user_id=15</b></font><br/><i>{t('url11')}</i>
                <br/>{t('url12')} <font color="orange"><b>?product_id=17</b></font><br/><i>{t('url13')}</i>
                <br/>{t('url14')} <font color="orange"><b>?constant_id=20</b></font><br/><i>{t('url15')}</i>
                
          </Typography>
          </ListItem>
        </List>
      </Dialog>
    </div>
  )
}

export default UrlGuide
