// Constructores

/**
 * Constructor de seguros
 * @param marca
 * @param year
 * @param tipo
 * @constructor
 */
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

/**
 * Cotizar seguro
 * @returns {number}
 */
Seguro.prototype.cotizarSeguro = function () {
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
    }

    const diferencia = new Date().getFullYear() - this.year;

    cantidad -= ((diferencia * 3) * cantidad) / 100;

    if (this.tipo === 'basico'){
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() {}

/**
 * LLena las opciones de los años
 */
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

/**
 * Muestra el mensaje cotizado
 * @param mensaje
 * @param tipo
 */
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const  p = document.createElement('p');
    const btnSubmit = document.querySelector('button[type="submit"]');

    btnSubmit.classList.add('disabled');
    btnSubmit.disabled = true;

    if (tipo === 'error') {
        p.classList.add('error');
    } else {
        p.classList.add('correcto');
    }

    p.classList.add('mt-10');

    p.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-seguro');

    formulario.insertBefore(p, document.querySelector('#resultado'));

    setTimeout(() => {
        p.remove();
        btnSubmit.classList.remove('disabled');
        btnSubmit.disabled = false;
    }, 3000);
}

/**
 * Muestra el mensaje
 * @param seguro
 * @param total
 */
UI.prototype.mostrarResultado = (seguro, total) => {
    const { marca, year, tipo } = seguro;

    const div = document.createElement('div');
    div.classList.add('mt-10');
    const resultado = (parseInt(total)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    let textoMarca;

    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiático';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
    }

    div.innerHTML = `
        <h2 class="header">Tu Resumen:</h2>
        <ul class="list-none">
            <li class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></li>
            <li class="font-bold">Año: <span class="font-normal">${year}</span></li>
            <li class="font-bold">Tipo de seguro: <span class="font-normal">${tipo.toUpperCase()}</span></li>
            <li class="font-bold">Total: <span class="font-normal">$${resultado}</span></li>
        </ul>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
      spinner.style.display = 'none';
      resultadoDiv.appendChild(div);
    }, 3000)
}

// Funciones

/**
 * Cotizar seguro
 * @param e
 */
function cotizarSeguro(e) {
    e.preventDefault();

    const marca = this.elements.marca.value;
    const year = this.elements.year.value;
    const tipo = this.elements.tipo.value;

    if (marca === '' || year === '' || tipo === ''){
        return new UI().mostrarMensaje('Todos los campos son obligatorios','error');
    } else {
        new UI().mostrarMensaje('Cotizando...','exito');

        // Ocultando cotizaciones previas

        const resultados = document.querySelector('#resultado div');

        if (resultados !== null){
            resultados.remove();
        }
    }

    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    new UI().mostrarResultado(seguro, total);
}

/**
 * Inicializador
 */
document.addEventListener('DOMContentLoaded', () => {
    new UI().llenarOpciones(); // Llena el select con los años

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
});