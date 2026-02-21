import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import imageCompression from 'browser-image-compression';

const accountId = import.meta.env.VITE_R2_ACCOUNT_ID || import.meta.env.NEXT_PUBLIC_R2_ACCOUNT_ID;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID || import.meta.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY || import.meta.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY;
export const r2Bucket = import.meta.env.VITE_R2_BUCKET || import.meta.env.NEXT_PUBLIC_R2_BUCKET;
export const r2PublicUrl = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
    },
});

const validateR2Config = () => {
    if (!accountId || !accessKeyId || !secretAccessKey || !r2Bucket) {
        throw new Error('Missing Cloudflare R2 configuration. Please check your environment variables (VITE_R2_...).');
    }
};

export const compressAndUploadImage = async (file: File): Promise<string> => {
    try {
        validateR2Config();    // SVG bypass: Don't compress SVGs as they are vector-based
        if (file.type === 'image/svg+xml') {
            // For SVGs, we don't compress, just upload directly
            const fileExtension = file.name.split('.').pop() || 'svg';
            const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

            const command = new PutObjectCommand({
                Bucket: r2Bucket,
                Key: fileName,
                Body: file, // Use the original file for SVG
                ContentType: file.type,
            });

            await s3Client.send(command);
            return `${r2PublicUrl}/${fileName}`;
        }

        const options = {
            maxSizeMB: 1, // Compress to max 1MB
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        // Fallback for missing file.name on Blob returned by imageCompression
        const originalName = compressedFile.name || file.name || 'image.jpg';
        const fileExtension = originalName.split('.').pop() || 'jpg';
        const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: r2Bucket,
            Key: fileName,
            Body: compressedFile,
            ContentType: compressedFile.type,
        });

        await s3Client.send(command);

        // Return the public URL for the uploaded image
        return `${r2PublicUrl}/${fileName}`;
    } catch (error) {
        console.error('Error compressing/uploading image to R2:', error);
        throw error;
    }
};
