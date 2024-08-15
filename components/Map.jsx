import { useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { map } from "leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

import styles from "./Map.module.css";

//*
const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
        .map((char) => String.fromCharCode(char - 127397).toLowerCase())
        .join("");
    return (
        <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
};

//*
function Map() {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState([41.5, 22]);

    //* always have all my hooks at the very top to keep the code more organized.
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    //*
    const [mapLat, mapLng] = useUrlPosition();

    //*useEffect
    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );

    useEffect(
        function () {
            if (geolocationPosition)
                setMapPosition([
                    geolocationPosition.lat,
                    geolocationPosition.lng,
                ]);
        },
        [geolocationPosition]
    );

    //*return
    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "Loading..." : "Use your position "}
                </Button>
            )}
            <MapContainer
                center={mapPosition}
                zoom={7}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker
                        position={[city.position.lat, city.position.lng]}
                        key={city.id}
                    >
                        <Popup>
                            <span>
                                {city.emoji ? flagemojiToPNG(city.emoji) : ""}
                            </span>{" "}
                            <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
}

function DetectClick(e) {
    const navigate = useNavigate();

    useMapEvent({
        click: (e) => {
            console.log(e);
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    });
}

export default Map;

//
