import { useCallback } from 'react';

export function useBobotMutu() {
    const getBobotMutu = useCallback((nilai: number): number => {
        if (nilai >= 90) return 4.0;
        if (nilai >= 80) return 3.7;
        if (nilai >= 75) return 3.3;
        if (nilai >= 70) return 3.0;
        if (nilai >= 65) return 2.7;
        if (nilai >= 60) return 2.3;
        if (nilai >= 55) return 2.0;
        if (nilai >= 50) return 1.7;
        if (nilai >= 40) return 1.0;
        return 0.0;
    }, []);

    return getBobotMutu;
}
