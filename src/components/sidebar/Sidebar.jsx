import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { images } from '../../constants'
import sidebarNav from '../../configs/sidebarNav'
import { Button, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { ListItemIcon } from '@material-ui/core'
import './sidebar.css';
import { useTranslation } from "react-i18next";
import { i18n } from '../../pages/Language/langConfig';
import { DarkMode, Light, LightMode, LightSharp, NightlightSharp } from '@mui/icons-material'
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ changeTheme, isDarkTheme }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const location = useLocation()
    const { t } = useTranslation();
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1]
        const activeItem = sidebarNav.findIndex(item => item.section === curPath)
        window.scrollTo(0, 0);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem)
    }, [location])


    if(typeof localStorage.getItem('my_token') === 'undefined' || localStorage.getItem('my_token')==null || localStorage.getItem('my_token') == ''){
        window.location.href="/login"
    } 

    const [lang, setLang] = useState('tm');
    useEffect(() => {
        let l = localStorage.getItem('lang');
        if (l != null && typeof l !== 'undefined') {
            setLang(l);
            i18n.changeLanguage(l);
        } else {
            i18n.changeLanguage("tm");
        }
    }, []);

    const langChange = (ln) => {
        i18n.changeLanguage(ln);
        setLang(ln);
        localStorage.setItem('lang', ln);
    };

    const [tmVariant,setTmVariant] = useState('primary');
    const [ruVariant,setRuVariant] = useState('primary');
    const [enVariant,setEnVariant] = useState('primary');

    const disselect=()=>{
        setTmVariant('primary');
        setRuVariant('primary');
        setEnVariant('primary');
    }
    useEffect(()=>{
        disselect();
        if(lang==='tm'){
            setTmVariant('outlined');
        }
        if(lang==='ru'){
            setRuVariant('outlined');
        }
        if(lang==='en'){
            setEnVariant('outlined');
        }
    },[lang]);



    const logout=()=>{
        localStorage.setItem('my_token','');
        window.location.href='/login';
    }



    return (
        <Paper sx={{ height: '100vh', bottom: 0 }} style={{ maxHeight: '100vh', overflow: 'auto' }}>
            <div className="sideBarBg">
                <img src={images.logo} style={{height:"50px"}}/>
                <center><Typography variant="h5">Elişi admin</Typography></center>


                {

                    <List style={{ maxHeight: '100%', overflow: 'auto' }}>
                        {sidebarNav.map((nav, index) => (

                            <Link to={nav.link} key={`nav-${index}`}>
                                <ListItem button key={nav.text} selected={activeIndex == index}>
                                    <ListItemIcon color="action">
                                        {nav.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={t(nav.text)} />
                                </ListItem>
                            </Link>

                        ))}
                    </List>

                }

                <center><Button onClick={()=>logout()} startIcon={<LogoutIcon/>}>{t('Logout')}</Button></center>

                <center>
                    <br/>
                    <div>
                        <center>
                        <Button variant={tmVariant} onClick={()=>langChange('tm')}>
                            TM
                        </Button>
                        <Button variant={ruVariant} onClick={()=>langChange('ru')}>
                            RU
                        </Button>
                        <Button variant={enVariant} onClick={()=>langChange('en')}>
                            EN
                        </Button>
                        </center>
                    </div>
                    <br/>
                    {
                        isDarkTheme ?
                            <Button startIcon={<LightMode />} onClick={changeTheme}>{t('ligh_mode')}</Button>
                            :
                            <Button startIcon={<DarkMode />} onClick={changeTheme}>{t('dark_mode')}</Button>
                    }</center>

            </div>
        </Paper>
    )
}
export { useTranslation }
// This is the sidemenu component
function SideMenu() {
    return (
        <div>

        </div>
    );
}

export default Sidebar


