
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
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

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

async function configureCors() {
    try {
        console.log(`Setting CORS for bucket: ${bucket}`);
        const command = new PutBucketCorsCommand({
            Bucket: bucket,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                        AllowedOrigins: [
                            'http://localhost:5173',
                            'http://localhost:5174',
                            'https://bouncyhachi.pages.dev'
                        ],
                        ExposeHeaders: ['ETag'],
                        MaxAgeSeconds: 3600
                    },
                ],
            },
        });

        const response = await s3Client.send(command);
        console.log('CORS Configuration applied successfully!', response);
    } catch (err) {
        console.error('Error applying CORS:', err);
        console.error('\nTIP: If this fails with AccessDenied, you might need to manually set CORS in the Cloudflare Dashboard for R2.');
    }
}

configureCors();
