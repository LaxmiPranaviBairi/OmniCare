require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("🚀 MongoDB Connected Successfully"))
  .catch(err => console.log("❌ Connection Error:", err));

// ─── Schemas & Models ────────────────────────────────────────────────────────

const Hospital = mongoose.model('Hospital', new mongoose.Schema({
  name: String,
  location: String,
  load_percent: Number,
  status: String,
  color: String,
  doctors_on_call: { type: Number, default: 0 },
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
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  doctorSpecialty: String,
  doctorImage: String,
  patientName: String,
  date: String,
  time: String,
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
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
      { name: "Dr. Sarah Johnson", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face", rating: 4.9, reviews: 127, location: "Downtown Medical Center", status: "available", experience: "15 years" },
      { name: "Dr. Michael Chen", specialty: "Neurologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face", rating: 4.8, reviews: 98, location: "City Health Hospital", status: "busy", experience: "12 years" },
      { name: "Dr. Emily Williams", specialty: "Pediatrician", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face", rating: 4.9, reviews: 215, location: "Children's Care Clinic", status: "available", experience: "10 years" },
      { name: "Dr. James Wilson", specialty: "Orthopedic Surgeon", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face", rating: 4.7, reviews: 89, location: "Metro Orthopedic Center", status: "high-demand", experience: "18 years" },
      { name: "Dr. Lisa Anderson", specialty: "Dermatologist", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face", rating: 4.8, reviews: 156, location: "Skin Care Specialists", status: "available", experience: "8 years" },
      { name: "Dr. Robert Martinez", specialty: "General Physician", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face", rating: 4.6, reviews: 234, location: "Family Health Center", status: "busy", experience: "20 years" },
    ]);
    console.log("🌱 Seeded doctors");
  }

  const donorCount = await Donor.countDocuments();
  if (donorCount === 0) {
    await Donor.insertMany([
      { name: "Alex Thompson", bloodGroup: "A+", location: "Downtown Area", distance: "1.2 km", lastDonation: "3 months ago", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Maria Garcia", bloodGroup: "O-", location: "Westside District", distance: "2.5 km", lastDonation: "4 months ago", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "David Kim", bloodGroup: "B+", location: "Midtown", distance: "3.0 km", lastDonation: "2 months ago", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Sarah Wilson", bloodGroup: "AB+", location: "Northside", distance: "4.1 km", lastDonation: "5 months ago", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", available: false },
      { name: "James Brown", bloodGroup: "O+", location: "Eastside", distance: "2.8 km", lastDonation: "6 months ago", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Emily Davis", bloodGroup: "A-", location: "Southside", distance: "5.2 km", lastDonation: "3 months ago", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Michael Lee", bloodGroup: "B-", location: "Central District", distance: "1.8 km", lastDonation: "4 months ago", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Jennifer Martinez", bloodGroup: "AB-", location: "Harbor Area", distance: "6.0 km", lastDonation: "2 months ago", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", available: false },
    ]);
    console.log("🌱 Seeded donors");
  }
}

mongoose.connection.once('open', seedIfEmpty);

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors?search=&specialty=
app.get('/api/doctors', async (req, res) => {
  try {
    const { search, specialty } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
      ];
    }
    if (specialty && specialty !== 'All') {
      query.specialty = { $regex: specialty, $options: 'i' };
    }
    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/donors?search=&bloodGroup=
app.get('/api/donors', async (req, res) => {
  try {
    const { search, bloodGroup } = req.query;
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

// POST /api/appointments  — book an appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { doctorId, doctorName, doctorSpecialty, doctorImage, patientName, date, time } = req.body;
    if (!doctorId || !patientName || !date || !time) {
      return res.status(400).json({ message: 'doctorId, patientName, date, and time are required.' });
    }
    const appointment = await Appointment.create({
      doctorId, doctorName, doctorSpecialty, doctorImage, patientName, date, time,
    });
    res.status(201).json({ message: 'Appointment booked successfully!', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments?patientName=
app.get('/api/appointments', async (req, res) => {
  try {
    const { patientName } = req.query;
    const query = patientName ? { patientName: { $regex: patientName, $options: 'i' } } : {};
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json(appointments);
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
    const registration = await DonorRegistration.create({ name, bloodGroup, location, phone });
    res.status(201).json({ message: 'Registered as a donor successfully!', registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/profile  — static profile data (extend with auth later)
app.get('/api/profile', async (req, res) => {
  try {
    const appointmentCount = await Appointment.countDocuments({ status: 'confirmed' });
    res.json({
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      bloodGroup: "O+",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
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

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));