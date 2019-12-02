const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

const mongoConnectString = process.env.DB_CONNECT_STR || 'mongodb://localhost:27017/algolearndbone';
mongoose.connect(mongoConnectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('Successfully connected to Database');
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Unable to connect to Database!');
        // eslint-disable-next-line no-console
        console.error(err);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/', (req, res) => {
    res.status(200).json({
        status: '200',
        message: 'Hello World',
    });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on port ${port}`);
});

module.exports = app;
