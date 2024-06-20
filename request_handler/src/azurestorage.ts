// azurestorage.ts
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string not found');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'vercel';

export async function getBlobContent(blobName: string): Promise<{ content: Buffer, contentType: string }> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  try {
    const downloadBlockBlobResponse = await blobClient.download(0);

    if (!downloadBlockBlobResponse.readableStreamBody) {
      throw new Error('Blob content stream is undefined');
    }

    const downloadedContent = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    const contentType = downloadBlockBlobResponse.contentType || 'application/octet-stream';

    return {
      content: downloadedContent,
      contentType,
    };
  } catch (error) {
    console.error(`Error downloading blob ${blobName}:`);
    throw error;
  }
}

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}
