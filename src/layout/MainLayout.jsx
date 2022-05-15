import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import TopNav from '../components/topnav/TopNav'
import { Grid, Paper, Stack } from '@mui/material'
import Navbar from '../components/Drawer/Navbar'
import './main-layout.css'

const MainLayout = ({changeTheme,isDarkTheme}) => {
    return (
        <div>
            <div className="side">
                <Sidebar changeTheme={changeTheme} isDarkTheme={isDarkTheme}/>
            </div>
           
            <div className="main">
                {/* <Navbar /> */}
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout
