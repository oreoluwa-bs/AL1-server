/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');

const userRoutes = require('../routes/auth');
const courseRoutes = require('../routes/course');

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

app.use('/api/v1/auth', userRoutes);

app.use('/api/v1/course', courseRoutes);

module.exports = app;
