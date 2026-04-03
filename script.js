// Pega o elemento do visor pelo ID
const display = document.getElementById('display');

// Adiciona os números clicados ao visor
function appendNumber(number) {
    if (display.innerText === '0' || display.innerText === 'Erro') {
        display.innerText = number;
    } else {
        display.innerText += number;
    }
}

// Adiciona os operadores (+, -, *, /, %)
function appendOperator(operator) {
    // Evita adicionar um operador se o visor estiver mostrando 'Erro'
    if (display.innerText === 'Erro') return;

    const lastChar = display.innerText.slice(-1);
    
    // Se o último caractere já for um operador, nós o substituímos para evitar erros (ex: "++")
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + operator;
    } else {
        display.innerText += operator;
    }
}

// Botão AC - Limpa tudo
function clearDisplay() {
    display.innerText = '0';
}

// Botão DEL - Apaga o último dígito
function deleteDigit() {
    if (display.innerText === 'Erro' || display.innerText.length === 1) {
        display.innerText = '0';
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
}

// Botão = - Calcula o resultado
function calculate() {
    try {
        // A função eval() avalia a string matemática e retorna o resultado
        // Nota: para calculadoras simples, eval atende muito bem.
        let result = eval(display.innerText);
        
        // Verifica se é uma divisão por zero (que resulta em Infinity no JavaScript)
        if (!isFinite(result)) {
            display.innerText = 'Erro';
        } else {
            // Arredonda resultados com muitas casas decimais para manter limpo
            display.innerText = Math.round(result * 100000000) / 100000000;
        }
    } catch (error) {
        // Caso aconteça uma conta impossível de ler (ex: "5+/")
        display.innerText = 'Erro';
    }
}