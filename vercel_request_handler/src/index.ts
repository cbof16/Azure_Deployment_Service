import express, { Request, Response } from 'express';
import { getBlobContent } from './azurestorage';

const app = express();
const port = 3001;

app.get('/*', async (req: Request, res: Response) => {
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
    const { content, contentType } = await getBlobContent(blobName);
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
  } catch (error) {
    console.error(`Error fetching blob content for ${blobName}:`, error);
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
