
let matriz 

let ancho = 10

let s

let f

let filas = Math.floor(window.innerHeight/ancho)

let columnas = Math.floor(window.innerWidth/ancho)

let listaMovimientos = []

let cantidadFruta = 0

let frames = 20

let nombre


function setup() {

	vex.dialog.alert({ unsafeMessage: 
		`<h1>Como es tu nombre?</h1><br/>
		<input id="nombre" type="text"/>`,
		callback: function (data) {

			loop()

			nombre = document.getElementById("nombre").value

			console.log(nombre)
			
		}
	})

	noLoop()

	createCanvas(window.innerWidth, window.innerHeight)

	frameRate(frames)

	matriz = new Array(filas)

	for (let i = 0; i < matriz.length; i++) { 
		matriz[i] = new Array(columnas)
	} 
	

	let y = 0

	for (let i = 0; i < filas; i++) { 

		let x = 0

		for (let j = 0; j < columnas; j++) { 
			matriz[i][j] = new Casilla(x,y)
			x+=ancho
		} 

		y+=ancho
	} 


	s = new Serpiente(5,5)

	f = new Fruta(Math.floor(filas/2),Math.floor(columnas/2))

	
}



function cambiarDireccion(direccion){

	for (let i = 0; i < s.cola.length; i++) { 

		listaMovimientos.push([s.cola[i],direccion])

	} 

}

function keyPressed() {
	if (keyCode === UP_ARROW){

		cambiarDireccion([-1, 0])

	}else if (keyCode === DOWN_ARROW){

		cambiarDireccion([1, 0])

	}else if (keyCode === RIGHT_ARROW){

		cambiarDireccion([0, 1])

	}else if (keyCode === LEFT_ARROW){

		cambiarDireccion([0, -1])

	}
}

function draw(){

	frameRate(frames)


	if(listaMovimientos.length != 0){
		listaMovimientos[0][0].direccion = listaMovimientos[0][1]
		listaMovimientos.shift()
	}


	for (let i = 0; i < s.cola.length; i++){

		s.cola[i].mover()

	} 

	for (let i = 0; i < filas; i++) { 
		for (let j = 0; j < columnas; j++) { 

			matriz[i][j].serpiente=false
			matriz[i][j].fruta=false

		} 
	} 

	matriz[f.i][f.j].fruta=true

	for (let i = 0; i < s.cola.length; i++) { 

		let x = s.cola[i].x

		let y = s.cola[i].y

		if(x<0||y<0||x>=filas||y>=columnas){

			gameOver()

		}else{
			matriz[x][y].serpiente=true
		}

		

	} 


	for (let i = 0; i < filas; i++) { 
		for (let j = 0; j < columnas; j++) { 

			matriz[i][j].mostrar()

		} 
	} 


}

function empezar(){

	listaMovimientos = []

	cantidadFruta = 0

	frames = 20

	matriz = new Array(filas)

	for (let i = 0; i < matriz.length; i++) { 
		matriz[i] = new Array(columnas)
	} 
	

	let y = 0

	for (let i = 0; i < filas; i++) { 

		let x = 0

		for (let j = 0; j < columnas; j++) { 
			matriz[i][j] = new Casilla(x,y)
			x+=ancho
		} 

		y+=ancho
	} 


	s = new Serpiente(5,5)

	f = new Fruta(Math.floor(filas/2),Math.floor(columnas/2))

}

function gameOver(){

	noLoop()

	vex.dialog.alert({ unsafeMessage: 
		`<h1>Game over ` + nombre + `! Puntaje: ` + cantidadFruta + `</h1>`,
		callback: function (data) {

			fetch('https://serpiente-back.herokuapp.com/nuevoPuntaje/' + nombre + '/' + cantidadFruta)
				.then(response => response.json())
				.then(data => {

					console.log(data)

					tablaPuntajes = data

					tablaPuntajes.sort((a, b) => parseFloat(b.mejorPuntaje) - parseFloat(a.mejorPuntaje))

					let mensaje = `<h1>Tabla de Puntajes:</h1>
												</br>
												<table class="table table-striped table-dark">
												  <thead>
												    <tr>
												      <th scope="col">#</th>
												      <th scope="col">Nombre</th>
												      <th scope="col">Ultimo Puntaje</th>
												      <th scope="col">Mejor Puntaje</th>
												    </tr>
												  </thead>
												  <tbody>`;


					for (let i = 0; i < tablaPuntajes.length; i++) {

						mensaje = mensaje + `
												    <tr>
												      <th scope="row">` + (i + 1) + `</th>
												      <td>` + tablaPuntajes[i].nombre + `</td>
												      <td>` + tablaPuntajes[i].ultimoPuntaje + `</td>
												      <td>` + tablaPuntajes[i].mejorPuntaje + `</td>
												    </tr>`
					}

					mensaje = mensaje + `</tbody></table>`

					vex.dialog.alert({

						unsafeMessage: mensaje,

						callback: function(data) {

							empezar()

							loop()

						}
					})



				})
			
    	}
	})

}

function Fruta(i,j){

	this.i=i
	this.j=j

}

function Serpiente(i,j){

	this.cola = [new Cuello(i,j,[0,1])]

	this.crecer = function(){

		let direc = this.cola[0].direccion

		let x = this.cola[0].x + direc[0]

		let y = this.cola[0].y + direc[1]

		this.cola.unshift(new Cuello(x,y,direc))

		cantidadFruta++

		frames++

	}

}

function Cuello(x,y,direccion){

	this.x=x
	this.y=y
	this.direccion=direccion


	this.mover = function(){

		this.x += this.direccion[0]

		this.y += this.direccion[1]

	}


}

function Casilla(x,y){

	this.serpiente = false

	this.fruta = false

	this.x = x

	this.y = y


	this.mostrar = function(){

		noStroke()

		if(this.serpiente){

			fill(155, 186, 90)

		}else if(this.fruta){
			
			fill(162, 8, 209)


		}else{

			fill(45, 45, 45)

		}

		rect(this.x, this.y, ancho, ancho)

		if(this.serpiente && this.fruta){

			f = new Fruta(Math.floor(Math.random() * (filas-4)) + 1 ,Math.floor(Math.random() * (columnas-4)) + 1)

			s.crecer()

		}

	}


}