import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import "../../assets/css/map.css";

// JS modules
import { initMap, destroyMap } from "../../assets/js/map/map.init";

import { getLocation } from "../../assets/js/map/map.location";
import { loadSampleData } from "../../assets/js/map/map.station";
import { findRoutes } from "../../assets/js/map/map.route";

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  // ==============================
  // INIT MAP
  // ==============================
  useEffect(() => {
    if (initialized.current) return;

    if (!mapRef.current) return;

    initialized.current = true;

    initMap(mapRef.current);

    return () => {
      destroyMap();
      initialized.current = false;
    };
  }, []);

  // ==============================
  // HANDLERS
  // ==============================
  const handleGetLocation = () => {
    getLocation();
  };

  const handleLoadStations = () => {
    loadSampleData();
  };

  const handleFindRoutes = () => {
    findRoutes();
  };

  return (
    <div className="ev-map-page">
      {/* SIDEBAR */}
      <div id="evSidebar">
        {/* HEADER */}
        <div className="ev-sidebar-header">
          <div className="ev-tag">⚡ ECO-BIKE</div>

          <h1 className="ev-sidebar-title">
            Hai đường đi ngắn nhất
            <br />
            đến trạm sạc
          </h1>

          <Link to="/search" className="ev-sidebar-btn ev-sidebar-btn-search">
            🗺️ Tìm kiếm địa danh
          </Link>

          <Link to="/" className="ev-sidebar-btn ev-sidebar-btn-dashboard">
            Quay về trang chủ
          </Link>
        </div>

        {/* API KEY */}
        <input type="hidden" id="evApiKey" value="YOUR_API_KEY" />

        {/* LOCATION */}
        <div className="ev-section">
          <div className="ev-section-title">📍 Vị trí người dùng</div>

          <button className="ev-btn ev-btn-primary" onClick={handleGetLocation}>
            📡 Lấy vị trí hiện tại
          </button>

          <div id="evLocInfo" className="ev-small-text">
            Chưa lấy vị trí
          </div>

          <div className="ev-radius-wrapper">
            <label>Bán kính tìm trạm (m)</label>

            <div className="ev-slider-row">
              <input
                type="range"
                id="evRadiusSlider"
                min={100}
                max={5000}
                step={100}
                defaultValue={1500}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;

                  const radiusVal = document.getElementById("evRadiusVal");

                  if (radiusVal) {
                    radiusVal.textContent = target.value + " m";
                  }
                }}
              />

              <span className="ev-slider-val" id="evRadiusVal">
                1500 m
              </span>
            </div>
          </div>
        </div>

        {/* STATIONS */}
        <div className="ev-section">
          <button className="ev-btn ev-btn-sm" onClick={handleLoadStations}>
            ⚡ 🌍 Tìm trạm sạc gần vị trí tôi
          </button>

          <div id="evStationList">
            <div className="ev-empty">
              <div className="ev-empty-icon">🔌</div>
              Chưa có trạm sạc
            </div>
          </div>
        </div>

        {/* VEHICLE */}
        <div className="ev-section">
          <div className="ev-section-title">🚗 Phương tiện di chuyển</div>

          <div id="evVehicleSelector"></div>
        </div>

        {/* FIND ROUTE */}
        <div className="ev-section">
          <div className="ev-section-title">🗺️ Tìm đường</div>

          <div
            id="evSelectedStationBox"
            className="ev-selected-station-box"
            style={{ display: "none" }}
          >
            <div className="ev-selected-station-label">Trạm đích đã chọn:</div>

            <div id="evSelectedStationName"></div>

            <div className="ev-selected-station-actions">
              <span>Hoặc </span>

              <span className="ev-clear-selected">
                dùng trạm gần nhất tự động
              </span>
            </div>
          </div>

          <button
            className="ev-btn ev-btn-primary"
            id="evFindBtn"
            onClick={handleFindRoutes}
            disabled
          >
            🔍 Tìm 2 đường ngắn nhất
          </button>

          <div id="evStatus" className="ev-status-box">
            <div
              className="ev-dot-pulse"
              id="evStatusDot"
              style={{ display: "none" }}
            ></div>

            <span id="evStatusText">Chưa sẵn sàng</span>
          </div>
        </div>

        {/* RESULT */}
        <div className="ev-section">
          <div className="ev-section-title">📊 Kết quả</div>

          <div id="evRouteResults">
            <div className="ev-empty">
              <div className="ev-empty-icon">🛣️</div>
              Chưa có kết quả
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="ev-section">
          <div className="ev-section-title">🎨 Chú thích</div>

          <div className="ev-legend-row">
            <div className="ev-legend-line ev-legend-line-1"></div>

            <span>Đường ngắn nhất (1)</span>
          </div>

          <div className="ev-legend-row">
            <div className="ev-legend-line ev-legend-line-2"></div>

            <span>Đường ngắn thứ 2 (2)</span>
          </div>

          <div className="ev-legend-row">
            <div className="ev-legend-dot ev-legend-user"></div>

            <span>Vị trí của bạn</span>
          </div>

          <div className="ev-legend-row">
            <div className="ev-legend-dot ev-legend-station"></div>

            <span>Trạm sạc đích</span>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div id="evMap" ref={mapRef} className="ev-map-container" />
    </div>
  );
}
