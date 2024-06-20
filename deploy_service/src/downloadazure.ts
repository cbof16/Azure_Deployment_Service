import { BlobServiceClient } from '@azure/storage-blob';
import fs from 'fs';
import path from 'path';

const connectionString = "DefaultEndpointsProtocol=https;AccountName=verceltest;AccountKey=+Se/hYjcgxRH+we/6or4NlyeeW2mZkjh+kWtWYCCHy0Abp0FmZZ35YcA88ED+ZfYFJ0sdcANW/3r+AStSczAPA==;EndpointSuffix=core.windows.net"; // Azure Blob Storage connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export async function downloadAzureBlobFolder(containerName: string, prefix: string) {
    // Get a reference to the container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // List blobs in the specified folder
    const blobItems = containerClient.listBlobsFlat({ prefix });

    // Iterate through blob items
    for await (const blobItem of blobItems) {
        // Construct local file path
        const localFilePath = path.join(__dirname, blobItem.name);

        // Ensure the local directory exists
        const dirName = path.dirname(localFilePath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        // Download the blob to the local file
        await downloadBlob(containerName, blobItem.name, localFilePath);
    }
}

async function downloadBlob(containerName: string, blobName: string, filePath: string): Promise<void> {
    // Get a reference to the container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a reference to the blob client
    const blobClient = containerClient.getBlockBlobClient(blobName);

    // Download the blob content to a buffer
    const downloadResponse = await blobClient.download();

    // Create a writeable stream to save the blob content to a file
    const fileStream = fs.createWriteStream(filePath);

    // Pipe the blob content to the file stream
    await new Promise<void>((resolve, reject) => {
        downloadResponse.readableStreamBody!.pipe(fileStream)
            .on('error', reject)
            .on('finish', () => {
                fileStream.end();
                resolve();
            });
    });
}
