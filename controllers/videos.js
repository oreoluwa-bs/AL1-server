const fs = require('fs');

const handleVidUpload = (req, res) => {
    if (req.file && req.file.filename) {
        res.status(200).json({
            status: 'done',
            fileData: req.file,
            fileName: req.file.filename,
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: 'Could not be upload file',
        });
    }
};

const handleVidDelete = (req, res) => {
    fs.unlink(`videos/${req.params.videoId}`, (err) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                message: 'Could not be deleted',
                err,
            });
        } else {
            res.status(200).json({
                status: 'done',
            });
        }
    });
};

module.exports = {
    handleVidUpload,
    handleVidDelete,
};
