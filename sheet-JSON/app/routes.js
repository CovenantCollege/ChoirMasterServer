
/**
 * dependencies
 */
// routing library
var express = require('express');
var router = express.Router();
module.exports = router;

// path control library
var path = require('path');

// multipart/form-data processing library
var multer = require('multer');
var upload = multer({ dest: 'uploads/'});
var type = upload.single('sheet');

// file system library
var fs = require('fs');

// html parsing library
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : true }));

// spreadsheet manipulation library
var XLSX = require('xlsx');
/**
 * -------------
 */

/**
 * setup routes
 */
router.get('/', function (req, res) {
    var date = new Date();
    var day = date.toLocaleDateString();
    var time = date.toLocaleTimeString();
    console.log('Access:',day,'@',time,'\n');
    res.sendFile(path.join(__dirname,'../views/pages/index.html'));
});


router.post('/', type, function(req, res) {
    var name = req.file.originalname;
    var file_ext = /(\.(xlsx|xls|ods|xml))$/;
    if(file_ext.test(name)) {
        var tmp_path = req.file.path;
        var target_path = 'uploads/' + name;

        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);

        src.on('end', function () {
            var workbook = XLSX.readFile(target_path);
            var choirName = workbook.SheetNames[0];

            console.log('Choir:',choirName);
            /**
             * TODO: create new choir
             */

            var choir = XLSX.utils.sheet_to_json(workbook.Sheets[choirName]);
            console.log('Singers:',choir,'\n');
            /**
             * TODO: insert singer data
             */

            var date = new Date();
            var day = date.toLocaleDateString();
            var time = date.toLocaleTimeString();
            console.log('Sent:',day,'@',time,'\n');

            res.sendFile(path.join(__dirname,'../views/pages/thankyou.html'));
        });

        src.on('error', function (err) {
            /**
             * TODO: proper error handling
             */
            res.send('error');
        });
    }
    else {
        /**
         * TODO: proper error handling
         */
        res.send('ERROR: incorrect file type');
    }
});
/**
 * -------------
 */