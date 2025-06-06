const puppeteer = require("puppeteer");
const express = require("express");
const path = require("path");
const fs = require("fs");

const tipos = ["Awareness", "Consideracion", "Performance"];
const medidasValidas = ["300x250", "728x90", "160x600"];
const rutaRaiz = path.resolve(__dirname, "../organizados");

module.exports = async function () {
  const PORT = 4001;
  const app = express();
  app.use(express.static(rutaRaiz));
  const server = app.listen(PORT);

  const browser = await puppeteer.launch({ headless: true });

  for (const tipo of tipos) {
    for (const medida of medidasValidas) {
      const indexPath = path.join(rutaRaiz, tipo, medida, "index.html");
      if (!fs.existsSync(indexPath)) continue;

      const url = `http://localhost:${PORT}/${tipo}/${medida}/index.html`;
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

      let encontrado = false;
      const posiblesSelectores = ['a[href]', 'button', '[onclick*="location"]'];

      for (let selector of posiblesSelectores) {
        const elementos = await page.$$(selector);
        if (elementos.length > 0) {
          encontrado = true;
          const nuevaPage = await browser.newPage();

          try {
            const href = await page.$eval(selector, el => el.getAttribute("href"));
            if (href && href.startsWith("http")) {
              await nuevaPage.goto(href, { waitUntil: "domcontentloaded", timeout: 10000 });
              console.log(`✅ ${tipo}/${medida} → Redirige a ${href}`);
            } else {
              await page.click(selector);
              await page.waitForTimeout(3000);
              const finalUrl = page.url();
              console.log(`✅ ${tipo}/${medida} → Redirige a ${finalUrl}`);
            }
          } catch (err) {
            console.warn(`❌ Error en ${tipo}/${medida}: ${err.message}`);
          }

          await nuevaPage.close();
          break;
        }
      }

      if (!encontrado) {
        console.log(`❌ ${tipo}/${medida} → No se encontró CTA`);
      }

      await page.close();
    }
  }

  await browser.close();
  server.close();
};
