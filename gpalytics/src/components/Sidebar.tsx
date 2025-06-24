import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles/Sidebar.css'
import LogoImg from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FiGrid, FiUser, FiEdit3, FiBarChart2, FiHelpCircle, FiLogOut, FiLogIn } from 'react-icons/fi';
import guestImg from '../assets/guest.png'

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}
type User = {
    _id: string;
    nama: string;
    email: string;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [getProfile, setGetProfile] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setGetProfile(user);
        }
    }, []);


    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [isOpen, onClose]);

    return (
        <div ref={sidebarRef} className={`col-md-2 sidebar position-fixed vh-100 bg-white shadow-sm p-3 d-flex flex-column ${isOpen ? 'active' : ''}`}>
            <div className='d-flex gap-3 align-items-center justify-content-center'>
                <img className='logoImg' src={LogoImg} alt="" />
                <h4 className="fw-bold m-0">GP<span className="text-primary">A</span>lytics</h4>
            </div>
            <div className="input-group search my-4">
                <span className="input-group-text bg-white border-end-0 rounded-start-pill">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
                <input type="text" className="form-control border rounded-end border-start-0 rounded-end-pill" placeholder="Search" />
            </div>

            <ul className="nav flex-column mb-4">
                <li className="nav-item my-1">
                    <NavLink to="/dashboard" className="button-scale-m nav-link nav-link-main d-flex align-items-center gap-2 default" end>
                        <FiGrid size={20} /> Dashboard
                    </NavLink>
                </li>
                <li className="nav-item my-1">
                    <NavLink to="/mahasiswa" className="button-scale-m nav-link nav-link-main d-flex align-items-center gap-2">
                        <FiUser size={20} /> Mahasiswa
                    </NavLink>
                </li>
                <li className="nav-item my-1">
                    <NavLink to="/update-nilai" className="button-scale-m nav-link nav-link-main d-flex align-items-center gap-2">
                        <FiEdit3 size={20} /> Update Nilai
                    </NavLink>
                </li>
                <li className="nav-item my-1">
                    <NavLink to="/statistik-akademik" className="button-scale-m nav-link nav-link-main d-flex align-items-center gap-2">
                        <FiBarChart2 size={20} /> Statistik Akademik
                    </NavLink>
                </li>
                <li className="nav-item my-1">
                    <NavLink to="/support-center" className="button-scale-m nav-link nav-link-main d-flex align-items-center gap-2">
                        <FiHelpCircle size={20} /> Support Center
                    </NavLink>
                </li>
            </ul>
            <div className="mt-auto miniaccount">
                <div className="d-flex align-items-center">
                    <img src={guestImg} className="rounded-circle me-2" alt="User" />
                    <div>
                        <div className="fw-semibold">{getProfile? getProfile.nama: 'Guest'}</div>
                        <span className="badge bg-warning text-dark">User</span>
                    </div>
                </div>
                {getProfile ? (
                    <a href="#" className="btn btn-outline-danger btn-sm mt-3 w-100"
                    onClick={() => {
                        localStorage.clear()
                        location.href = '/'
                    }}
                    >
                        <FiLogOut size={20} /> Log out
                    </a>
                ) : (
                    <a href="#" className="btn btn-outline-primary btn-sm mt-3 w-100"
                    onClick={() => {
                        location.href = '/signup'
                    }}
                    >
                        <FiLogIn size={20} /> Sign Up
                    </a>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
