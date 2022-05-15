import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blank from './pages/Blank'
import Dashboard from './pages/Dashboard'
import MainLayout from './layout/MainLayout'
import Category from './pages/Category/Category';
import SubCategory from './pages/SubCategory/SubCategory';
import Products from './pages/Product/Products'
import Users from './pages/Users/Users'
import Banners from './pages/Banner/Banners'
import Congratulations from './pages/Congratulations/Congratulations'
import Holiday from './pages/Holiday/Holiday'
import Constants from './pages/ConstantPage/Constants'
import UserType from './pages/UserType/UserType'
import Regions from './pages/Regions/Regions'
import District from './pages/District/District'
import Settings from './pages/Settings/Settings'
import Push from './pages/Push/Push'
import Login from './pages/Login/Login'
import Event from './pages/Event/Event'
import Ads from './pages/Ads/Ads'
import Block from './pages/Block/Block';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    CssBaseline,
} from "@mui/material";
import { useState } from "react";

// Define theme settings
const light = {
    palette: {
        mode: "light",
        primary: {
            main: '#FF4D3C'
          },
        secondary: {
            main: '#000000'
          },
          text:{
            primary: "#000000"
          }
    },
};

const dark = {
    palette: {
        mode: "dark",
        primary: {
            main: '#FF4D3C'
          },
          secondary: {
            main: '#FFFFFF'
          },
          text:{
            primary: "#FFFFFF"
          }
    },
};

function App() {
    // The light theme is used by default
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    console.error=()=>{}
    console.warn=()=>{}
    console.log=()=>{}
    // This function is triggered when the Switch component is toggled
    const changeTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };
    return (
        <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<MainLayout changeTheme={changeTheme} isDarkTheme={isDarkTheme} />}>
                        <Route index element={<Category />} />
                        <Route path="category" element={<Category />} />
                        <Route path="subcategory" element={<SubCategory />} />
                        <Route path="products" element={<Products />} />
                        <Route path="users" element={<Users />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="banners" element={<Banners />} />
                        <Route path="congratulations" element={<Congratulations />} />
                        <Route path="holidays" element={<Holiday />} />
                        <Route path="constants" element={<Constants />} />
                        <Route path="usertype" element={<UserType />} />
                        <Route path="regions" element={<Regions />} />
                        <Route path="districts" element={<District />} />
                        <Route path="push" element={<Push />} />
                        <Route path="event" element={<Event />} />
                        <Route path="ads" element={<Ads />} />
                        <Route path="block" element={<Block />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
