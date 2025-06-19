import { useState } from 'react';

export function useAlert(timeout = 3000) {
    const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

    const showSuccess = (message: string) => {
        setAlert({ type: 'success', message });
        autoClear();
    };

    const showError = (message: string) => {
        setAlert({ type: 'danger', message });
        autoClear();
    };

    const autoClear = () => {
        setTimeout(() => setAlert(null), timeout);
    };

    return { alert, showSuccess, showError };
}
