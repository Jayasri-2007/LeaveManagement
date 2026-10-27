const express = require('express');
const connectDB = require('./config/db');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api/leaves', leaveRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log('MongoDB Connected Successfully!');
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
    });