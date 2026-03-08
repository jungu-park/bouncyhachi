
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const {
    VITE_R2_ACCOUNT_ID,
    VITE_R2_ACCESS_KEY_ID,
    VITE_R2_SECRET_ACCESS_KEY,
    VITE_R2_BUCKET,
    VITE_R2_PUBLIC_URL
} = process.env;

async function runDiagnostic() {
    console.log("--- R2 Diagnostic Start ---");
    console.log(`Bucket: ${VITE_R2_BUCKET}`);
    console.log(`Public URL: ${VITE_R2_PUBLIC_URL}`);

    const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: VITE_R2_ACCESS_KEY_ID,
            secretAccessKey: VITE_R2_SECRET_ACCESS_KEY,
        },
    });

    const testFilename = `diagnostic-${Date.now()}.txt`;
    const testContent = "R2 Public Access Test Content";

    try {
        console.log(`\n1. Attempting to upload ${testFilename}...`);
        await s3.send(new PutObjectCommand({
            Bucket: VITE_R2_BUCKET,
            Key: testFilename,
            Body: testContent,
            ContentType: "text/plain",
        }));
        console.log("✅ Upload successful!");

        const testUrl = `${VITE_R2_PUBLIC_URL.replace(/\/$/, '')}/${testFilename}`;
        console.log(`\n2. Verification URL: ${testUrl}`);
        console.log("👉 Please click the link above in your browser.");
        console.log("   If you see 'R2 Public Access Test Content', R2 is configured correctly.");
        console.log("   If you see 404 or Access Denied, you need to enable 'Public Access' in Cloudflare R2 dashboard.");

    } catch (err) {
        console.error("\n❌ Diagnostic Failed:");
        console.error(err);
    }
}

runDiagnostic();
