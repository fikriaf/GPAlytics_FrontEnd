import axios from "axios";

const URL = `${import.meta.env.VITE_URL_HOST}/api/rekomendasi`

export async function getRekomendasi(id_mahasiswa: string) {
    try {
        const res = await axios.get(`${URL}/${id_mahasiswa}`);
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
}