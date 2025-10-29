import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_KEY = "8mX7gZlFBm0bJ7jjhjg8atBpr5eGql72xYvIMpT4";
  const [spots, setSpots] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [spotData, setSpotData] = useState(null);
  const [loadingSpots, setLoadingSpots] = useState(false);
  const [loadingSpotData, setLoadingSpotData] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const getSpots = async () => {
      try {
        setLoadingSpots(true);
        setSpots(null);
        const response = await axios.get("https://api.iotebe.com/v2/spot", {
          headers: { "x-api-key": API_KEY },
        });
        setSpots(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSpots(false);
      }
    };
    getSpots();
  }, []);

  useEffect(() => {
    const getSpotData = async () => {
      try {
        setLoadingSpotData(true);
        setSpotData(null);
        const response = await axios.get(
          `https://api.iotebe.com/v2/spot/${selectedSpotId}/ng1vt/global_data/data`,
          {
            headers: { "x-api-key": API_KEY },
          }
        );
        setSpotData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSpotData(false);
      }
    };
    if (selectedSpotId) {
      getSpotData();
    }
  }, [selectedSpotId]);

  const lastSpotData = spotData ? spotData[0] : null;

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Modo Claro" : "🌙 Modo Escuro"}
      </button>

      <h1>Ponto de Coleta</h1>

      {loadingSpots && <h1 className="loading">Carregando pontos...</h1>}

      {spots && (
        <div>
          <select
            name="spot"
            onChange={(e) => setSelectedSpotId(e.target.value)}
          >
            <option value="">Selecione um ponto de coleta</option>
            {spots.map((spot) => (
              <option key={spot.spot_id} value={spot.spot_id}>
                {spot.spot_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingSpotData && <h1 className="loading">Carregando dados...</h1>}

      {lastSpotData && (
        <div className="box">
          <h1>Dados do ponto de coleta</h1>
          <h3>Data: {new Date(lastSpotData.timestamp).toLocaleString()}</h3>
          <h3>Temperatura: {lastSpotData.temperature}°C</h3>
          <h3>Aceleração Axial: {lastSpotData.acceleration_axial}</h3>
          <h3>Aceleração Horizontal: {lastSpotData.acceleration_horizontal}</h3>
          <h3>Aceleração Vertical: {lastSpotData.acceleration_vertical}</h3>
          <h3>Velocidade Axial: {lastSpotData.velocity_axial}</h3>
          <h3>Velocidade Horizontal: {lastSpotData.velocity_horizontal}</h3>
          <h3>Velocidade Vertical: {lastSpotData.velocity_vertical}</h3>
        </div>
      )}
    </div>
  );
}

export default App;