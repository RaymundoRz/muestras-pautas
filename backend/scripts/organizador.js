const fs = require("fs");
const path = require("path");

const medidasValidas = ["300x250", "728x90", "160x600"];
const carpetasTipos = ["Awareness", "Consideracion", "Performance"];

const rutaEntrada = "./archivos"; // Cambia a tu ruta con los banners
const rutaSalida = "./organizados";

function detectarMedida(nombre) {
  for (let medida of medidasValidas) {
    if (nombre.includes(medida)) return medida;
  }
  return null;
}

function detectarTipo(nombre) {
  for (let tipo of carpetasTipos) {
    if (nombre.toLowerCase().includes(tipo.toLowerCase())) return tipo;
  }
  return "Desconocido";
}

function organizarArchivos() {
  const archivos = fs.readdirSync(rutaEntrada);

  archivos.forEach((archivo) => {
    const archivoPath = path.join(rutaEntrada, archivo);
    const medida = detectarMedida(archivo);
    const tipo = detectarTipo(archivo);
    const ext = path.extname(archivo).toLowerCase();

    if (!medida) return; // Ignorar si no tiene medida válida

    const destinoDir = path.join(rutaSalida, tipo, medida);
    if (!fs.existsSync(destinoDir)) {
      fs.mkdirSync(destinoDir, { recursive: true });
    }

    const destinoPath = path.join(destinoDir, archivo);
    fs.copyFileSync(archivoPath, destinoPath);
    console.log(`✅ ${archivo} => ${destinoDir}`);
  });
}

organizarArchivos();
