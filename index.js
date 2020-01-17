/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const config = require('./config');

const userRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const vidRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');
const dummyRoutes = require('./routes/dummy');

const app = express();


mongoose.connect(config.dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log('Successfully connected to Database');
    })
    .catch((error) => {
        console.log({
            message: 'Unable to connect to Database!',
            error,
        });
    });

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));


app.listen(config.port, () => {
    console.log(`App is running on port ${config.port}`);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.use('/api/v1/auth', userRoutes);

app.use('/api/v1/course', courseRoutes);

app.use('/api/v1/video', vidRoutes);

app.use('/api/v1/admin', adminRoutes);

// Contact us route
app.post('/api/v1/contact-us', (req, res) => {
    console.log({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
    });
    res.status(200).json({
        status: 'success',
    });
});

// Connect frontend to api on startup
app.get('/api/v1/', (req, res) => {
    res.status(200).json({
        status: 'success',
    });
});

app.use('/api/v1/dummy', dummyRoutes);

module.exports = app;
