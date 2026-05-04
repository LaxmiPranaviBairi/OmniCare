require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("🚀 MongoDB Connected Successfully"))
  .catch(err => {
    console.log("❌ Connection Error: MongoDB is unreachable. The server will fall back to local mock data.");
  });

// ─── Schemas & Models ────────────────────────────────────────────────────────

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  hospital: String,
  specialization: String,
}, { timestamps: true }));

const Hospital = mongoose.model('Hospital', new mongoose.Schema({
  name: String,
  location: String,
  load_percent: Number,
  status: String,
  color: String,
  doctors_on_call: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 4 },
}, { timestamps: true }));

const Doctor = mongoose.model('Doctor', new mongoose.Schema({
  name: String,
  specialty: String,
  image: String,
  rating: Number,
  reviews: Number,
  location: String,
  status: { type: String, enum: ['available', 'busy', 'high-demand'], default: 'available' },
  experience: String,
}, { timestamps: true }));

const Donor = mongoose.model('Donor', new mongoose.Schema({
  name: String,
  bloodGroup: String,
  location: String,
  distance: String,
  lastDonation: String,
  image: String,
  available: { type: Boolean, default: true },
  phone: String,
}, { timestamps: true }));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
  patientName: String,
  hospital: String,
  doctorName: String,
  date: String,
  time: String,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
}, { timestamps: true }));

const BloodRequest = mongoose.model('BloodRequest', new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  donorName: String,
  bloodGroup: String,
  requesterName: String,
  requesterPhone: String,
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true }));

const DonorRegistration = mongoose.model('DonorRegistration', new mongoose.Schema({
  name: String,
  bloodGroup: String,
  location: String,
  phone: String,
  available: { type: Boolean, default: true },
}, { timestamps: true }));

// ─── Helper: seed default data if collections are empty ──────────────────────

async function seedIfEmpty() {
  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    await Doctor.insertMany([
      { name: "Dr. Ananya Reddy", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face", rating: 4.9, reviews: 127, location: "Apollo Jubilee Hills", status: "available", experience: "15 years" },
      { name: "Dr. Vikram Sharma", specialty: "Neurologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face", rating: 4.8, reviews: 98, location: "AIG Gachibowli", status: "busy", experience: "12 years" },
      { name: "Dr. Priya Patel", specialty: "Pediatrician", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face", rating: 4.9, reviews: 215, location: "Care Hospitals Banjara Hills", status: "available", experience: "10 years" },
      { name: "Dr. Ramesh Rao", specialty: "Orthopedic Surgeon", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face", rating: 4.7, reviews: 89, location: "KIMS Secunderabad", status: "high-demand", experience: "18 years" },
      { name: "Dr. Neha Singh", specialty: "Dermatologist", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face", rating: 4.8, reviews: 156, location: "Medicover Hitec City", status: "available", experience: "8 years" },
      { name: "Dr. Amit Kumar", specialty: "General Physician", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face", rating: 4.6, reviews: 234, location: "Yashoda Somajiguda", status: "busy", experience: "20 years" },
    ]);
    console.log("🌱 Seeded doctors");
  }

  const donorCount = await Donor.countDocuments();
  if (donorCount === 0) {
    await Donor.insertMany([
      { name: "Rahul Desai", bloodGroup: "A+", location: "Kukatpally", distance: "1.2 km", lastDonation: "3 months ago", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Sneha Krishnan", bloodGroup: "O-", location: "Madhapur", distance: "2.5 km", lastDonation: "4 months ago", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Amit Kumar", bloodGroup: "B+", location: "Ameerpet", distance: "3.0 km", lastDonation: "2 months ago", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Neha Singh", bloodGroup: "AB+", location: "Kondapur", distance: "4.1 km", lastDonation: "5 months ago", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", available: false },
      { name: "Siddharth Verma", bloodGroup: "O+", location: "Jubilee Hills", distance: "2.8 km", lastDonation: "6 months ago", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Pooja Reddy", bloodGroup: "A-", location: "Secunderabad", distance: "5.2 km", lastDonation: "3 months ago", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Vijay Rao", bloodGroup: "B-", location: "Banjara Hills", distance: "1.8 km", lastDonation: "4 months ago", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Kavitha Iyer", bloodGroup: "AB-", location: "Gachibowli", distance: "6.0 km", lastDonation: "2 months ago", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", available: false },
    ]);
    console.log("🌱 Seeded donors");
  }
}

mongoose.connection.once('open', seedIfEmpty);

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({ message: 'Signed up successfully (Offline Mode)!', user: { _id: 'mock-' + Date.now(), name, email, role } });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: role || 'patient' });
    
    // Don't return password
    res.status(201).json({ 
      message: 'User registered successfully!', 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ message: 'Logged in successfully (Offline Mode)!', user: { _id: 'mock-' + Date.now(), name: 'Mock User', email, role } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `Access denied. You are registered as a ${user.role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({ 
      message: 'Logged in successfully!', 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'hospitals.json')));
      return res.json(data);
    }
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/hospitals/:id/beds - update available beds
app.patch('/api/hospitals/:id/beds', async (req, res) => {
  try {
    const { id } = req.params;
    const { beds } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Beds updated successfully (Offline Mode)', availableBeds: beds });
    }

    const hospital = await Hospital.findByIdAndUpdate(id, { availableBeds: beds }, { new: true });
    if (!hospital) return res.status(404).json({ message: 'Hospital not found.' });

    res.json({ message: 'Beds updated successfully', hospital });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors?search=&specialty=&hospital=
app.get('/api/doctors', async (req, res) => {
  try {
    const { search, specialty, hospital } = req.query;
    
    if (mongoose.connection.readyState !== 1) {
      let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'doctors.json')));
      if (search) {
        data = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));
      }
      if (specialty && specialty !== 'All') {
        data = data.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
      }
      if (hospital) {
        data = data.filter(d => d.location.toLowerCase().includes(hospital.toLowerCase()));
      }
      return res.json(data);
    }

    const query = { role: 'doctor' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }
    if (specialty && specialty !== 'All') {
      query.specialization = { $regex: specialty, $options: 'i' };
    }
    if (hospital) {
      query.hospital = { $regex: hospital.split(' ')[0], $options: 'i' };
    }
    const doctors = await User.find(query);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/donors?search=&bloodGroup=
app.get('/api/donors', async (req, res) => {
  try {
    const { search, bloodGroup } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'donors.json')));
      if (search) {
        data = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
      }
      if (bloodGroup && bloodGroup !== 'All') {
        data = data.filter(d => d.bloodGroup === bloodGroup);
      }
      return res.json(data);
    }

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (bloodGroup && bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }
    const donors = await Donor.find(query);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/appointments  — book a hospital appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { patientName, hospital, doctorName, date, time } = req.body;
    if (!patientName || !hospital || !doctorName || !date || !time) {
      return res.status(400).json({ message: 'patientName, hospital, doctorName, date, and time are required.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({ message: 'Appointment booked successfully (Offline Mode)!', appointment: { _id: 'mock-' + Date.now(), patientName, hospital, doctorName, date, time, status: 'Pending' } });
    }
    const appointment = await Appointment.create({
      patientName, hospital, doctorName, date, time, status: 'Pending'
    });
    res.status(201).json({ message: 'Appointment booked successfully!', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/check?doctorName=&date=
app.get('/api/appointments/check', async (req, res) => {
  try {
    const { doctorName, date } = req.query;
    if (!doctorName || !date) {
      return res.status(400).json({ message: 'doctorName and date are required.' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'appointments.json')));
      const booked = data.filter(d => d.doctorName === doctorName && d.date === date).map(d => d.time);
      return res.json(booked);
    }

    const appointments = await Appointment.find({ doctorName, date });
    const bookedSlots = appointments.map(a => a.time);
    res.json(bookedSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments?patientName=
app.get('/api/appointments', async (req, res) => {
  try {
    const { patientName } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'appointments.json')));
      if (patientName) {
        data = data.filter(d => d.patientName.toLowerCase().includes(patientName.toLowerCase()));
      }
      return res.json(data);
    }

    const query = patientName ? { patientName: { $regex: patientName, $options: 'i' } } : {};
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/doctor
app.get('/api/appointments/doctor', async (req, res) => {
  try {
    const { doctorName } = req.query;
    if (!doctorName) return res.status(400).json({ message: 'doctorName is required.' });

    if (mongoose.connection.readyState !== 1) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'appointments.json')));
      const filtered = data.filter(d => d.doctorName.toLowerCase().includes(doctorName.toLowerCase()));
      console.log('Found appointments (Offline):', filtered.length);
      return res.json(filtered);
    }

    const appointments = await Appointment.find({ doctorName: { $regex: doctorName, $options: 'i' } }).sort({ createdAt: -1 });
    console.log('Found appointments:', appointments.length);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/appointments/:id/complete
app.put('/api/appointments/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Status updated to Completed successfully (Offline Mode)', status: 'Completed' });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status: 'Completed' }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });

    res.json({ message: 'Appointment marked as completed', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/appointments/:id/status  — update appointment status
app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Status updated successfully (Offline Mode)', status });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });

    res.json({ message: 'Status updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/blood-requests  — send a blood donation request to a donor
app.post('/api/blood-requests', async (req, res) => {
  try {
    const { donorId, requesterName, requesterPhone } = req.body;
    if (!donorId) {
      return res.status(400).json({ message: 'donorId is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({ message: 'Blood request sent successfully (Offline Mode)!', request: { _id: 'mock-' + Date.now(), donorId, requesterName, status: 'pending' } });
    }

    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ message: 'Donor not found.' });
    if (!donor.available) return res.status(409).json({ message: 'Donor is currently unavailable.' });

    const request = await BloodRequest.create({
      donorId,
      donorName: donor.name,
      bloodGroup: donor.bloodGroup,
      requesterName: requesterName || 'Anonymous',
      requesterPhone: requesterPhone || '',
    });
    res.status(201).json({ message: 'Blood request sent successfully!', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/donors/register  — register as a new blood donor
app.post('/api/donors/register', async (req, res) => {
  try {
    const { name, bloodGroup, location, phone } = req.body;
    if (!name || !bloodGroup) {
      return res.status(400).json({ message: 'name and bloodGroup are required.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({ message: 'Registered as a donor successfully (Offline Mode)!', registration: { _id: 'mock-' + Date.now(), name, bloodGroup, location, phone } });
    }
    const registration = await DonorRegistration.create({ name, bloodGroup, location, phone });
    res.status(201).json({ message: 'Registered as a donor successfully!', registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// In-memory profile store (replace with a DB model when auth is added)
let profileData = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  bloodGroup: "O+",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
};

// GET /api/profile
app.get('/api/profile', async (req, res) => {
  try {
    let appointmentCount = 0;
    if (mongoose.connection.readyState !== 1) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock_data', 'appointments.json')));
      appointmentCount = data.filter(d => d.status === 'confirmed').length;
    } else {
      appointmentCount = await Appointment.countDocuments({ status: 'confirmed' });
    }
    
    res.json({
      ...profileData,
      stats: {
        heartRate: 72,
        bloodPressure: "120/80",
        appointmentCount,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile — update profile details
app.put('/api/profile', (req, res) => {
  try {
    const { name, email, phone, bloodGroup } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }
    profileData = { ...profileData, name, email, phone, bloodGroup };
    res.json({ message: 'Profile updated successfully!', profile: profileData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));