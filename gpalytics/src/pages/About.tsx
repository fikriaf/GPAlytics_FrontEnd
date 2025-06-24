import React from "react";
import "./styles/About.css"
const images = Object.entries(import.meta.glob("../assets/imgAbout/*.jpg", { eager: true, as: "url" }))
    .sort(([a], [b]) => {
    const getNumber = (name: string) => Number(name.match(/(\d+)/)?.[0] ?? 0);
    return getNumber(a) - getNumber(b);
    })
    .map(([_, url]) => url as string);

const About: React.FC = () => {
    return (
        <div className="vh-100 w-100 overflow-hidden">
        <div id="demo" className="carousel slide h-100" data-bs-ride="carousel">
            {/* Dots */}
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <button
                    key={index}
                    type="button"
                    data-bs-target="#demo"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Carousel Items */}
            <div className="carousel-inner h-100">
                {images.map((src, index) => (
                    <div
                    key={index}
                    className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
                    >
                    <img
                        src={src}
                        className="d-block w-100 h-100 object-fit-cover"
                        alt={`Slide ${index + 1}`}
                    />
                    </div>
                ))}
            </div>
            {/* Prev/Next controls */}
            <button className="carousel-control-prev ps-1" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span className="carousel-control-prev-icon fw-bold" aria-hidden="true"></span>
                <span className="visually-hidden">Sebelumnya</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span className="carousel-control-next-icon fw-bold" aria-hidden="true"></span>
                <span className="visually-hidden">Berikutnya</span>
            </button>
        </div>
        </div>
    );
};

export default About;
