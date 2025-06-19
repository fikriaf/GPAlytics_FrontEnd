import { useEffect, useState } from "react";
import "./styles/GlobalLoader.css";

export default function GlobalLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
        setLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    if (!loading) return null;

    return (
        <div className="global-loader-overlay">
            <div className="spinner" />
        </div>
    );
}
