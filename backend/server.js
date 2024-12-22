const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); // Use express's built-in JSON parser (instead of body-parser)

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, '../frontend'))); // Correct path to 'frontend' folder

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Path to users JSON file
const usersFilePath = path.join(__dirname, 'users.json');

// Utility function to read users data from the JSON file
const getUsersData = () => {
    try {
        if (!fs.existsSync(usersFilePath)) {
            fs.writeFileSync(usersFilePath, JSON.stringify([])); // Create the file if it doesn't exist
        }
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users data:', error);
        return [];
    }
};

// Utility function to write users data to the JSON file
const saveUsersData = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users data:', error);
    }
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Log the received data for debugging
    console.log(req.body);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const users = getUsersData();
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    // Save the new user data to users.json
    saveUsersData(users);

    res.status(201).json({ message: 'User registered successfully' });
});

// User Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const users = getUsersData();
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
});

// Protect Routes (Example of using JWT token to authenticate users)
app.get('/profile', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = getUsersData();
        const user = users.find(user => user.email === decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
});

// Catch-all route to serve index.html for any other request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Logout Route
app.get('/logout', (req, res) => {
    // Invalidate the token by not passing it back to the client
    res.json({ message: 'Logout successful' });
});

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
