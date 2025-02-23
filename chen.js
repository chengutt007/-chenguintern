import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, TextField, Box, Grid, Card, CardContent } from "@mui/material";

// Backend API Setup
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Authentication API Calls
const registerUser = (data) => API.post("/auth/register", data);
const loginUser = (data) => API.post("/auth/login", data);
const fetchCampaigns = () => API.get("/campaigns");
const createCampaign = (data) => API.post("/campaigns/create", data);

// Navbar Component
const Navbar = () => (
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Crowdfunding</Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
        </Toolbar>
    </AppBar>
);

// Campaign List Component
const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        fetchCampaigns().then((res) => setCampaigns(res.data)).catch(console.error);
    }, []);

    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {campaigns.map((c) => (
                <Grid item xs={12} sm={6} md={4} key={c._id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">{c.title}</Typography>
                            <Typography>{c.description}</Typography>
                            <Typography>Goal: ${c.goalAmount}</Typography>
                            <Typography>Raised: ${c.raisedAmount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

// Campaign Form Component
const CampaignForm = () => {
    const [form, setForm] = useState({ title: "", description: "", goalAmount: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createCampaign(form);
        alert("Campaign Created!");
        setForm({ title: "", description: "", goalAmount: "" });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} required />
            <TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} required multiline rows={3} sx={{ my: 2 }} />
            <TextField fullWidth label="Goal Amount" name="goalAmount" value={form.goalAmount} onChange={handleChange} required type="number" />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Create Campaign</Button>
        </Box>
    );
};

// Home Page Component
const Home = () => (
    <div>
        <CampaignForm />
        <CampaignList />
    </div>
);

// Login Component
const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(form);
        alert("Login Successful!");
        navigate("/");
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} required />
            <TextField fullWidth label="Password" name="password" value={form.password} onChange={handleChange} required type="password" sx={{ my: 2 }} />
            <Button type="submit" variant="contained" color="primary">Login</Button>
        </Box>
    );
};

// Register Component
const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser(form);
        alert("Registration Successful!");
        navigate("/login");
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required />
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} required />
            <TextField fullWidth label="Password" name="password" value={form.password} onChange={handleChange} required type="password" sx={{ my: 2 }} />
            <Button type="submit" variant="contained" color="primary">Register</Button>
        </Box>
    );
};

// Main App Component
function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;