const multer = require('multer');

const MIME_TYPES = {
    'video/mp4': 'mp4',
    'video/x-msvideo': 'avi',
    'video/quicktime': 'mov', // Not sure it works
    'video/x-matroska': 'mkv', // Not sure it works
    'video/mpeg': 'mpeg', // Not sure it works
    'video/ogg': 'ogv', // Not sure it works
    'video/mp2t': '.ts', // Not sure it works
    'video/webm': 'webm', // Not sure it works
    'video/3gpp': '3gp', // Not sure it works
    'video/3gpp2': '3g2', // Not sure it works
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'videos');
    },
    filename: (req, file, callback) => {
        const namee = `${file.originalname.split('.')[0]}_`;
        const name = namee.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${name + Date.now()}.${extension}`);
    },
});

module.exports = multer({ storage }).single('video');
