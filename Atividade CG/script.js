const dadosInflacao2024 = {
    meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    ipca: [0.42, 0.83, 0.16, 0.38, 0.46, 0.21, 0.38, -0.02, 0.44, 0.56, 0.39, 0.52],
    igpm: [0.07, -0.52, -0.47, 0.31, 0.89, 0.81, 0.61, 0.29, 0.62, 1.52, 1.30, 0.94]
};

document.addEventListener("DOMContentLoaded", function() {
    criarGraficoSVG();
});

function criarGraficoSVG() {
    const largura = 800;
    const altura = 400;
    const margem = { superior: 40, direita: 30, inferior: 60, esquerda: 60 };
    const larguraGrafico = largura - margem.esquerda - margem.direita;
    const alturaGrafico = altura - margem.superior - margem.inferior;

    const todosValores = [...dadosInflacao2024.ipca, ...dadosInflacao2024.igpm];
    const valorMinimo = Math.min(...todosValores);
    const valorMaximo = Math.max(...todosValores);
    
    const min = Math.floor(valorMinimo * 10) / 10 - 0.5;
    const max = Math.ceil(valorMaximo * 10) / 10 + 0.2;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", largura);
    svg.setAttribute("height", altura);
    svg.setAttribute("viewBox", `0 0 ${largura} ${altura}`);

    const titulo = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titulo.setAttribute("x", largura / 2);
    titulo.setAttribute("y", 20);
    titulo.setAttribute("text-anchor", "middle");
    titulo.setAttribute("font-size", "16px");
    titulo.setAttribute("font-weight", "bold");
    titulo.textContent = "Inflação Mensal (%) - 2024";
    titulo.setAttribute("opacity", "0");
    titulo.setAttribute("style", "animation: fadeIn 1s ease-in-out forwards;");
    svg.appendChild(titulo);

    const grupoGrade = document.createElementNS("http://www.w3.org/2000/svg", "g");
    grupoGrade.classList.add("grid");
    grupoGrade.setAttribute("style", "animation: aparecerGrid 1s ease-in-out forwards; animation-delay: 0.5s;");

    for (let i = 0; i < dadosInflacao2024.meses.length; i++) {
        const x = margem.esquerda + (i * (larguraGrafico / (dadosInflacao2024.meses.length - 1)));
        
        const linhaVertical = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linhaVertical.setAttribute("x1", x);
        linhaVertical.setAttribute("y1", margem.superior);
        linhaVertical.setAttribute("x2", x);
        linhaVertical.setAttribute("y2", altura - margem.inferior);
        linhaVertical.setAttribute("stroke", "#e0e0e0");
        linhaVertical.setAttribute("stroke-width", "1");
        grupoGrade.appendChild(linhaVertical);
        
        const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
        texto.setAttribute("x", x);
        texto.setAttribute("y", altura - margem.inferior + 20);
        texto.setAttribute("text-anchor", "middle");
        texto.setAttribute("font-size", "12px");
        texto.textContent = dadosInflacao2024.meses[i];
        texto.setAttribute("opacity", "0");
        texto.setAttribute("style", `animation: fadeIn 0.5s ease-in-out forwards; animation-delay: ${0.5 + i * 0.1}s`);
        svg.appendChild(texto);
    }
    
    svg.appendChild(grupoGrade);

    const numDivisoes = 8;
    for (let i = 0; i <= numDivisoes; i++) {
        const valor = min + ((max - min) * i / numDivisoes);
        const y = altura - margem.inferior - (i * (alturaGrafico / numDivisoes));
        
        const linhaHorizontal = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linhaHorizontal.setAttribute("x1", margem.esquerda);
        linhaHorizontal.setAttribute("y1", y);
        linhaHorizontal.setAttribute("x2", largura - margem.direita);
        linhaHorizontal.setAttribute("y2", y);
        linhaHorizontal.setAttribute("stroke", "#e0e0e0");
        linhaHorizontal.setAttribute("stroke-width", "1");
        grupoGrade.appendChild(linhaHorizontal);
        
        const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
        texto.setAttribute("x", margem.esquerda - 10);
        texto.setAttribute("y", y + 5);
        texto.setAttribute("text-anchor", "end");
        texto.setAttribute("font-size", "12px");
        texto.textContent = valor.toFixed(2);
        texto.setAttribute("opacity", "0");
        texto.setAttribute("style", `animation: fadeIn 0.5s ease-in-out forwards; animation-delay: ${0.5 + i * 0.1}s`);
        svg.appendChild(texto);
    }

    const rotuloY = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rotuloY.setAttribute("x", -altura / 2);
    rotuloY.setAttribute("y", 20);
    rotuloY.setAttribute("text-anchor", "middle");
    rotuloY.setAttribute("transform", "rotate(-90)");
    rotuloY.setAttribute("font-size", "14px");
    rotuloY.textContent = "Variação (%)";
    rotuloY.setAttribute("opacity", "0");
    rotuloY.setAttribute("style", "animation: fadeIn 1s ease-in-out forwards; animation-delay: 0.8s");
    svg.appendChild(rotuloY);

    const valorZero = 0;
    if (min < 0 && max > 0) {
        const yZero = altura - margem.inferior - ((valorZero - min) / (max - min) * alturaGrafico);
        const linhaZero = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linhaZero.setAttribute("x1", margem.esquerda);
        linhaZero.setAttribute("y1", yZero);
        linhaZero.setAttribute("x2", largura - margem.direita);
        linhaZero.setAttribute("y2", yZero);
        linhaZero.setAttribute("stroke", "#000");
        linhaZero.setAttribute("stroke-width", "1.5");
        linhaZero.setAttribute("stroke-dasharray", "5,5");
        linhaZero.setAttribute("opacity", "0");
        linhaZero.setAttribute("style", "animation: fadeIn 1s ease-in-out forwards; animation-delay: 1s");
        svg.appendChild(linhaZero);
    }

    const linhaIPCA = desenharLinha(dadosInflacao2024.ipca, "#4285F4", min, max, margem, larguraGrafico, alturaGrafico);
    linhaIPCA.classList.add("linha-animada");
    linhaIPCA.setAttribute("style", "animation-delay: 1.2s");
    svg.appendChild(linhaIPCA);

    const linhaIGPM = desenharLinha(dadosInflacao2024.igpm, "#EA4335", min, max, margem, larguraGrafico, alturaGrafico);
    linhaIGPM.classList.add("linha-animada");
    linhaIGPM.setAttribute("style", "animation-delay: 1.5s");
    svg.appendChild(linhaIGPM);

    adicionarPontos(dadosInflacao2024.ipca, "#4285F4", min, max, margem, larguraGrafico, alturaGrafico, svg, 2.0);
    
    adicionarPontos(dadosInflacao2024.igpm, "#EA4335", min, max, margem, larguraGrafico, alturaGrafico, svg, 2.3);

    document.getElementById("grafico-container").appendChild(svg);
}

function desenharLinha(dados, cor, min, max, margem, larguraGrafico, alturaGrafico) {
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = "";

    for (let i = 0; i < dados.length; i++) {
        const x = margem.esquerda + (i * (larguraGrafico / (dados.length - 1)));
        const y = (margem.superior + alturaGrafico) - ((dados[i] - min) / (max - min) * alturaGrafico);
        
        if (i === 0) {
            d += `M ${x} ${y}`;
        } else {
            d += ` L ${x} ${y}`;
        }
    }

    pathElement.setAttribute("d", d);
    pathElement.setAttribute("fill", "none");
    pathElement.setAttribute("stroke", cor);
    pathElement.setAttribute("stroke-width", "2.5");
    return pathElement;
}

function adicionarPontos(dados, cor, min, max, margem, larguraGrafico, alturaGrafico, svg, tempoBase) {
    for (let i = 0; i < dados.length; i++) {
        const x = margem.esquerda + (i * (larguraGrafico / (dados.length - 1)));
        const y = (margem.superior + alturaGrafico) - ((dados[i] - min) / (max - min) * alturaGrafico);
        
        const circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circulo.setAttribute("cx", x);
        circulo.setAttribute("cy", y);
        circulo.setAttribute("r", "4");
        circulo.setAttribute("fill", cor);
        circulo.classList.add("ponto");
        circulo.setAttribute("style", `animation: aparecerPontos 0.5s ease-out forwards; animation-delay: ${tempoBase + i * 0.1}s`);
        
        const titulo = document.createElementNS("http://www.w3.org/2000/svg", "title");
        titulo.textContent = `${dados[i].toFixed(2)}%`;
        circulo.appendChild(titulo);
        
        svg.appendChild(circulo);
    }
}