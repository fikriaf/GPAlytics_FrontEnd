import axios from "axios";

const URL = `${import.meta.env.VITE_URL_HOST}/api/mata-kuliah`

export class mataKuliah {
    static async getAll() {
        try {
            const res = await axios.get(URL);
            return res.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}