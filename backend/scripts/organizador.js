const fs = require("fs");
const path = require("path");

const medidasValidas = ["300x250", "728x90", "160x600"];
const carpetasTipos = ["Awareness", "Consideracion", "Performance"];

const rutaEntrada = path.resolve(__dirname, "../archivos");
const rutaSalida = path.resolve(__dirname, "../organizados");

function detectarMedida(nombre) {
  return medidasValidas.find((m) => nombre.includes(m)) || null;
}

function detectarTipo(nombre) {
  return carpetasTipos.find((t) => nombre.toLowerCase().includes(t.toLowerCase())) || "Desconocido";
}

module.exports = async function () {
  const archivos = fs.readdirSync(rutaEntrada);

  archivos.forEach((archivo) => {
    const archivoPath = path.join(rutaEntrada, archivo);
    const medida = detectarMedida(archivo);
    const tipo = detectarTipo(archivo);
    const ext = path.extname(archivo).toLowerCase();

    if (!medida) return;

    const destinoDir = path.join(rutaSalida, tipo, medida);
    if (!fs.existsSync(destinoDir)) {
      fs.mkdirSync(destinoDir, { recursive: true });
    }

    const destinoPath = path.join(destinoDir, archivo);
    fs.copyFileSync(archivoPath, destinoPath);
    console.log(`✅ ${archivo} => ${destinoDir}`);
  });
};
