//SOPA DE LETRAS
var sopa = new array(20);

$(document).on("ready", function(){

	sessionStorage.setItem("palabra",0);
	sessionStorage.setItem("contador",0);
	CreaSopa();
	CargaPreguntas();
	alert("Creando sopa");

});

var socket = io.connect('http://127.0.0.1:8080');
socket.on('letraJugador', function(data) {
	console.log(data.letra);
	//Marco la letra como seleccionada y la pinto en el espacio correspondiente
	$("#"+data.letra).addClass("Usado");
	$("#l"+data.posicion).val(data.letra);
	sessionStorage.setItem("palabra",data.contador);
	ValidaGanado();
});

socket.on('letraJugadorError', function(data) {
	console.log(data.letra);
	//Marco la letra como seleccionada y pinto el ahorcado
	$("#"+data.letra).addClass("Usado");
	sessionStorage.setItem("contador",data.contador);
	DibujaAhorcado(data.contador)
});

var respuesta = "";
var longitud = 0;

function CargaPreguntas(){
	//Recupero una pregunta aleatoria de la BD
	$.getJSON('php/servicioPreguntas.php', function(data) {
	 	var palabra = "";

	  	$.each(data.temario, function(indice, valor) {
	  		window.respuesta = unescape(valor.respuesta);
	  		window.longitud = respuesta.length;
	  		//Genero los espacios en blanco de acuerdo al número de letras de la respuesta
			for(i=0; i<longitud; i++){
				palabra += "<span><input type='text' name='l"+i+"' id='l"+i+"'></span>" 
			}
	  		$("#Palabra").append(palabra);
			$("#Pregunta").append(valor.pregunta);
	  	});
	});
}

var abecedario = new array();
function generaLetras(){
	abecedario = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	var letras = "";
	//Creo los botones para cada una de las letras del abecedario
	for(i=0; i<27; i++){
		letras += "<li><a id='"+abecedario[i]+"'>"+abecedario[i]+"</a></li>";
	}
	$("#letras").append(letras);
	$("#letras li a").on("click", function(){
		var seleccionada = $(this).text();
		ValidaLetra(seleccionada);
	});
}


//SOPA DE LETRAS



function creaSopa(sopa){ 
	alert("Creando sopa");
	laSopa = "";
	for (i = 0; i < 20 ; i++) {
		sopa[i] = new array(20);
	}

	for (i = 0; i sopa.length; i++) {

		for ( j = 0; i < sopa[i].length; i++) {
			sopa[i][j]= "*";
			laSopa += "<li><a id='"+i+"'>"+sopa[i][j]+"</a></li>";
		};
	};

	$("#letras").append(laSopa);
}

function metePalabras(sopa){ 
}

function aleatorio(inferior,superior){ 
    numPosibilidades = superior - inferior 
    aleat = Math.random() * numPosibilidades 
    aleat = Math.floor(aleat) 
    return parseInt(inferior) + aleat 
} 

var abc = new array();
function generaSopa(){


	abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	var letrasSopa = "";
	var ram;
	//Creo los botones para cada una de las letras del abecedario
	for(i=0; i<400; i++){
		ram = aleatorio(1,27);
		letrasSopa += "<li><a id='"+i+"'>"+abc[ram]+"</a></li>";
	}
	$("#letras").append(letrasSopa);
	$("#letras li a").on("click", function(){
		var seleccionada = $(this).text();
		ValidaLetra(seleccionada);
	});
}

function ValidaLetra(li){
	//Recupero el valor de la letra que escribió el jugador
	var letraIngresada = String(li);
	//Cambio el estilo para que aparezca la letra presionada
	$("#"+letraIngresada).addClass("Usado");
	//Obtengo la posicion de letra elegida en la palabra a adivinar
	var resp = window.respuesta.indexOf(letraIngresada);
	//Si la letra existe dentro de la palabra
	if(resp != -1){
		//Contador que se va incrementando conforme haya letras que existan en la palabra
		var contPalabra = parseInt(sessionStorage.getItem("palabra")) + 1;
		sessionStorage.setItem("palabra",contPalabra);
		$("#l"+resp).val(letraIngresada);

		//Envío a todos los jugadores la letra que ingresaron y la posición correspondiente dentro de la palabra
		socket.emit("recibeLetra",{letra: letraIngresada, posicion: resp, contador: contPalabra});
		ValidaGanado();
	}
	//Si la letra NO existe dentro de la palabra
	else{
		//Contador para sumar los intentos e ir pintando cada parte del monito ahorcado
		var contador = parseInt(sessionStorage.getItem("contador")) + 1;
		sessionStorage.setItem("contador",contador);

		//Envío a todos los jugadores la letra que ingresaron
		socket.emit("recibeLetraError",{letra: letraIngresada, contador: contador});
		DibujaAhorcado(contador);
	}
}

function ValidaGanado(){
	//Valida si el valor del contador es igual a la longitud de la palabra a adivinar para indicar que ya ganó y deneter el juego
	if(sessionStorage.getItem("palabra") == window.longitud){
		$("#ContenedorAbecedario").hide();
		$("#resultado").show();
		$("#resultado").html("Ganaste :)");
	}
}

function DibujaAhorcado(contador){
	switch(contador){
		case 1: 
			//dibuja la cabeza
			$("#cabeza").show();
		break;
		case 2: 
			//dibuja el tronco
			$("#tronco").show();
		break;
		case 3:
			//dibuja el brazo izquierdo
			$("#brazoizquierdo").show();
		break;
		case 4:
			//dibuja el brazo derecho
			$("#brazoderecho").show();
		break;
		case 5:
			//dibuja la pierna izquierda
			$("#pieizquierdo").show();
		break;
		case 6:
			//dibuja la pierna derecha y pierde
			$("#piederecho").show();
			$("#ContenedorAbecedario").hide();
			$("#resultado").show();
			$("#resultado").html("Perdiste :(");
			var str = window.respuesta.split("");
			for(i=0; i<window.longitud; i++){
				$("#l"+i).val(str[i]);
			}
		break;
		default: $("#monito").show();	
	}
}