// Import necessary modules from the Azure Storage Blob SDK, dotenv for environment variables,
// and Node.js built-in modules for file system operations and path handling.
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from a .env file into process.env
dotenv.config();

// Retrieve the Azure Storage connection string from environment variables
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Check if the Azure Storage connection string is available
if (!AZURE_STORAGE_CONNECTION_STRING) {
  // If the connection string is not found, throw an error
  throw new Error('Azure Storage connection string not found');
}

// Create an instance of BlobServiceClient using the connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Function to upload a file to Azure Blob Storage
export async function uploadFileToBlob(containerName: string, blobName: string, filePath: string): Promise<void> {
  // Get a reference to a container client for the specified container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Ensure the container exists, creating it if necessary
  await containerClient.createIfNotExists();

  // Get a reference to a block blob client for the specified blob within the container
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Read the file content from the specified file path into a Buffer
  const data = fs.readFileSync(filePath);

  // Upload the file content to Azure Blob Storage
  await blockBlobClient.upload(data, data.length);
}
