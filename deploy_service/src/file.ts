import fs from "fs";
import path from "path";

// This function takes a folder path as input and returns an array of all the file paths within that folder and its subfolders.
export const getAllFiles = (folderpath: string) => {
  // Initialize an empty array to store the file paths.
  let response: string[] = [];

  // Read all the files and folders within the specified folder path.
  const AllfilesandFolders = fs.readdirSync(folderpath);

  // Iterate through each file and folder.
  AllfilesandFolders.forEach((file) => {
    // Create the complete file path by joining the folder path and the current file/folder name.
    const filepath = path.join(folderpath, file);

    // Check if the current item is a directory.
    if (fs.statSync(filepath).isDirectory()) {
      // If it is a directory, recursively call the `getAllFiles` function to get the file paths within that directory.
      // Concatenate the returned file paths to the `response` array.
      response = response.concat(getAllFiles(filepath));
    } else {
      // If it is a file, add the file path to the `response` array.
      response.push(filepath);
    }
  });

  // Return the array of all file paths.
  return response;
};

