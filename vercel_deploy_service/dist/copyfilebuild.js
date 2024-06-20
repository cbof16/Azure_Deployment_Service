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
exports.copyfinalbuild = void 0;
const azurestorage_1 = require("./azurestorage");
const file_1 = require("./file");
const path_1 = __importDefault(require("path"));
const copyfinalbuild = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const folderPath = path_1.default.join(__dirname, `${id}/build`);
    const allFiles = (0, file_1.getAllFiles)(folderPath);
    console.log(`Uploading files from folder: ${folderPath}`);
    // Iterate over each file and upload it to Azure Blob Storage
    for (const file of allFiles) {
        const relativePath = path_1.default.relative(folderPath, file);
        // Include 'dist' and 'id' in the blob name to create the desired folder structure
        const blobName = path_1.default.join('dist', id, relativePath).replace(/\\/g, '/');
        console.log(`Uploading file: ${file} as blob: ${blobName}`);
        yield (0, azurestorage_1.uploadFileToBlob)('vercel', blobName, file); // Upload the file
    }
});
exports.copyfinalbuild = copyfinalbuild;
