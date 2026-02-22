
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const accountId = envConfig.VITE_R2_ACCOUNT_ID;
const accessKeyId = envConfig.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = envConfig.VITE_R2_SECRET_ACCESS_KEY;
const bucket = envConfig.VITE_R2_BUCKET;

console.log('Testing R2 with:');
console.log('- Account ID:', accountId);
console.log('- Bucket:', bucket);

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

async function testUpload() {
    try {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: `test-connection-${Date.now()}.txt`,
            Body: 'Hello R2 from test script',
            ContentType: 'text/plain',
        });

        console.log('Sending PutObjectCommand...');
        const response = await s3Client.send(command);
        console.log('Success! Response:', response);
    } catch (err) {
        console.error('Error during R2 test:', err);
    }
}

testUpload();
