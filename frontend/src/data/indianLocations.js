export const INDIAN_STATE_CITIES = {
  'Telangana': [
    'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam',
    'Mahbubnagar', 'Nalgonda', 'Siddipet', 'Ramagundam', 'Mancherial'
  ],
  'Andhra Pradesh': [
    'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Guntur', 'Nellore',
    'Kurnool', 'Rajahmundry', 'Kakinada', 'Anantapur', 'Kadapa', 'Eluru'
  ],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi',
    'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru', 'Udupi'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Vellore', 'Erode', 'Tiruppur', 'Thanjavur'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)',
    'Solapur', 'Kolhapur', 'Thane', 'Navi Mumbai', 'Amravati'
  ],
  'Kerala': [
    'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam',
    'Kannur', 'Alappuzha', 'Palakkad', 'Kottayam'
  ],
  'Delhi NCR': [
    'New Delhi', 'Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad', 'Greater Noida'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner',
    'Ajmer', 'Alwar', 'Bhilwara', 'Mount Abu'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj',
    'Meerut', 'Bareilly', 'Aligarh', 'Gorakhpur', 'Noida'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Kharagpur', 'Darjeeling'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas'
  ],
  'Punjab & Haryana': [
    'Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Panipat', 'Ambala'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur'
  ],
  'Bihar & Jharkhand': [
    'Patna', 'Gaya', 'Muzaffarpur', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Calangute'
  ]
};

export const INDIAN_STATES = Object.keys(INDIAN_STATE_CITIES);

export const getAllIndianCities = () => {
  const all = [];
  Object.values(INDIAN_STATE_CITIES).forEach((cities) => {
    cities.forEach((c) => {
      if (!all.includes(c)) all.push(c);
    });
  });
  return all.sort();
};

export const POPULAR_ROUTES = [
  { from: 'Hyderabad', to: 'Bengaluru', price: 650, distance: '570 km' },
  { from: 'Hyderabad', to: 'Vijayawada', price: 380, distance: '275 km' },
  { from: 'Hyderabad', to: 'Warangal', price: 180, distance: '145 km' },
  { from: 'Hyderabad', to: 'Pune', price: 750, distance: '560 km' },
  { from: 'Bengaluru', to: 'Chennai', price: 450, distance: '350 km' },
  { from: 'Mumbai', to: 'Pune', price: 250, distance: '150 km' },
  { from: 'Delhi', to: 'Jaipur', price: 350, distance: '280 km' },
];

export const INDIAN_VEHICLE_MAKES = [
  'Maruti Suzuki',
  'Tata Motors',
  'Hyundai',
  'Mahindra',
  'Toyota',
  'Kia',
  'Honda',
  'MG Motor',
  'Renault',
  'Volkswagen',
  'Skoda'
];

export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'CNG',
  'Electric (EV)'
];
