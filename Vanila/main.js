const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // configurando todo el fondo del lienzo en blanco, por lo que el fondo de la imagen descargada será blanco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // establecer el estilo de relleno de nuevo en el color seleccionado, será el color del pincel
}

window.addEventListener("load", () => {
    // establecer el ancho/alto del lienzo... offsetwidth/height devuelve el ancho/alto visible de un elemento
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // si el color de relleno no está marcado, dibuja un rectángulo con borde; de lo contrario, dibuja un rectángulo con fondo
    if(!fillColor.checked) {
        // creando círculo de acuerdo con el puntero del mouse
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creando una nueva ruta para dibujar el círculo
    // obtener el radio del círculo según el puntero del mouse
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creando círculo de acuerdo con el puntero del mouse
    fillColor.checked ? ctx.fill() : ctx.stroke(); // si el color de relleno está marcado, rellenar el círculo; de lo contrario, dibujar el círculo del borde
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creando una nueva ruta para dibujar el círculo
    ctx.moveTo(prevMouseX, prevMouseY); // moviendo el triangulo al puntero del mouse
    ctx.lineTo(e.offsetX, e.offsetY); // creando la primera línea de acuerdo con el puntero del mouse
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creando la linea inferior del triangulo
    ctx.closePath(); // camino de cierre de un triángulo para que la tercera línea se dibuje automáticamente
    fillColor.checked ? ctx.fill() : ctx.stroke(); // si el color de relleno está marcado, rellena el triángulo; de lo contrario, dibuja el borde
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // pasando la posición actual de mouseX como valor prevMouseX
    prevMouseY = e.offsetY; // pasando la posición actual del mouseY como valor prevMouseY
    ctx.beginPath();// creando una nueva ruta para dibujar
    ctx.lineWidth = brushWidth;// pasando brushSize como ancho de línea
    ctx.strokeStyle = selectedColor; // pasando el color seleccionado como estilo de trazo
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
   // copiando datos del lienzo y pasándolos como valor de instantánea... esto evita arrastrar la imagen
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // si isDrawing es falso retorna desde aquí
    ctx.putImageData(snapshot, 0, 0); // agregando datos de lienzo copiados a este lienzo

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // si la herramienta seleccionada es un borrador, establezca strokeStyle en blanco
         // para pintar el color blanco en el contenido del lienzo existente; de lo contrario, establezca el color del trazo en el color seleccionado
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creando una línea de acuerdo con el puntero del mouse
        ctx.stroke(); // dibujar/rellenar línea con color
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // agregar evento de clic a todas las opciones de herramientas
        // eliminando la clase activa de la opción anterior y agregando la opción actual en la que se hizo clic
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);// pasando el valor del control deslizante como brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // agregar evento de clic a todos los botones de color
        // eliminando la clase seleccionada de la opción anterior y agregando la opción actual en la que se hizo clic
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // pasar el color de fondo btn seleccionado como valor de color seleccionado
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // pasar el valor del color elegido desde el selector de color al último fondo btn de color
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpiar todo el lienzo
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // crear elemento <a> para descargar la imagen
    link.download = `${Date.now()}.jpg`; // pasando la fecha actual como valor de descarga del enlace
    link.href = canvas.toDataURL(); // pasando canvasData como valor del enlace href
    link.click();// haciendo clic en el enlace para descargar la imagen
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);