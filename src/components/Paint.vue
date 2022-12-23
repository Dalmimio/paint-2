

<template>
    <div class="container">
    <section class="tools-board">
      <div class="row">
        <label class="title">Shapes</label>
        <div class="options">
          
            <label > <input type="radio" class="option tool" name="tipeForm"  id="rectangle" value="rectangle"> Rectangulo</label>              
         
            
            <label > <input type="radio" class="option tool" name="tipeForm" id="circle" value="circle"> Circle</label>  
         
          
            
            <label> <input type="radio" class="option tool" name="tipeForm" id="triangle" value="triangel"> Triangle</label>  
          
         
            <input type="checkbox" id="fill-color">
            <label for="fill-color">Fill color</label>
      
        </div>
      </div>
      <div class="row">
        <label class="title">Options</label>
        <div class="options">
           
            
            <label> <input type="radio" class="option active tool" id="brush" name="tipeBrush"  value="brush">Brush</label> 

            <label> <input type="radio" class="option tool" id="eraser" name="tipeBrush"  value="brush">Eraser</label>   

          <li class="option">
            <input type="range" id="size-slider" min="1" max="30" value="5">
          </li>
        </div>
      </div>
      <div class="row colors">
        <label class="title">Colors</label>
        <ul class="options">
          <li class="option"></li>
          <li class="option selected"></li>
          <li class="option"></li>
          <li class="option"></li>

          <li class="option">
            <input @change="colorPicker" type="color" id="color-picker" value="#4A98F7">
          </li>
        </ul>
      </div>
      <div class="row buttons">
        <button @click="clearCanvas" class="clear-canvas">Clear Canvas</button>
        <button @click="saveImg" class="save-img">Save As Image</button>
      </div>
    </section>

    <section class="drawing-board">
      <canvas 
        ref="myCanvas"
        id="myCanvas"
        @mousemove="drawing"
        @mousedown="startDraw"
        @mouseup="isDrawing = false">
        </canvas>
    </section>
  </div>
</template>

<script setup>
    import { onMounted } from 'vue';

    let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";
    
    let toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas")

    onMounted(() => {
        // establecer el ancho/alto del lienzo... offsetwidth/height devuelve el ancho/alto visible de un elemento
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        setCanvasBackground();

        let canvas = this.$refs['myCanvas']
        canvas = canvas.getContext('2d')
        console.log(canvas)
    })

methods: {
    const setCanvasBackground = () => {
        // configurando todo el fondo del lienzo en blanco, por lo que el fondo de la imagen descargada será blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = selectedColor; // establecer el estilo de relleno de nuevo en el color seleccionado, será el color del pincel
    }
    const drawRect = (e) => {
        // si el color de relleno no está marcado, dibuja un rectángulo con borde; de lo contrario, dibuja un rectángulo con fondo
        if (!fillColor.checked) {
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
    const saveImg = () => {
        const link = document.createElement("a"); // crear elemento <a> para descargar la imagen
        link.download = `${Date.now()}.jpg`; // pasando la fecha actual como valor de descarga del enlace
        link.href = canvas.toDataURL(); // pasando canvasData como valor del enlace href
        link.click();// haciendo clic en el enlace para descargar la imagen
    }
    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // limpiar todo el lienzo
        setCanvasBackground();
    }
    const colorPicker = () => {
        
        colorPicker = document.querySelector("#color-picker")
        // pasar el valor del color elegido desde el selector de color al último fondo btn de color
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
    }
    
    }


//     toolBtns.forEach(btn => {
//     btn.addEventListener("click", () => { // agregar evento de clic a todas las opciones de herramientas
//         // eliminando la clase activa de la opción anterior y agregando la opción actual en la que se hizo clic
//         document.querySelector(".options .active").classList.remove("active");
//         btn.classList.add("active");
//         selectedTool = btn.id;
//     });
// });

// sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);// pasando el valor del control deslizante como brushSize

// colorBtns.forEach(btn => {
//     btn.addEventListener("click", () => { // agregar evento de clic a todos los botones de color
//         // eliminando la clase seleccionada de la opción anterior y agregando la opción actual en la que se hizo clic
//         document.querySelector(".options .selected").classList.remove("selected");
//         btn.classList.add("selected");
//         // pasar el color de fondo btn seleccionado como valor de color seleccionado
//         selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
//     });

    // 
    //     canvas.width = window.innerWidth * 0.6
    //     canvas.height = window.innerHeight * 0.6
    //     this.canvas = canvas.getContext('2d')
    //     
</script>


<style scoped>
/* Import Google font - Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #6d4e86;
}
.container{
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 10px;
  max-width: 1050px;
}
section{
  background: rgba(255, 255, 255, 0.315);
  border-radius: 0px 50px;
}
.tools-board{
  width: 210px;
  padding: 15px 22px 0;
}
.tools-board .row{
  margin-bottom: 20px;
}
.row .options{
  list-style: none;
  margin: 10px 0 0 5px;
}
.row .options .option{
  display: flex;
  cursor: pointer;
  align-items: center;
  margin-bottom: 10px;
}
.option:is(:hover, .active) img{
  filter: invert(17%) sepia(90%) saturate(3000%) hue-rotate(900deg) brightness(100%) contrast(100%);
}
.option :where(span, label){
  color: #000d1a;
  cursor: pointer;
  padding-left: 10px;
}
.option:is(:hover, .active) :where(span, label){
  color: blue;
}
.option #fill-color{
  cursor: pointer;
  height: 14px;
  width: 14px;
}
#fill-color:checked ~ label{
  color: #4A98F7;
}
.option #size-slider{
  width: 100%;
  height: 5px;
  margin-top: 10px;
}
.colors .options{
  display: flex;
  justify-content: space-between;
}
.colors .option{
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-top: 3px;
  position: relative;
}
.colors .option:nth-child(1){
  background-color: #fff;
  border: 1px solid #bfbfbf;
}
.colors .option:nth-child(2){
  background-color: #000;
}
.colors .option:nth-child(3){
  background-color: #E02020;
}
.colors .option:nth-child(4){
  background-color: #6DD400;
}
.colors .option:nth-child(5){
  background-color: #4A98F7;
}
.colors .option.selected::before{
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  height: 12px;
  width: 12px;
  background: inherit;
  border-radius: inherit;
  border: 2px solid #fff;
  transform: translate(-50%, -50%);
}
.colors .option:first-child.selected::before{
  border-color: #ccc;
}
.option #color-picker{
  opacity: 0;
  cursor: pointer;
}
.buttons button{
  width: 100%;
  color: #fff;
  border: none;
  outline: none;
  padding: 11px 0;
  font-size: 0.9rem;
  margin-bottom: 13px;
  background: none;
  border-radius: 4px;
  cursor: pointer;
}
.buttons .clear-canvas{
  color: #0087fd;
  font-weight: bolder;
  border: 1px solid #0087fd;
  background-color: white;
  transition: all 0.3s ease;
}
.clear-canvas:hover{
  color: #fff;
  background: #6C757D;
}
.buttons .save-img{
  background: #4A98F7;
  border: 1px solid #4A98F7;
}
.drawing-board{
  flex: 1;
  overflow: hidden;
}
.drawing-board canvas{
  width: 100%;
  height: 100%;
}
</style>