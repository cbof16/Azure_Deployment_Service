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
const azurestorage_1 = require("./azurestorage");
const app = (0, express_1.default)();
const port = 3001;
app.get('/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    const id = host.split('.')[0];
    const filePath = req.path;
    if (!id || !filePath) {
        res.status(400).send('Bad Request');
        return;
    }
    const blobName = `dist/${id}${filePath}`;
    console.log(`Attempting to fetch blob: ${blobName}`);
    try {
        const { content, contentType } = yield (0, azurestorage_1.getBlobContent)(blobName);
        console.log(`Fetched blob content type: ${contentType}`);
        const mimeType = filePath.endsWith('.html')
            ? 'text/html'
            : filePath.endsWith('.css')
                ? 'text/css'
                : filePath.endsWith('.js')
                    ? 'application/javascript'
                    : contentType;
        res.set('Content-Type', mimeType);
        res.send(content);
    }
    catch (error) {
        console.error(`Error fetching blob content for ${blobName}:`, error);
        res.status(404).send('File not found');
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
