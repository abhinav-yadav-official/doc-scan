var express = require('express');
var morgan = require('morgan');
var Tesseract = require('tesseract.js');
var multer = require('multer');
var upload = multer({ dest: 'images/' })
const fs = require('fs');

var port = process.env.PORT || 8080;

var app = express();

app.use(morgan('dev'));

app.use(express.static('dist'))

app.post('/api/tesseract', upload.single('img'), function(req, res) {

    if (!req.file) {
        return res.status(403).send({
            status: false,
            message: "Image is required."
        })
    }
    var tmp_path = req.file.path;

    Tesseract.recognize(tmp_path)
        .then(function(result) {
            fs.unlink(tmp_path, function() {
                return res.status(200).send({
                    status: true,
                    text: result.text,
                    confidence: result.confidence
                });
            })
        });
});

app.listen(port);

console.log('Server started')