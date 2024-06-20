import {createClient,commandOptions} from 'redis';
import { downloadAzureBlobFolder } from './downloadazure';
import { buildProject } from './utils';
import { copyfinalbuild } from './copyfilebuild';
// Create a Redis client
const subscriber = createClient();
subscriber.connect(); //connects to the Redis server by default on localhost:6379

const publisher = createClient();
publisher.connect(); //connects to the Redis server by default on localhost:6379
//you can't use the same client to publish and subscribe, so we need to create a new client for publishing



// Function to pull values from the Redis queue
async function pullFromQueue() {
    while(1){
      const response=await subscriber.brPop(commandOptions({isolated:true}),'build-queue', 0);
      console.log(response);
      await downloadAzureBlobFolder('vercel', `${response?.element}`);
      console.log('Files downloaded successfully');
      await buildProject(`${response?.element}`);
      console.log('Project built successfully');
      await copyfinalbuild(`${response?.element}`);
      console.log('Files copied to Azure Blob Storage successfully');
      publisher.hSet("status",`${response?.element}`,"deployed");
    }

}

// Start pulling values from the queue
pullFromQueue();