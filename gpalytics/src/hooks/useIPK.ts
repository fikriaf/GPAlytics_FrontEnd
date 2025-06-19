import { useEffect, useState } from "react";
import { IPK, IPS } from "../services/IP";
import { PrediksiIPK } from "../services/prediksi";
import { useProfile } from "./useProfile";

export function useIPKData() {
    const { getProfile } = useProfile();

    const [ipkTerakhir, setIpkTerakhir] = useState<number | null>(null);
    const [ipsTerakhir, setIpsTerakhir] = useState<number | null>(null);
    const [prediksiIPK, setPrediksiIPK] = useState<number | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [ipsMin, setIpsMin] = useState<number | null>(null);
    const [ipsMax, setIpsMax] = useState<number | null>(null);
    const [ipkMin, setIpkMin] = useState<number | null>(null);
    const [ipkMax, setIpkMax] = useState<number | null>(null);
    const [semesterInfo, setSemesterInfo] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!getProfile?._id) return;

            setIsLoading(true);

            const localKey = `ipkData-${getProfile._id}`;
            const cached = localStorage.getItem(localKey);

            if (cached) {
                const parsed = JSON.parse(cached);
                setData(parsed.result);
                setIpkTerakhir(parsed.resultIPK.ipk);
                setIpsTerakhir(parsed.resultIPS.ips);
                setPrediksiIPK(parsed.resultPrediksi.prediksi);
                setIpsMin(parsed.minIps)
                setIpsMax(parsed.maxIps)
                setIpkMin(parsed.minIpk)
                setIpkMax(parsed.maxIpk)
                setIsLoading(false);
                return;
            }

            const result = await IPK.getAll(getProfile._id);
            const resultIPK = await IPK.getById(getProfile._id);
            const semesterTerakhir = resultIPK.detail?.length ?? 0;
            const resultIPS = await IPS.getBySem(getProfile._id, semesterTerakhir.toString());
            const resultPrediksi = await PrediksiIPK(getProfile._id);

            setData(result);
            setIpkTerakhir(resultIPK.ipk);
            setIpsTerakhir(resultIPS.ips);
            setPrediksiIPK(resultPrediksi?.prediksi ?? null);

            const ipsValid = result.map(r => r.ips).filter((v): v is number => v !== null);
            const ipkValid = result.map(r => r.ipk).filter((v): v is number => v !== null);

            const minIps = ipsValid.length > 0 ? Math.min(...ipsValid) : 0;
            const maxIps = ipsValid.length > 0 ? Math.max(...ipsValid) : 4;
            const minIpk = ipkValid.length > 0 ? Math.min(...ipkValid) : 0;
            const maxIpk = ipkValid.length > 0 ? Math.max(...ipkValid) : 4;

            setIpsMin(minIps);
            setIpsMax(maxIps);
            setIpkMin(minIpk);
            setIpkMax(maxIpk);

            setSemesterInfo({
                maxIpsSemester: result.find(r => r.ips === maxIps)?.semester ?? "-",
                minIpsSemester: result.find(r => r.ips === minIps)?.semester ?? "-",
                maxIpkSemester: result.find(r => r.ipk === maxIpk)?.semester ?? "-",
                minIpkSemester: result.find(r => r.ipk === minIpk)?.semester ?? "-",
            });

            localStorage.setItem(localKey, JSON.stringify({
                result,
                resultIPK,
                resultIPS,
                resultPrediksi,
                minIps,
                maxIps,
                minIpk,
                maxIpk
            }));

            setIsLoading(false);
        };

        fetchData();
    }, [getProfile?._id]);

    return {
        isLoading,
        ipkTerakhir,
        ipsTerakhir,
        prediksiIPK,
        data,
        ipsMin,
        ipsMax,
        ipkMin,
        ipkMax,
        semesterInfo
    };
}
