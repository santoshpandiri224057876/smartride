import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { DriverLayout } from './components/DriverLayout';
import { AdminLayout } from './components/AdminLayout';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { DriverRoute } from './routes/DriverRoute';
import { AdminRoute } from './routes/AdminRoute';

// Public & Passenger Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { FindRides } from './pages/FindRides';
import { RideDetails } from './pages/RideDetails';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { MyBookings } from './pages/MyBookings';
import { UserProfile } from './pages/UserProfile';
import { BecomeDriver } from './pages/BecomeDriver';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { OfferRide } from './pages/driver/OfferRide';
import { DriverRides } from './pages/driver/DriverRides';
import { DriverRideDetails } from './pages/driver/DriverRideDetails';
import { DriverPassengers } from './pages/driver/DriverPassengers';
import { DriverHistory } from './pages/driver/DriverHistory';
import { DriverEarnings } from './pages/driver/DriverEarnings';
import { DriverProfile } from './pages/driver/DriverProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDrivers } from './pages/admin/AdminDrivers';
import { AdminRides } from './pages/admin/AdminRides';
import { AdminBookings } from './pages/admin/AdminBookings';

export const App = () => {
  return (
    <Routes>
      {/* Public & Passenger Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/find-rides" element={<FindRides />} />
        <Route path="/ride/:id" element={<RideDetails />} />

        {/* Passenger Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/become-driver"
          element={
            <ProtectedRoute>
              <BecomeDriver />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Driver Workspace Routes with DriverLayout & DriverRoute */}
      <Route
        path="/driver"
        element={
          <DriverRoute>
            <DriverLayout />
          </DriverRoute>
        }
      >
        <Route index element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="offer-ride" element={<OfferRide />} />
        <Route path="rides" element={<DriverRides />} />
        <Route path="rides/:id" element={<DriverRideDetails />} />
        <Route path="rides/:id/passengers" element={<DriverPassengers />} />
        <Route path="history" element={<DriverHistory />} />
        <Route path="earnings" element={<DriverEarnings />} />
        <Route path="profile" element={<DriverProfile />} />
      </Route>

      {/* Admin Console Routes with AdminLayout & AdminRoute */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="rides" element={<AdminRides />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
