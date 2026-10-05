// const AWS = require('aws-sdk');

// const uploadToS3 = async (data, fileName) => {
//     var BUCKET_NAME = process.env.BUCKET_NAME;
//     var IAM_USER_KEY = process.env.IAM_USER_KEY;
//     var IAM_USER_SECRET = process.env.IAM_USER_SECRET;

//     const s3bucket = new AWS.S3({
//         accessKeyId: IAM_USER_KEY,
//         secretAccessKey: IAM_USER_SECRET,
//     })

//     var params = {
//         Bucket: BUCKET_NAME,
//         Key: fileName,
//         Body: data,
//         ACL: "public-read",
//     }

//     return new Promise((resolve, resject) => {
//         s3bucket.upload(params, (err, s3response) => {
//             if (err) {
//                 console.log("Something went wrong", err);
//                 resject(err);
//             } else {
//                 console.log("seccessfull", s3response);
//                 resolve(s3response.Location)
//                 return s3response.Location;
//             }
//         })
//     })

// }

// module.exports = {
//     uploadToS3
// };





const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const uploadToS3 = async (data, fileName, contentType = "application/octet-stream") => {
    try {
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,   // must add in .env
            credentials: {
                accessKeyId: process.env.IAM_USER_KEY,
                secretAccessKey: process.env.IAM_USER_SECRET,
            },
        });


        var params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: data,
            ACL: "public-read",
        };


        await s3Client.send(new PutObjectCommand(params));

        const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        console.log("Upload successful:", fileUrl);

        return fileUrl;

    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
};

module.exports = {
    uploadToS3
};
