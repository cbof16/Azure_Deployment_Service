import { uploadFileToBlob } from "./azurestorage";
import { getAllFiles } from "./file";
import path from "path";

export const copyfinalbuild = async (id: string) => {
  const folderPath = path.join(__dirname, `${id}/build`);
  const allFiles = getAllFiles(folderPath);

  console.log(`Uploading files from folder: ${folderPath}`);

  // Iterate over each file and upload it to Azure Blob Storage
  for (const file of allFiles) {
    const relativePath = path.relative(folderPath, file);
    // Include 'dist' and 'id' in the blob name to create the desired folder structure
    const blobName = path.join('dist', id, relativePath).replace(/\\/g, '/'); 
    console.log(`Uploading file: ${file} as blob: ${blobName}`);
    await uploadFileToBlob('vercel', blobName, file); // Upload the file
  }
}
