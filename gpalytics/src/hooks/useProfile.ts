import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = `${import.meta.env.VITE_URL_HOST}/api`;

export function useProfile() {
    const [getProfile, setGetProfile] = useState<any>(null);
    const [updateProfile, setUpdateProfile] = useState({
        photo: '',
        nama: '',
        email: '',
        password: '',
        gender: '',
        angkatan: '',
        umur: '',
        nim: '',
        prodi: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
        const userString = localStorage.getItem('user');
        if (!userString) return;

        const getEmail = JSON.parse(userString);
        try {
            const response = await axios.get(`${URL}/mahasiswa/${getEmail.email}`);
            if (response.data) {
                setGetProfile(response.data);
            }
        } catch (err) {
            console.error("Gagal mengambil data profile:", err);
        }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (getProfile) {
        setUpdateProfile({
            photo: getProfile.photo || '',
            nama: getProfile.nama || '',
            email: getProfile.email || '',
            password: getProfile.password || '',
            gender: getProfile.gender || '',
            angkatan: getProfile.angkatan || '',
            umur: getProfile.umur || '',
            nim: getProfile.nim || '',
            prodi: getProfile.prodi || ''
        });
        }
    }, [getProfile]);

    return {
        getProfile,
        updateProfile,
        setUpdateProfile,
        setGetProfile,
    };
}
