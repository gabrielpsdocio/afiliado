// Capturando os elementos do HTML
const btnConvert = document.getElementById('btn-convert');
const linkInput = document.getElementById('link-input');
const resultBox = document.getElementById('result-box');
const linkOutput = document.getElementById('link-output');
const btnCopy = document.getElementById('btn-copy');
const btnOpen = document.getElementById('btn-open');

// Seus IDs de Afiliado baseados nas suas prints
const MEUS_IDS = {
    amazon: 'brabiel06-20', 
    mercadolivre: 'gabzsss',
    shopee: 'SEU_ID_SHOPEE' // Atualize este depois
};

// Função para encurtar a URL usando a API gratuita do TinyURL
async function encurtarLink(urlLonga) {
    try {
        // Mostra um aviso de "Carregando" enquanto encurta
        linkOutput.textContent = "Gerando link curto... ⏳";
        resultBox.classList.add('active');

        const resposta = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlLonga)}`);
        
        if (resposta.ok) {
            const urlCurta = await resposta.text();
            return urlCurta;
        } else {
            return urlLonga; // Se o encurtador falhar por algum motivo, devolve o link longo (que ainda funciona)
        }
    } catch (erro) {
        console.error("Erro ao encurtar o link:", erro);
        return urlLonga;
    }
}

// Função principal de conversão (agora é async porque espera o encurtador)
async function converterLink() {
    const urlOriginal = linkInput.value.trim();

    if (!urlOriginal) {
        alert('Por favor, cole um link válido!');
        return;
    }

    try {
        let url = new URL(urlOriginal);
        let linkComissionado = '';

        // AMAZON (Garante a comissão injetando a tag)
        if (url.hostname.includes('amazon')) {
            url.searchParams.set('tag', MEUS_IDS.amazon);
            linkComissionado = url.toString();
        } 
        
        // MERCADO LIVRE
        else if (url.hostname.includes('mercadolivre') || url.hostname.includes('mercadoliva')) {
            // O ML costuma usar o parâmetro "af_id" ou campanha em links comuns
            url.searchParams.set('af_id', MEUS_IDS.mercadolivre);
            linkComissionado = url.toString();
        }

        // SHOPEE
        else if (url.hostname.includes('shopee')) {
            url.searchParams.set('ext_camp_id', MEUS_IDS.shopee);
            linkComissionado = url.toString();
        }

        else {
            alert('Loja não reconhecida! Suportamos Amazon, Shopee e Mercado Livre.');
            return;
        }

        // Agora pegamos o link comissionado longo e enviamos para o encurtador
        const linkFinalCurto = await encurtarLink(linkComissionado);

        // Exibir o resultado na tela
        linkOutput.textContent = linkFinalCurto;
        btnOpen.href = linkFinalCurto; 

    } catch (error) {
        alert('O link inserido não é válido. Copie o link inteiro do navegador.');
    }
}

// Evento de clique no botão Converter
btnConvert.addEventListener('click', converterLink);

// Evento de clique no botão Copiar
btnCopy.addEventListener('click', () => {
    const linkFinal = linkOutput.textContent;
    navigator.clipboard.writeText(linkFinal).then(() => {
        const textoOriginal = btnCopy.textContent;
        btnCopy.textContent = 'Copiado!';
        btnCopy.style.backgroundColor = '#e2e8f0';
        
        setTimeout(() => {
            btnCopy.textContent = textoOriginal;
            btnCopy.style.backgroundColor = '#ffffff';
        }, 2000);
    });
});