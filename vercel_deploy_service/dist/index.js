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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const downloadazure_1 = require("./downloadazure");
const utils_1 = require("./utils");
const copyfilebuild_1 = require("./copyfilebuild");
// Create a Redis client
const subscriber = (0, redis_1.createClient)();
subscriber.connect(); //connects to the Redis server by default on localhost:6379
const publisher = (0, redis_1.createClient)();
publisher.connect(); //connects to the Redis server by default on localhost:6379
//you can't use the same client to publish and subscribe, so we need to create a new client for publishing
// Function to pull values from the Redis queue
function pullFromQueue() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const response = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            console.log(response);
            yield (0, downloadazure_1.downloadAzureBlobFolder)('vercel', `${response === null || response === void 0 ? void 0 : response.element}`);
            console.log('Files downloaded successfully');
            yield (0, utils_1.buildProject)(`${response === null || response === void 0 ? void 0 : response.element}`);
            console.log('Project built successfully');
            yield (0, copyfilebuild_1.copyfinalbuild)(`${response === null || response === void 0 ? void 0 : response.element}`);
            console.log('Files copied to Azure Blob Storage successfully');
            publisher.hSet("status", `${response === null || response === void 0 ? void 0 : response.element}`, "deployed");
        }
    });
}
// Start pulling values from the queue
pullFromQueue();
