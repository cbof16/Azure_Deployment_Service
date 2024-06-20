"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// This function takes a folder path as input and returns an array of all the file paths within that folder and its subfolders.
const getAllFiles = (folderpath) => {
    // Initialize an empty array to store the file paths.
    let response = [];
    // Read all the files and folders within the specified folder path.
    const AllfilesandFolders = fs_1.default.readdirSync(folderpath);
    // Iterate through each file and folder.
    AllfilesandFolders.forEach((file) => {
        // Create the complete file path by joining the folder path and the current file/folder name.
        const filepath = path_1.default.join(folderpath, file);
        // Check if the current item is a directory.
        if (fs_1.default.statSync(filepath).isDirectory()) {
            // If it is a directory, recursively call the `getAllFiles` function to get the file paths within that directory.
            // Concatenate the returned file paths to the `response` array.
            response = response.concat((0, exports.getAllFiles)(filepath));
        }
        else {
            // If it is a file, add the file path to the `response` array.
            response.push(filepath);
        }
    });
    // Return the array of all file paths.
    return response;
};
exports.getAllFiles = getAllFiles;
