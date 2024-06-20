import express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generate } from './utils';
import path from 'path';
import { getAllFiles } from './file';
import { uploadFileToBlob } from './azurestorage';
import dotenv from 'dotenv';
import fs from 'fs';
import {createClient} from 'redis';

const publisher = createClient(); //initialize Redis client (publisher)
publisher.connect(); // Connect to the Redis server

const subscriber = createClient(); //initialize Redis client (subscriber)
subscriber.connect(); // Connect to the Redis server

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const simplegit = simpleGit();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/deploy', async (req, res) => {
  try {
    const giturl = req.body.giturl; // Git URL from the request
    const id = generate(); // Generating random ID
    const clonePath = path.join(__dirname, `output/${id}`);
    
    await simplegit.clone(giturl, clonePath); // Cloning the git URL to the output folder
    console.log(`Cloned repo: ${giturl}`);
    
    const files = getAllFiles(clonePath); // Getting all the files in the folder and subfolders
    const containerName = 'vercel'; // Your Azure Blob Storage container name

    // Upload each file to Azure Blob Storage
    for (const file of files) {
        const relativePath = path.relative(clonePath, file); // Path relative to the cloned repository root
        const blobName = path.join(id, relativePath); // Prefix blob name with the generated ID
        await uploadFileToBlob(containerName, blobName, file);
    }

    console.log('Uploaded files:', files);
    publisher.lPush('build-queue', id); // Push the ID to the Redis list (deploy
    res.json({ id });
    //like insert in the database
    //status is like a table in the database
    //id is like a primary key
    //uploaded is like a value in the table
    publisher.hSet("status",id,"uploaded"); // Set the status of the deployment to uploaded in Redis hash table
    const value=await publisher.hGet("status",id);
    console.log(id,value);
  } catch (error) {
    console.error('Error deploying:', error);
    res.status(500).send('Deployment failed');
  }
});
//exposing a new endpoint to get the status of the deployment
app.get('/status', async (req, res) => {
    const id=req.query.id;
     //setInterval to check the status of the deployment every 5 seconds
     const value=await subscriber.hGet("status",id as string);
     res.json({
        status:value
     });
        
})
   


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
