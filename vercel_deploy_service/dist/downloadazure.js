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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAzureBlobFolder = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connectionString = "DefaultEndpointsProtocol=https;AccountName=verceltest;AccountKey=+Se/hYjcgxRH+we/6or4NlyeeW2mZkjh+kWtWYCCHy0Abp0FmZZ35YcA88ED+ZfYFJ0sdcANW/3r+AStSczAPA==;EndpointSuffix=core.windows.net"; // Azure Blob Storage connection string
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
function downloadAzureBlobFolder(containerName, prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        // Get a reference to the container client
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // List blobs in the specified folder
        const blobItems = containerClient.listBlobsFlat({ prefix });
        try {
            // Iterate through blob items
            for (var _d = true, blobItems_1 = __asyncValues(blobItems), blobItems_1_1; blobItems_1_1 = yield blobItems_1.next(), _a = blobItems_1_1.done, !_a; _d = true) {
                _c = blobItems_1_1.value;
                _d = false;
                const blobItem = _c;
                // Construct local file path
                const localFilePath = path_1.default.join(__dirname, blobItem.name);
                // Ensure the local directory exists
                const dirName = path_1.default.dirname(localFilePath);
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                // Download the blob to the local file
                yield downloadBlob(containerName, blobItem.name, localFilePath);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = blobItems_1.return)) yield _b.call(blobItems_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.downloadAzureBlobFolder = downloadAzureBlobFolder;
function downloadBlob(containerName, blobName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get a reference to the container client
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Get a reference to the blob client
        const blobClient = containerClient.getBlockBlobClient(blobName);
        // Download the blob content to a buffer
        const downloadResponse = yield blobClient.download();
        // Create a writeable stream to save the blob content to a file
        const fileStream = fs_1.default.createWriteStream(filePath);
        // Pipe the blob content to the file stream
        yield new Promise((resolve, reject) => {
            downloadResponse.readableStreamBody.pipe(fileStream)
                .on('error', reject)
                .on('finish', () => {
                fileStream.end();
                resolve();
            });
        });
    });
}
