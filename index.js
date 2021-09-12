import fetch from 'node-fetch';
import fs from 'fs';
import ReadLine from 'readline';

const downloadImages = async (pageUrl, altTextMatcher, startingIndexString) => {
  const startingIdx = startingIndexString ? parseInt(startingIndexString, 10) : undefined;
  const urlRegex = new RegExp(
    `(?<=img src=")https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*(?=" alt=('|")${altTextMatcher}))`,
    'g',
  );
  const comicResponse = await fetch(pageUrl);
  const comicHtml = await comicResponse.text();
  const urls = comicHtml.match(urlRegex);
  urls.map(downloadImage(startingIdx));
};

const downloadImage =
  (startingIdx = 0) =>
  async (url, index) => {
    const imgResponse = await fetch(url);
    const buff = await imgResponse.buffer();
    fs.writeFile(`out/${index + startingIdx}.jpg`, buff, () => {
      console.log('Successfully downloaded file ' + url);
    });
  };

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the comic url: ', (comicUrl) => {
  rl.question('Enter the alt text matcher: ', (altTextMatcher) => {
    rl.question('Enter the starting index (optional): ', (startingIndexString) => {
      downloadImages(comicUrl, altTextMatcher, startingIndexString);
      rl.close();
    });
  });
});
