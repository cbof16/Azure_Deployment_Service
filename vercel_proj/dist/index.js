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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const file_1 = require("./file");
const azurestorage_1 = require("./azurestorage");
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)(); //initialize Redis client (publisher)
publisher.connect(); // Connect to the Redis server
const subscriber = (0, redis_1.createClient)(); //initialize Redis client (subscriber)
subscriber.connect(); // Connect to the Redis server
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const simplegit = (0, simple_git_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/deploy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const giturl = req.body.giturl; // Git URL from the request
        const id = (0, utils_1.generate)(); // Generating random ID
        const clonePath = path_1.default.join(__dirname, `output/${id}`);
        yield simplegit.clone(giturl, clonePath); // Cloning the git URL to the output folder
        console.log(`Cloned repo: ${giturl}`);
        const files = (0, file_1.getAllFiles)(clonePath); // Getting all the files in the folder and subfolders
        const containerName = 'vercel'; // Your Azure Blob Storage container name
        // Upload each file to Azure Blob Storage
        for (const file of files) {
            const relativePath = path_1.default.relative(clonePath, file); // Path relative to the cloned repository root
            const blobName = path_1.default.join(id, relativePath); // Prefix blob name with the generated ID
            yield (0, azurestorage_1.uploadFileToBlob)(containerName, blobName, file);
        }
        console.log('Uploaded files:', files);
        publisher.lPush('build-queue', id); // Push the ID to the Redis list (deploy
        res.json({ id });
        //like insert in the database
        //status is like a table in the database
        //id is like a primary key
        //uploaded is like a value in the table
        publisher.hSet("status", id, "uploaded"); // Set the status of the deployment to uploaded in Redis hash table
        const value = yield publisher.hGet("status", id);
        console.log(id, value);
    }
    catch (error) {
        console.error('Error deploying:', error);
        res.status(500).send('Deployment failed');
    }
}));
//exposing a new endpoint to get the status of the deployment
app.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    //setInterval to check the status of the deployment every 5 seconds
    const value = yield subscriber.hGet("status", id);
    res.json({
        status: value
    });
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
