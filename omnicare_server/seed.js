require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define models matching the structure in your index.js
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  specialization: String, // Adding these so they save correctly for the doctor accounts
  hospital: String
}, { timestamps: true }));

const Hospital = mongoose.model('Hospital', new mongoose.Schema({
  name: String,
  location: String,
  load_percent: Number,
  status: String,
  color: String,
  doctors_on_call: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 4 },
  totalBeds: { type: Number, default: 100 },
}, { timestamps: true }));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
  patientName: String,
  hospital: String,
  time: String,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
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

async function seedData() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error("❌ Error: MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB connected successfully");

    console.log("Clearing collections...");
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await Appointment.deleteMany({});
    await Doctor.deleteMany({});
    await Donor.deleteMany({});
    console.log("✅ Collections cleared (Users, Hospitals, Appointments, Doctors, Donors)");

    console.log("Seeding Hospitals...");
    const hospitals = await Hospital.insertMany([
      { name: "Apollo Hospitals", location: "Jubilee Hills, Hyderabad", load_percent: 85, status: "High Demand", color: "red", doctors_on_call: 25, availableBeds: 15, totalBeds: 500 },
      { name: "AIG Hospitals", location: "Gachibowli, Hyderabad", load_percent: 60, status: "Normal", color: "green", doctors_on_call: 40, availableBeds: 120, totalBeds: 800 },
      { name: "Yashoda Hospitals", location: "Secunderabad, Hyderabad", load_percent: 75, status: "Busy", color: "yellow", doctors_on_call: 15, availableBeds: 45, totalBeds: 400 },
      { name: "KIMS Hospitals", location: "Minister Road, Hyderabad", load_percent: 50, status: "Normal", color: "green", doctors_on_call: 30, availableBeds: 85, totalBeds: 600 }
    ]);
    console.log(`✅ Seeded ${hospitals.length} hospitals`);

    console.log("Seeding Users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: "Patient", email: "patient@test.com", password: hashedPassword, role: "patient" },
      { name: "Dr. Reddy", email: "drreddy@test.com", password: hashedPassword, role: "doctor", specialization: "Cardiology", hospital: "Apollo Hospitals" },
      { name: "Dr. Sharma", email: "drsharma@test.com", password: hashedPassword, role: "doctor", specialization: "Neurology", hospital: "AIG Hospitals" }
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    console.log("Seeding Doctors...");
    const doctors = await Doctor.insertMany([
      { name: "Dr. Ananya Reddy", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face", rating: 4.9, reviews: 127, location: "Apollo Jubilee Hills", status: "available", experience: "15 years" },
      { name: "Dr. Vikram Sharma", specialty: "Neurologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face", rating: 4.8, reviews: 98, location: "AIG Gachibowli", status: "busy", experience: "12 years" },
      { name: "Dr. Priya Patel", specialty: "Pediatrician", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face", rating: 4.9, reviews: 215, location: "Care Hospitals Banjara Hills", status: "available", experience: "10 years" },
      { name: "Dr. Ramesh Rao", specialty: "Orthopedic Surgeon", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face", rating: 4.7, reviews: 89, location: "KIMS Secunderabad", status: "high-demand", experience: "18 years" },
      { name: "Dr. Neha Singh", specialty: "Dermatologist", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face", rating: 4.8, reviews: 156, location: "Medicover Hitec City", status: "available", experience: "8 years" },
      { name: "Dr. Amit Kumar", specialty: "General Physician", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face", rating: 4.6, reviews: 234, location: "Yashoda Somajiguda", status: "busy", experience: "20 years" }
    ]);
    console.log(`✅ Seeded ${doctors.length} doctors`);

    console.log("Seeding Donors...");
    const donors = await Donor.insertMany([
      { name: "Rahul Desai", bloodGroup: "A+", location: "Kukatpally", distance: "1.2 km", lastDonation: "3 months ago", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Sneha Krishnan", bloodGroup: "O-", location: "Madhapur", distance: "2.5 km", lastDonation: "4 months ago", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Amit Kumar", bloodGroup: "B+", location: "Ameerpet", distance: "3.0 km", lastDonation: "2 months ago", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Neha Singh", bloodGroup: "AB+", location: "Kondapur", distance: "4.1 km", lastDonation: "5 months ago", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", available: false },
      { name: "Siddharth Verma", bloodGroup: "O+", location: "Jubilee Hills", distance: "2.8 km", lastDonation: "6 months ago", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Pooja Reddy", bloodGroup: "A-", location: "Secunderabad", distance: "5.2 km", lastDonation: "3 months ago", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Vijay Rao", bloodGroup: "B-", location: "Banjara Hills", distance: "1.8 km", lastDonation: "4 months ago", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", available: true },
      { name: "Kavitha Iyer", bloodGroup: "AB-", location: "Gachibowli", distance: "6.0 km", lastDonation: "2 months ago", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", available: false }
    ]);
    console.log(`✅ Seeded ${donors.length} donors`);

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
}

seedData();
