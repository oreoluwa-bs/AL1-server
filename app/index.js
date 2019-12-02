const express = require('express');

const app = express();

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
