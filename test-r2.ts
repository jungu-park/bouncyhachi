import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const accountId = process.env.VITE_R2_ACCOUNT_ID;
const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.VITE_R2_BUCKET;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
    },
});

async function testUpload() {
    try {
        console.log('Attempting test upload to R2...');
        const command = new PutObjectCommand({
            Bucket: r2Bucket,
            Key: `test-${Date.now()}.txt`,
            Body: 'Hello from verification script',
            ContentType: 'text/plain',
        });

        await s3Client.send(command);
        console.log('✅ R2 Upload Success!');
    } catch (error) {
        console.error('❌ R2 Upload Failed:', error);
    }
}

testUpload();
