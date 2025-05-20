const fs = require('fs-extra');
const path = require('path');
const { google } = require('googleapis');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const CREDENTIALS_PATH = path.resolve(__dirname, 'credentials.json');
const TOKEN_PATH = path.resolve(__dirname, 'token.json');

const SLIDES_FOLDER = path.resolve(__dirname, 'slides');
const SCREENSHOT_FOLDER = path.resolve(__dirname, 'screenshots');
const DIFF_FOLDER = path.resolve(__dirname, 'diffs');
const ORGANIZADOS = path.resolve(__dirname, '../../organizados');

const tipos = ['Awareness', 'Consideracion', 'Performance'];
const medidas = ['300x250', '728x90', '160x600'];

async function loadAuth() {
  const credentials = await fs.readJson(CREDENTIALS_PATH);
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = await fs.readJson(TOKEN_PATH);
    oAuth2Client.setCredentials(token);
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/presentations.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    });

    console.log('🔐 Abre esta URL y pega el código:\n', authUrl);
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const code = await new Promise(resolve => rl.question('Introduce el código: ', resolve));
    rl.close();

    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens);
    await fs.writeJson(TOKEN_PATH, tokenResponse.tokens);
  }

  return oAuth2Client;
}

async function exportarSlidesComoImagenes(presentationId) {
  const auth = await loadAuth();
  const slides = google.slides({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });

  const { data: presentation } = await slides.presentations.get({ presentationId });

  console.log(`📄 Exportando ${presentation.slides.length} diapositivas: "${presentation.title}"`);
  await fs.ensureDir(SLIDES_FOLDER);

  for (let i = 0; i < presentation.slides.length; i++) {
    const slide = presentation.slides[i];
    const slideObjectId = slide.objectId;
    const exportUrl = `https://docs.google.com/presentation/d/${presentationId}/export/png?id=${presentationId}&pageid=${slideObjectId}`;
    const destPath = path.join(SLIDES_FOLDER, `slide_${i + 1}.png`);
    const dest = fs.createWriteStream(destPath);

    const res = await drive.files.export(
      {
        fileId: presentationId,
        mimeType: 'image/png',
      },
      { responseType: 'stream', params: { pageid: slideObjectId } }
    );

    await new Promise((resolve, reject) => {
      res.data.pipe(dest);
      dest.on('finish', () => {
        console.log(`✅ Slide ${i + 1} guardada como PNG`);
        resolve();
      });
      dest.on('error', reject);
    });
  }
}

async function capturarScreenshots() {
  const browser = await puppeteer.launch({ headless: true });
  await fs.ensureDir(SCREENSHOT_FOLDER);

  for (const tipo of tipos) {
    for (const medida of medidas) {
      const rutaHTML = path.join(ORGANIZADOS, tipo, medida, 'index.html');
      if (!fs.existsSync(rutaHTML)) continue;

      const page = await browser.newPage();
      const nombreArchivo = `${tipo}_${medida}.png`;
      const screenshotPath = path.join(SCREENSHOT_FOLDER, nombreArchivo);

      try {
        const [w, h] = medida.split('x').map(n => parseInt(n));
        await page.setViewport({ width: w, height: h });
        await page.goto(`file://${rutaHTML}`, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Captura completada: ${nombreArchivo}`);
      } catch (err) {
        console.warn(`❌ Error al capturar ${rutaHTML}: ${err.message}`);
      }

      await page.close();
    }
  }

  await browser.close();
}

async function compararVisualmente() {
  await fs.ensureDir(DIFF_FOLDER);
  const screenshots = await fs.readdir(SCREENSHOT_FOLDER);
  const slides = await fs.readdir(SLIDES_FOLDER);

  for (const img of screenshots) {
    const match = slides.find(s => path.basename(s).startsWith(path.basename(img)));
    if (!match) {
      console.warn(`⚠️ No hay slide correspondiente para ${img}`);
      continue;
    }

    const img1 = PNG.sync.read(fs.readFileSync(path.join(SCREENSHOT_FOLDER, img)));
    const img2 = PNG.sync.read(fs.readFileSync(path.join(SLIDES_FOLDER, match)));

    if (img1.width !== img2.width || img1.height !== img2.height) {
      console.warn(`⚠️ Dimensiones distintas entre ${img} y ${match}`);
      continue;
    }

    const diff = new PNG({ width: img1.width, height: img1.height });
    const diffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.1 });

    const diffPath = path.join(DIFF_FOLDER, `diff_${img}`);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    if (diffPixels > 0) {
      console.log(`❗ Diferencias detectadas en ${img} (${diffPixels} píxeles)`);
    } else {
      console.log(`✅ ${img} coincide con el slide`);
    }
  }
}

(async () => {
  const PRESENTATION_ID = '1GY9ePNT0uoYU3VRL39SvYXHcttobBWy4dvW646pbfHQ'; // 👈 tu presentación aquí

  await exportarSlidesComoImagenes(PRESENTATION_ID);
  await capturarScreenshots();
  await compararVisualmente();
})();
