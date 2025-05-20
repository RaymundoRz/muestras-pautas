const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const carpetaBase = path.join(__dirname, "../../organizados");
const medidasValidas = ["300x250", "728x90", "160x600"];
const tipos = ["Awareness", "Consideracion", "Performance"];

function revisarHTML(archivoHtml) {
  const contenido = fs.readFileSync(archivoHtml, "utf-8");
  const $ = cheerio.load(contenido);

  let errores = [];

  // 1. CTA
  const cta = $('a[href], button, [onclick*="location"], [onclick*="window.location"]');
  if (cta.length === 0) {
    errores.push("❌ No se encontró un CTA (link o botón con redirección)");
  }

  // 2. Incentivo
  const texto = $('body').text();
  const incentivoRegex = /\$\s?\d{1,3}(,\d{3})*(\.\d{2})?/; // ej: $400,900
  if (!incentivoRegex.test(texto) && !texto.toLowerCase().includes("desde")) {
    errores.push("⚠️ No se detectó incentivo de precio (ej: '$400,900' o 'desde')");
  }

  // 3. Nombre de modelo (suponemos que puede estar en un <h1>, <h2> o texto visible)
  const posiblesModelos = $('h1, h2, h3, p, span').text().trim();
  if (!posiblesModelos || posiblesModelos.length < 3) {
    errores.push("⚠️ No se detectó un nombre de modelo visible");
  }

  return errores;
}

function validarCarpetaMedida(carpeta) {
  const archivos = fs.readdirSync(carpeta);
  const html = archivos.find(f => f.toLowerCase() === "index.html");
  const jpgs = archivos.filter(f => f.toLowerCase().endsWith(".jpg"));

  let errores = [];

  if (!html) errores.push("❌ Falta archivo index.html");
  if (jpgs.length === 0) errores.push("❌ No hay archivos .jpg (estáticos)");

  if (html) {
    const rutaHtml = path.join(carpeta, html);
    const resultadoHtml = revisarHTML(rutaHtml);
    errores.push(...resultadoHtml);
  }

  return errores;
}

function validarTodos() {
  for (let tipo of tipos) {
    for (let medida of medidasValidas) {
      const carpeta = path.join(carpetaBase, tipo, medida);
      if (!fs.existsSync(carpeta)) continue;

      const errores = validarCarpetaMedida(carpeta);
      if (errores.length > 0) {
        console.log(`🔍 Validación para ${tipo}/${medida}`);
        errores.forEach(e => console.log("   ", e));
      } else {
        console.log(`✅ ${tipo}/${medida} sin errores.`);
      }
    }
  }
}

validarTodos();
