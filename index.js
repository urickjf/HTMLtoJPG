const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

// Aumentamos o limite para receber HTMLs grandes se necessário
app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => res.send('O Renderizador está Online!'));
app.post('/render', async (req, res) => {
    const { html } = req.body;

    if (!html) {
        return res.status(400).send('Faltou o HTML no corpo da requisição.');
    }

    let browser;
    try {
        // Configurações específicas para rodar em servidores (Linux/Docker)
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        });

        const page = await browser.newPage();
        
        // TRAVA O FRAME: Aqui garantimos que não existam barras pretas laterais
        await page.setViewport({ 
            width: 1000, 
            height: 1490, 
            deviceScaleFactor: 2 // Opcional: use 2 para qualidade "Retina"
        });

        // Define o conteúdo e espera as fontes (Google Fonts) carregarem
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Tira o print em JPEG (mais leve para o Telegram)
        const imageBuffer = await page.screenshot({ 
            type: 'jpeg', 
            quality: 90,
            fullPage: false 
        });

        await browser.close();

        res.set('Content-Type', 'image/jpeg');
        res.send(imageBuffer);

    } catch (error) {
        if (browser) await browser.close();
        console.error(error);
        res.status(500).send('Erro na renderização: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de renderização rodando na porta ${PORT}`);
});
