import express from 'express';
import sharp from 'sharp';
import { existsSync } from 'node:fs';
const app = express();
const port = 3000;

const imagePath = '4.jpg';

// перевірка чи файл існує
if (!existsSync(imagePath)) {
  console.error('Файл 4.jpg не знайдено!');
  process.exit(1);
}

app.get('/img/:width/:height', async (req, res) => {
  const width = parseInt(req.params.width, 10);
  const height = parseInt(req.params.height, 10);

  console.log(`Request: ${width}x${height}`);

  if (!width || !height || width <= 0 || height <= 0) {
    return res.status(400).send('Invalid width or height');
  }

  res.setHeader('Content-Type', 'image/jpeg');

  try {
    const buffer = await sharp(imagePath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image');
  }
});

app.get('/', (req, res) => {
  res.redirect('/img/100/100');
});

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});