import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Star,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const RideCard = ({ ride }) => {
  const driverInitial = ride.driverName ? ride.driverName.charAt(0).toUpperCase() : 'D';

  return (
    <div className="ride-card">
      <div className="ride-card-header">
        <div className="driver-mini-info">
          {ride.driverProfilePhoto ? (
            <img
              src={ride.driverProfilePhoto}
              alt={ride.driverName}
              className="driver-avatar-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="avatar-circle">{driverInitial}</div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{ride.driverName}</span>
              {ride.driverVerificationStatus === 'APPROVED' && (
                <ShieldCheck size={16} color="#10b981" title="Verified Driver" />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#f59e0b', marginTop: '2px' }}>
              <Star size={13} fill="#f59e0b" />
              <span style={{ fontWeight: 600 }}>{ride.driverRating || '4.8'}</span>
              <span style={{ color: 'var(--text-muted)' }}>• Experienced</span>
            </div>
          </div>
        </div>

        <div className="ride-price-col">
          <div className="price-tag">₹{Math.round(ride.pricePerSeat)}</div>
          <div className="price-sub">per seat</div>
        </div>
      </div>

      <div className="ride-itinerary">
        <div className="route-point">
          <span className="route-time">{ride.departureTime?.substring(0, 5)}</span>
          <span className="route-city">{ride.source}</span>
        </div>

        <div className="route-arrow">
          <span>Direct Ride</span>
          <ArrowRight size={20} />
        </div>

        <div className="route-point" style={{ textAlign: 'right' }}>
          <span className="route-time">Arrival</span>
          <span className="route-city">{ride.destination}</span>
        </div>
      </div>

      <div className="ride-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={15} color="var(--primary)" />
            {ride.departureDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Users size={15} color="var(--primary)" />
            <strong>{ride.availableSeats}</strong> seats left
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Car size={15} color="var(--primary)" />
            {ride.vehicleName || 'Standard Car'}
          </span>
        </div>

        <Link to={`/ride/${ride.id}`} className="btn btn-outline-primary btn-sm">
          View Ride
        </Link>
      </div>
    </div>
  );
};
