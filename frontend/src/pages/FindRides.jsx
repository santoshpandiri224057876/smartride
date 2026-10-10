import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rideService } from '../services/api';
import { RideCard } from '../components/RideCard';
import { getAllIndianCities } from '../data/indianLocations';
import {
  Search,
  MapPin,
  Navigation,
  Calendar,
  Users,
  Filter,
  DollarSign,
  Car,
  Clock,
  RotateCcw
} from 'lucide-react';

export const FindRides = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameters
  const [from, setFrom] = useState(searchParams.get('from') || '');
  const [to, setTo] = useState(searchParams.get('to') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [seats, setSeats] = useState(Number(searchParams.get('seats')) || 1);

  // Filters
  const [maxPrice, setMaxPrice] = useState('');
  const [timeFilter, setTimeFilter] = useState('ALL'); // ALL, MORNING, AFTERNOON, EVENING
  const [vehicleType, setVehicleType] = useState('');

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const params = {};
      if (from.trim()) params.from = from.trim();
      if (to.trim()) params.to = to.trim();
      if (date) params.date = date;
      if (seats) params.seats = seats;
      if (maxPrice) params.maxPrice = maxPrice;
      if (vehicleType) params.vehicleType = vehicleType;

      const res = await rideService.searchRides(params);
      let data = res.data.data;

      // Filter by departure time in frontend if chosen
      if (timeFilter !== 'ALL') {
        data = data.filter((r) => {
          if (!r.departureTime) return true;
          const hour = parseInt(r.departureTime.split(':')[0], 10);
          if (timeFilter === 'MORNING') return hour < 12;
          if (timeFilter === 'AFTERNOON') return hour >= 12 && hour < 18;
          if (timeFilter === 'EVENING') return hour >= 18;
          return true;
        });
      }

      setRides(data);
    } catch (err) {
      console.error('Failed to search rides', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [searchParams, timeFilter, maxPrice, vehicleType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (from.trim()) newParams.set('from', from.trim());
    if (to.trim()) newParams.set('to', to.trim());
    if (date) newParams.set('date', date);
    if (seats) newParams.set('seats', seats);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setMaxPrice('');
    setTimeFilter('ALL');
    setVehicleType('');
    setFrom('');
    setTo('');
    setDate('');
    setSeats(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="container" style={{ padding: '36px 24px' }}>
      {/* Top Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '32px' }}>
        <datalist id="indian-cities-find">
          {getAllIndianCities().map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-field">
            <MapPin size={18} color="#2563eb" />
            <input
              type="text"
              list="indian-cities-find"
              placeholder="From City (e.g. Hyderabad)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="search-input-field">
            <Navigation size={18} color="#2563eb" />
            <input
              type="text"
              list="indian-cities-find"
              placeholder="To City (e.g. Bengaluru)"
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
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {/* Main Content Layout with Filters */}
      <div className="rides-results-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.05rem' }}>
              <Filter size={18} /> Filters
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Max Price Filter */}
          <div className="filter-section">
            <div className="filter-title">Maximum Fare Per Seat (₹)</div>
            <div className="search-input-field" style={{ padding: '8px 12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '1.1rem' }}>₹</span>
              <input
                type="number"
                placeholder="e.g. 500"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Departure Time */}
          <div className="filter-section">
            <div className="filter-title">Departure Time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="timeFilter"
                  checked={timeFilter === 'ALL'}
                  onChange={() => setTimeFilter('ALL')}
                />
                Any time of day
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="timeFilter"
                  checked={timeFilter === 'MORNING'}
                  onChange={() => setTimeFilter('MORNING')}
                />
                Morning (Before 12:00)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="timeFilter"
                  checked={timeFilter === 'AFTERNOON'}
                  onChange={() => setTimeFilter('AFTERNOON')}
                />
                Afternoon (12:00 - 18:00)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="timeFilter"
                  checked={timeFilter === 'EVENING'}
                  onChange={() => setTimeFilter('EVENING')}
                />
                Evening (After 18:00)
              </label>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="filter-section">
            <div className="filter-title">Vehicle Type</div>
            <select
              className="form-control"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">All Vehicles</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV / Crossover</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
        </aside>

        {/* Results Stream */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>
              {from || to ? `Rides: ${from || 'Anywhere'} to ${to || 'Anywhere'}` : 'All Scheduled Rides'}
            </h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {rides.length} {rides.length === 1 ? 'ride available' : 'rides available'}
            </span>
          </div>

          {loading ? (
            <div className="loading-screen" style={{ minHeight: '300px' }}>
              <div className="spinner"></div>
              <p>Searching verified drivers...</p>
            </div>
          ) : rides.length > 0 ? (
            <div>
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <Car size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No rides matching your criteria</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
                Try adjusting your search criteria, dates, or clearing some filters to see more results.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResetFilters}
              >
                Clear Filters & Show All Rides
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
