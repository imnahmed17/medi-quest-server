require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('medi-quest');
        const userCollection = db.collection('users');
        const supplyCollection = db.collection('supplies');
        const supplyDonateCollection = db.collection('donates');

        // User Registration
        app.post('/api/v1/register', async (req, res) => {
            const { name, email, password } = req.body;

            // Check if email already exists
            const existingUser = await userCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            await userCollection.insertOne({ name, email, password: hashedPassword });

            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });
        });

        // User Login
        app.post('/api/v1/login', async (req, res) => {
            const { email, password } = req.body;

            // Find user by email
            const user = await userCollection.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        });

        // Get All Supplies
        app.get('/api/v1/supplies', async (req, res) => {
            const supplies = await supplyCollection.find().toArray();
            res.status(200).json({ success: true, data: supplies });
        });

        // Create New Supply
        app.post('/api/v1/supplies', async (req, res) => {
            const supply = req.body;
            const result = await supplyCollection.insertOne(supply);
            res.send(result);
        });

        // Get Single Supply
        app.get('/api/v1/supplies/:id', async (req, res) => {
            const id = req.params.id;
            const result = await supplyCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Update Single Supply
        app.put('/api/v1/supplies/:id', async (req, res) => {
            const id = req.params.id;
            const supply = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: supply.title,
                    category: supply.category,
                    amount: supply.amount,
                },
            };
            const options = { upsert: true };
            const result = await supplyCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Remove Single Supply
        app.delete('/api/v1/supplies/:id', async (req, res) => {
            const id = req.params.id;
            const result = await supplyCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Donate Supply
        app.post('/api/v1/donate', async (req, res) => {
            const supplyDonate = req.body;
            const result = await supplyDonateCollection.insertOne(supplyDonate);
            res.send(result);
        });

        // Supply Statistics
        app.get('/api/v1/supply-stats', async (req, res) => {
            const pipeline = [
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        category: '$_id',
                        count: 1,
                        _id: 0
                    }
                }
            ];
        
            const result = await supplyCollection.aggregate(pipeline).toArray();
            res.send(result);
        });

        // Donation Statistics
        app.get('/api/v1/donate-stats', async (req, res) => {
            const pipeline = [
                {
                    $group: {
                        _id: '$supplyCategory',
                        count: { $sum: 1 },
                        total: { $sum: '$supplyAmount' }
                    }
                },
                {
                    $project: {
                        name: '$_id',
                        count: 1,
                        total: 1,
                        _id: 0
                    }
                }
            ];

            const result = await supplyDonateCollection.aggregate(pipeline).toArray();
            res.send(result);
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});