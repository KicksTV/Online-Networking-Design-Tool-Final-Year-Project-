// Load the SDK for JavaScript
var AWS = require('aws-sdk');
var fs = require('fs');

var s3 = null
const bucket = 'bno'

function aws_init() {
    var credentials = new AWS.SharedIniFileCredentials({profile: 'bno_account'});
    console.log(credentials)

    AWS.config.credentials = credentials;
    
    // Set the Region 
    AWS.config.update({region: 'eu-west-2'});
    
    
    // Create S3 service object
    s3 = new AWS.S3({apiVersion: '2006-03-01'});

    // Call S3 to list the buckets
    s3.listBuckets(function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data.Buckets);
        }
    });

}
// example: aws_upload_file('modules/tasks/test.js', 'var test_code="some test string"')
function aws_upload_file(file_path, body) {
    if (!s3)
        aws_init()
    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: bucket, Key: '', Body: ''};
    var file = process.argv[3];

    // var fileStream = fs.createReadStream(file);
    //     fileStream.on('error', function(err) {
    //     console.log('File Error', err);
    // });

    uploadParams.Body = body;
    // var path = require('path');
    uploadParams.Key = file_path;

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    } if (data) {
        console.log("Upload Success", data.Location);
    }
    });
}


module.exports.aws_upload_file = aws_upload_file
