"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToBlob = void 0;
// Import necessary modules from the Azure Storage Blob SDK, dotenv for environment variables,
// and Node.js built-in modules for file system operations and path handling.
const storage_blob_1 = require("@azure/storage-blob");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables from a .env file into process.env
dotenv_1.default.config();
// Retrieve the Azure Storage connection string from environment variables
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=verceltest;AccountKey=+Se/hYjcgxRH+we/6or4NlyeeW2mZkjh+kWtWYCCHy0Abp0FmZZ35YcA88ED+ZfYFJ0sdcANW/3r+AStSczAPA==;EndpointSuffix=core.windows.net";
// Create an instance of BlobServiceClient using the connection string
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
// Function to upload a file to Azure Blob Storage
function uploadFileToBlob(containerName, blobName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get a reference to a container client for the specified container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Ensure the container exists, creating it if necessary
        yield containerClient.createIfNotExists();
        // Get a reference to a block blob client for the specified blob within the container
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // Read the file content from the specified file path into a Buffer
        const data = fs_1.default.readFileSync(filePath);
        // Upload the file content to Azure Blob Storage
        yield blockBlobClient.upload(data, data.length);
    });
}
exports.uploadFileToBlob = uploadFileToBlob;
