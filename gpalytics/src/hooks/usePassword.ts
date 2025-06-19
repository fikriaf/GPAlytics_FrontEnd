import { useState } from 'react';

export function usePassword(initial = false) {
    const [showPassword, setShowPassword] = useState(initial);
    const togglePassword = () => setShowPassword(v => !v);
    return [showPassword, togglePassword] as const;
}