import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPhone, FaMapMarkerAlt, FaClock, FaHospital } from "react-icons/fa";
import hospitalsData from '../data/hospitalsData';

const BetterCenterDetailPage = () => {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5000/api/hospitals/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCenter(data);
        } else if (res.status === 404) {
          // Fallback to local data if API doesn't have this id
          const local = hospitalsData.find(h => String(h.id) === String(id));
          if (local) {
            setCenter(local);
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err) {
        console.error("Error fetching center details:", err);
        setError("Failed to load center details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCenter();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!center) return <p className="text-center text-red-500">Hospital not found</p>;

  // Handle possible field name variations from backend
  const name = center.name || center.nom;
  const address = center.address || center.adress || center.adresse || "";
  const phone = center.phone || center.telephone || center.tel || "Not available";
  const openingTime = center.opening_time || center.openingTime || center.open || null;
  const closingTime = center.closing_time || center.closingTime || center.close || null;
  const services = Array.isArray(center.services) ? center.services : [];
  const lat = center.latitude ?? center.lat ?? center.coordinates?.lat;
  const lng = center.longitude ?? center.lng ?? center.coordinates?.lng;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaHospital className="text-purple-600" /> {name}
        </h1>
        <p className="text-gray-600 flex items-center mt-2">
          <FaMapMarkerAlt className="mr-2 text-red-500" />
          {address}
        </p>
        <p className="text-gray-600 flex items-center mt-1">
          <FaPhone className="mr-2 text-green-600" />
          {phone}
        </p>
      </div>

      {/* Opening Hours */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FaClock className="text-blue-600" /> Opening Hours
        </h2>
        {openingTime && closingTime ? (
          <p className="text-gray-700">
            Opens at <b>{openingTime}</b> — Closes at <b>{closingTime}</b>
          </p>
        ) : (
          <p className="text-gray-500">No schedule available</p>
        )}
      </div>

      {/* Services */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        {services.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((srv, index) => (
              <li key={index} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                {typeof srv === 'string' ? srv : srv?.name || JSON.stringify(srv)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No services listed</p>
        )}
      </div>

      {/* Google Maps Direction */}
      {lat != null && lng != null && (
        <div className="mt-6 text-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            Get Directions on Google Maps
          </a>
        </div>
      )}

      {/* Back */}
      <div className="mt-4 text-center">
        <Link to="/centers" className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition">
          ← Back to Centers
        </Link>
      </div>
    </div>
  );
};

export default BetterCenterDetailPage;
