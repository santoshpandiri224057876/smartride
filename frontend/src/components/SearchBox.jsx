import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Calendar, Users, Search } from 'lucide-react';
import { getAllIndianCities } from '../data/indianLocations';

export const SearchBox = ({ initialFrom = '', initialTo = '', initialDate = '', initialSeats = 1 }) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [seats, setSeats] = useState(initialSeats);

  const indianCities = getAllIndianCities();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.append('from', from.trim());
    if (to.trim()) params.append('to', to.trim());
    if (date) params.append('date', date);
    if (seats) params.append('seats', seats);

    navigate(`/find-rides?${params.toString()}`);
  };

  return (
    <div className="search-widget">
      <datalist id="indian-cities-list">
        {indianCities.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>

      <form onSubmit={handleSearch} className="search-form-row">
        <div className="search-input-field">
          <MapPin size={18} color="#2563eb" />
          <input
            type="text"
            list="indian-cities-list"
            placeholder="From (e.g. Hyderabad)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="search-input-field">
          <Navigation size={18} color="#2563eb" />
          <input
            type="text"
            list="indian-cities-list"
            placeholder="To (e.g. Bengaluru)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="search-input-field">
          <Calendar size={18} color="#2563eb" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="search-input-field">
          <Users size={18} color="#2563eb" />
          <select value={seats} onChange={(e) => setSeats(Number(e.target.value))}>
            <option value={1}>1 seat</option>
            <option value={2}>2 seats</option>
            <option value={3}>3 seats</option>
            <option value={4}>4 seats</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          <Search size={18} /> Search Rides
        </button>
      </form>
    </div>
  );
};
