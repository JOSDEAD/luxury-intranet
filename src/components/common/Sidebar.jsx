import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import menu from "../Data/menu.json";
import menu2 from "../Data/menu2.json";

function Sidebar(props) {

    const [isSidebarMini, setIsSidebarMini] = useState(false);
    const [menuData, setMenuData] = useState([...menu?.menu]);
    const [darkLightMode, setDarkLightMode] = useState("light");
    const [updateRtl, setUpdateRtl] = useState(false);

    const navigate = useNavigate();
    // Base URL for routing (Vite uses import.meta.env.BASE_URL)
    const baseUrl = import.meta.env.BASE_URL || '/';

    useEffect(() => {
        window.document.children[0].setAttribute("data-theme", "light");
    }, []);

    function openChildren(id) {
        var otherTabs = document.getElementsByClassName("has-children")
        if (otherTabs) {
            for (var i = 0; i < otherTabs.length; i++) {
                if (otherTabs[i].id !== id) {
                    otherTabs[i].className = otherTabs[i].className.replace(" show", "");
                    if (otherTabs[i].parentElement.children.length > 1) {
                        otherTabs[i].parentElement.children[0].setAttribute("aria-expanded", "false")
                    }
                }
            }
        }
        var menutab = document.getElementById(id)
        if (menutab) {
            if (menutab.classList.contains("show")) {
                menutab.classList.remove("show")
                if (menutab.parentElement.children.length > 1) {
                    menutab.parentElement.children[0].setAttribute("aria-expanded", "false")
                }
            } else {
                menutab.classList.add("show")
                if (menutab.parentElement.children.length > 1) {
                    menutab.parentElement.children[0].setAttribute("aria-expanded", "true")
                }
            }
        }
    }
    function openChildren1(id) {
        var otherTabs = document.getElementsByClassName("has-children")
        if (otherTabs) {
            for (var i = 0; i < otherTabs.length; i++) {
                otherTabs[i].className = otherTabs[i].className.replace(" show", "");
            }
        }
        var menutab = document.getElementById(id)
        if (menutab) {
            menutab.classList.add("show")
            if (menutab.parentElement.children.length > 1) {
                menutab.parentElement.children[0].setAttribute("aria-expanded", "true")
            }
        }
    }
    // function closeChildren() {
    //     var otherTabs = document.getElementsByClassName("has-children")
    //     if (otherTabs) {
    //         for (var i = 0; i < otherTabs.length; i++) {
    //             otherTabs[i].className = otherTabs[i].className.replace(" show", "");
    //             if (otherTabs[i].parentElement.children.length > 1) {
    //                 otherTabs[i].parentElement.children[0].setAttribute("aria-expanded", "false")
    //             }
    //         }
    //     }
    // }
    function GotoChangeMenu(val) {
        if (val === "UI Components") {
            // Navigate to UI Components section
            navigate(`${baseUrl}ui-alerts`);
            setMenuData([...menu2.menu2]);
        } else {
            // Navigate to HR Dashboard
            navigate(`${baseUrl}hr-dashboard`);
            setMenuData([...menu.menu]);
        }
    }
    function onChangeDarkMode() {
        if (window.document.children[0].getAttribute("data-theme") === "light") {
            window.document.children[0].setAttribute("data-theme", "dark")
            setDarkLightMode("dark");
        } else {
            window.document.children[0].setAttribute("data-theme", "light")
            setDarkLightMode("light")

        }
    }
    function onChangeRTLMode() {
        if (document.body.classList.contains("rtl_mode")) {
            document.body.classList.remove("rtl_mode");
        } else {
            document.body.classList.add("rtl_mode");
        }
        setUpdateRtl(!updateRtl);
    }
    const { activekey } = props;
    return (
        <div id="mainSideMenu" className={`sidebar px-4 py-4 py-md-5 me-0 open ${isSidebarMini ? "sidebar-mini" : ""}`}>
            <div className="d-flex flex-column h-100">
                <a href="dashboard" className="mb-0 brand-icon">
                    <img src="/logo.png" alt="Logo" style={{ width: '70px' }} />
                <span className="logo-text">Luxury Lights</span>
        </a>
        <button
            type="button"
            className="btn btn-link sidebar-mini-btn text-light"
            onClick={() => { setIsSidebarMini(!isSidebarMini); }}
        >
            <span className="ms-2"><i className="icofont-bubble-right"></i></span>
        </button>
        <ul className="menu-list flex-grow-1 mt-3">
                    {
                        menuData.map((d, i) => {
                            if (d.isToggled) {
                                return <li key={"shsdg" + i}>
                                    <a className={`m-link `} href="#!" onClick={(e) => { e.preventDefault(); GotoChangeMenu(d.name); }}>
                                        <i className={d.iconClass}></i>
                                        <span>{d.name}</span>
                                    </a>
                                </li>
                            }
                            if (d.children.length === 0) {
                                return <li key={"dsfshsdg" + i} className=" collapsed">
                            <Link to={`${baseUrl}${d.routerLink[0]}`} className={`m-link ${(d.routerLink[0] === activekey) ? "active" : ""}`} >
                                        <i className={d.iconClass}></i>
                                        <span>{d.name}</span>
                                        <span className="arrow icofont-dotted-down ms-auto text-end fs-5">
                                        </span>
                                    </Link>
                                </li>
                            }
                            return <li key={"shsdg" + i} className=" collapsed">
                                <a className={`m-link ${d.children.filter((d) => "/" + d.routerLink[0] === activekey).length > 0 ? "active" : ""}`} href="#!" onClick={(e) => { e.preventDefault(); openChildren("menu-Pages" + i) }}>
                                    <i className={d.iconClass}></i>
                                    <span>{d.name}</span>
                                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5">
                                    </span>
                                </a>
                                {
                                    d.children.length > 0 ?
                                        <ul className="sub-menu collapse has-children" id={"menu-Pages" + i}>
                                            {d.children.map((data, ind) => {
                                                if (d.children.length > 0) {
                                                    if (activekey === "/" + data.routerLink[0]) {
                                                        setTimeout(() => {
                                                            openChildren1("menu-Pages" + i)
                                                        }, 500);
                                                    }

                                                }
                                                return <li key={"jfdgj" + ind}>
                                                    <Link className={activekey === `/${data.routerLink[0]}` ? "ms-link active" : "ms-link"} to={`${baseUrl}${data.routerLink[0]}`}> <span>{data.name}</span></Link>
                                                </li>

                                            })}
                                        </ul>
                                        : null
                                }

                            </li>
                        })
                    }


                </ul>
                <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-center justify-content-center">
                        <div className="form-check form-switch theme-switch">
                            <input className="form-check-input" type="checkbox" checked={darkLightMode === "dark" ? true : false} id="theme-switch" onChange={() => { onChangeDarkMode(); }} />
                            <label className="form-check-label" htmlFor="theme-switch">Enable Dark Mode!</label>
                        </div>
                    </li>
                    <li className="d-flex align-items-center justify-content-center">
                        <div className="form-check form-switch theme-rtl">
                            <input className="form-check-input" type="checkbox" checked={document.body.classList.contains("rtl_mode")} id="theme-rtl" onChange={() => { onChangeRTLMode(); }} />
                            <label className="form-check-label" htmlFor="theme-rtl">Enable RTL Mode!</label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}


export default Sidebar