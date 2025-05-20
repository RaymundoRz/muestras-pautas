const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const tipos = ["Awareness", "Consideracion", "Performance"];
const medidasValidas = ["300x250", "728x90", "160x600"];
const PORT = 3000;
const rutaRaiz = path.resolve(__dirname, "../../organizados");

function iniciarServidorLocal() {
  const app = express();
  app.use(express.static(rutaRaiz));

  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor local iniciado en http://localhost:${PORT}`);
  });

  return server;
}

async function verificarCTA(browser, url, tipo, medida) {
  const page = await browser.newPage();
  const resultado = { tipo, medida, url, status: "❌ No se encontró CTA" };

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

    const posiblesSelectores = ['a[href]', 'button', '[onclick*="location"]'];
    let encontrado = false;

    for (let selector of posiblesSelectores) {
      const elementos = await page.$$(selector);

      if (elementos.length > 0) {
        encontrado = true;

        // Usar la primera coincidencia
        const href = await page.$eval(selector, el => el.getAttribute("href"));
        const nuevaPagina = await browser.newPage();

        let destino = null;
        await nuevaPagina.setRequestInterception(true);
        nuevaPagina.on("request", request => {
          if (request.isNavigationRequest() && request.redirectChain().length === 0) {
            destino = request.url();
          }
          request.continue();
        });

        if (href && href.startsWith("http")) {
          await nuevaPagina.goto(href, { waitUntil: "domcontentloaded", timeout: 10000 });
          resultado.status = `✅ Redirecciona a ${destino || href}`;
        } else {
          await page.click(selector);
          await page.waitForTimeout(3000);
          const nuevaUrl = page.url();
          if (nuevaUrl !== url) {
            resultado.status = `✅ Clic redirige a ${nuevaUrl}`;
          } else {
            resultado.status = "⚠️ Clic no redirige (misma URL)";
          }
        }

        await nuevaPagina.close();
        break;
      }
    }

    if (!encontrado) {
      resultado.status = "❌ CTA no encontrado en el DOM";
    }
  } catch (error) {
    resultado.status = `❌ Error al procesar: ${error.message}`;
  }

  await page.close();
  return resultado;
}

async function ejecutarVerificacion() {
  const server = iniciarServidorLocal();
  const browser = await puppeteer.launch({ headless: true });

  const resultados = [];

  for (const tipo of tipos) {
    for (const medida of medidasValidas) {
      const indexLocal = path.join(rutaRaiz, tipo, medida, "index.html");
      if (!fs.existsSync(indexLocal)) continue;

      const url = `http://localhost:${PORT}/${tipo}/${medida}/index.html`;
      const resultado = await verificarCTA(browser, url, tipo, medida);
      resultados.push(resultado);
    }
  }

  await browser.close();
  server.close(() => {
    console.log("🛑 Servidor detenido.");
    console.log("\n📊 RESULTADOS:");
    resultados.forEach(r => {
      console.log(`🔹 [${r.tipo}/${r.medida}] → ${r.status}`);
    });
  });
}

ejecutarVerificacion();
