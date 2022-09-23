const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const paisSelect = document.querySelector('#pais')
let ciudad
let pais

window.addEventListener('load', () => {
    consultarPaises()

    formulario.addEventListener('submit', buscarClima)

})


function buscarClima(e) {
    e.preventDefault()

    // Validar el formulario
    ciudad = document.querySelector('#ciudad').value
    pais = document.querySelector('#pais').value
    if (ciudad === "" || pais === "") {
        mostrarError('Ambos campos son obligatorios')
        return
    }

    // consultar API
    consultarAPI(ciudad, pais)
}

function consultarPaises() {
    const url = 'https://restcountries.com/v2/all'

    fetch(url)
        .then(response => response.json())
        .then(data => llenarSelectPaises(data))
}

function llenarSelectPaises(paises) {
    paises.forEach(pais => {
        const { name, alpha2Code } = pais

        // scripting para las opciones
        const opcion = document.createElement('option')
        opcion.textContent = name
        opcion.value = alpha2Code

        paisSelect.appendChild(opcion)
    })
}


function mostrarError(mensaje) {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
    })
}

function consultarAPI(ciudad, pais) {
    const API_KEY = 'c77096b8acc5f66f75df52db8ff5bd89'

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${API_KEY}`

    spinner()

    fetch(url)
        .then(response => response.json())
        .then(data => {
            limpiarHTML()
            if (data.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return
            }
            // Imprime la respuesta en el HTML
            mostrarClima(data)
        })
}

function mostrarClima(data) {
    const { main: { temp, temp_max, temp_min }, weather: { [0]: { icon, description } } } = data
    const centigrados = kelvinACentigrados(temp)
    const max = kelvinACentigrados(temp_max)
    const min = kelvinACentigrados(temp_min)

    const nombreCiudad = document.createElement('p')
    nombreCiudad.textContent = `${ciudad}, ${pais}`
    nombreCiudad.classList.add('font-bold', 'text-xl')

    //scripting icono
    const svgWeather = document.createElement('img')
    svgWeather.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    svgWeather.classList.add('mx-auto', 'my-2')


    const actual = document.createElement('p')
    actual.innerHTML = `
        ${centigrados} &#8451;
    `
    actual.classList.add('font-bold', 'text-6xl', 'my-2')

    // cambiar fondo dependiendo de la temperatura
    changeBackgroundGradient(centigrados)

    // descripcion clima
    const descripcion = document.createElement('p')
    descripcion.innerHTML = `${description}`

    const tempMaxima = document.createElement('p')
    tempMaxima.innerHTML = `
    Max: ${max} &#8451;
    `
    tempMaxima.classList.add('text-xl')

    const tempMinima = document.createElement('p')
    tempMinima.innerHTML = `
    Min: ${min} &#8451;
    `
    tempMinima.classList.add('text-xl')

    //contenedor para la temp maxima y minima
    const contenedorMaxMin = document.createElement('div')
    contenedorMaxMin.classList.add('mt-5', 'flex', 'justify-evenly')
    contenedorMaxMin.appendChild(tempMaxima)
    contenedorMaxMin.appendChild(tempMinima)

    const resultadoDiv = document.createElement('div')
    resultadoDiv.classList.add('text-center', 'text-white')
    resultadoDiv.appendChild(nombreCiudad)
    resultadoDiv.appendChild(svgWeather)
    resultadoDiv.appendChild(actual)
    resultadoDiv.appendChild(descripcion)
    resultadoDiv.appendChild(contenedorMaxMin)
    resultado.appendChild(resultadoDiv)

    formulario.reset()
}

const kelvinACentigrados = grados => parseInt(grados - 273.15)


function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {
    limpiarHTML()
    const divSpinner = document.createElement('div')
    divSpinner.classList.add('spinner')
    resultado.appendChild(divSpinner)
}


function changeBackgroundGradient(temp) {
    const html = document.querySelector('html')
    if (temp <= 25) {
        html.classList.add('menor20')
        html.classList.remove('menos30')
    } else {
        html.classList.add('menos30')
        html.classList.remove('menos20')

    }
}