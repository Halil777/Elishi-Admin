import React, { useState, useEffect } from 'react';
import sidebarNav from '../../configs/sidebarNav'
import { Link, useLocation } from 'react-router-dom'
const AppSideBar = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const location = useLocation()

    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1]
        const activeItem = sidebarNav.findIndex(item => item.section === curPath)

        setActiveIndex(curPath.length === 0 ? 0 : activeItem)
    }, [location])
    return (
            <div class="sidebar">
                <br/>
                <div className="sidebar-item header">
                    <div className="sidebar-item-icon">
                    < i className = 'bx bxs-user' > </i>
                    </div>
                    <div className="sidebar-item-text">
                        Shageldi Alyyev
                    </div>
                </div>
                <br/>
                {
                    sidebarNav.map((nav, index) => (
                        <Link to={nav.link} key={`nav-${index}`} className={`sidebar-item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="sidebar-item-icon">
                                {nav.icon}
                            </div>
                            <div className="sidebar-item-text">
                                {nav.text}
                            </div>
                        </Link>
                    ))
                }
            </div>
    )
}

export default AppSideBar
