import axios from 'axios'

const URL = `${import.meta.env.VITE_URL_HOST}/api/ip`;
// ============================
// services IPK
// ============================
export class IPK {
    static async getAll(id_mahasiswa: string) {
        try {
            const res = await axios.get(`${URL}/ips?id_mahasiswa=${id_mahasiswa}`);
            const semuaSemester = res.data.semuaSemester;

            const data = [];

            let totalMutu = 0;
            let totalSks = 0;

            for (let semester = 1; semester <= 8; semester++) {
                const current = semuaSemester.find((item: any) => item.semester === semester);

                if (current && typeof current.ips === 'number') {
                    totalMutu += current.ips * (current.nilai?.[0]?.sks || 0);
                    totalSks += current.nilai?.[0]?.sks || 0;
                    const ipk = totalSks === 0 ? null : parseFloat((totalMutu / totalSks).toFixed(2));

                    data.push({
                        semester,
                        ips: parseFloat(current.ips.toFixed(2)),
                        ipk: ipk,
                    });
                } else {
                    data.push({
                        semester,
                        ips: null,
                        ipk: null,
                    });
                }
            }

            return data;

        } catch (error) {
            console.error("Gagal mengambil data IPS/IPK:", error);
            return [];
        }
    }

    static async getById(id_mahasiswa: string) {
        try {
            const res = await axios.get(`${URL}/ipk?id_mahasiswa=${id_mahasiswa}`);
            return res.data;
        } catch (error) {
            console.error("Gagal mengambil IPK:", error);
            return [];
        }
    }
}

// ============================
// services IPS
// ============================
export class IPS {
    static async getAll(id_mahasiswa: string) {
        try {
            const res = await axios.get(`${URL}/ips?id_mahasiswa=${id_mahasiswa}`);
            return res.data;
        } catch (error) {
            console.error("Gagal mengambil data IPS/IPK:", error);
            return [];
        }
    }

    static async getBySem(id_mahasiswa: string, semester: string) {
        try {
            const res = await axios.get(`${URL}/ips?id_mahasiswa=${id_mahasiswa}&semester=${semester}`);
            return res.data;
        } catch (error) {
            console.error("Gagal mengambil data IPS/IPK:", error);
            return [];
        }
    }
}