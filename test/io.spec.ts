import fs from 'fs';
import path from 'path';
import glob from 'glob';
import rimraf from 'rimraf';
import { input, Options } from '../src';

const findFiles = async (patten: string): Promise<string[]> => new Promise((resolve, reject) => {
  glob(patten, (err, files) => (err ? reject(err) : resolve(files)));
});

const inputPath = path.join(__dirname, '../test/files/sample.pdf');
const outputPath = path.join(__dirname, '../test/files/sample-img');
const pageCount = 2;
const options: Options = { format: 'png' };

describe.only('io', () => {
  // cleanup generated image files
  afterAll(async () => {
    const imgFiles = await findFiles(`${outputPath}*`);
    imgFiles.forEach((f) => rimraf.sync(f));
  });

  test('input as buffer', async () => {
    const buffer = fs.readFileSync(inputPath);
    const res = await input(buffer, {
      ...options,
    }).output();
    expect(res.length).toBe(pageCount);
  });

  test('error input', async () => {
    const buffer = Buffer.from('');
    try {
      await input(buffer, options).output();
    } catch (error) {
      expect(error).toEqual('Error opening a PDF file.');
    }
  });

  test('output as file', async () => {
    const res = await input(inputPath, options).output(outputPath);
    const imgFiles = await findFiles(`${outputPath}*`);
    expect(res).toBeNull();
    expect(imgFiles.length).toBe(pageCount);
  });

  test.only('output as buffer', async () => {
    console.time('buffer')
    const res = await input(inputPath, {
      ...options,
      singlefile: true,
      // stdOut: true,
    }).output();
    await fs.promises.writeFile(path.join(__dirname, 'abc.png'), Buffer.from(res[0]));
    console.timeEnd('buffer')
    expect(res.length).toBe(1);
  });
});
