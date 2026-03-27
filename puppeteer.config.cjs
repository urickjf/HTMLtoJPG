const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Diz ao Puppeteer para salvar o Chrome dentro da pasta do projeto
  // Isso evita que o Render "esqueça" o navegador após o build
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
