import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

const SOS = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [geolocationAvailable, setGeolocationAvailable] = useState(true);

  const fetchGeolocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setGeolocationAvailable(true);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          setGeolocationAvailable(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setGeolocationAvailable(false);
    }
  }, []);

  const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      });
      console.log("FCM Token:", token);
    } else {
      alert("Permission Denied");
    }
  };

  useEffect(() => {
    fetchGeolocation();
    requestPermission();

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      alert(
        `Notification: ${payload.notification.title} - ${payload.notification.body}`
      );
    });
  }, [fetchGeolocation]);
  return (
    <div>
      {latitude !== null && longitude !== null ? (
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geolocationAvailable && (
            <Marker position={[latitude, longitude]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default SOS;
