$(document).on("ready", function(){
	sessionStorage.setItem("palabra",0);
	sessionStorage.setItem("contador",0);
	generaLetras();
	CargaPreguntas()
});

var respuesta = "";
var longitud = 0;

function CargaPreguntas(){
	//Recupero una pregunta aleatoria de la BD 
		var palabra = "";
			window.respuesta = "veracruz"; // unescape(valor.respuesta);
	  		window.longitud = respuesta.length;
	  		//Genero los espacios en blanco de acuerdo al número de letras de la respuesta
			for(i=0; i<longitud; i++){
				palabra += "<span><input type='text' name='l"+i+"' id='l"+i+"'></span>" 
			}
			$("#Palabra").append(palabra);


		// $.getJSON('php/servicioPreguntas.php', function(data) {
		 	
		// var palabra = "";

		//   	$.each(data.temario, function(indice, valor) {
		//   		window.respuesta = unescape(valor.respuesta);
		//   		window.longitud = respuesta.length;
		//   		//Genero los espacios en blanco de acuerdo al número de letras de la respuesta
		// 		for(i=0; i<longitud; i++){
		// 			palabra += "<span><input type='text' name='l"+i+"' id='l"+i+"'></span>" 
		// 		}
		//   		$("#Palabra").append(palabra);
		// 		$("#Pregunta").append(valor.pregunta);
		//   	});
		// });
}

var abecedario = new Array();
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


function ValidaLetra(li){
	//Recupero el valor de la letra que escribió el jugador
	var letraIngresada = String(li);
	//Cambio el estilo para que aparezca la letra presionada
	$("#"+letraIngresada).addClass("Usado");
	//Obtengo la posicion de letra elegida en la palabra a adivinar
	var arrayRespuesta = window.respuesta.split("");
	var posiciones = new Array();
	var j = 0;
	for(i=0; i<window.longitud; i++){
		if(arrayRespuesta[i] == letraIngresada){
			posiciones[j] = i;
			j++;
		}
	}
	resp = posiciones == "" ? -1 : posiciones;

	//Si la letra existe dentro de la palabra
	if(resp != -1){
		pos = resp.length;
		for(i=0;i<pos;i++){
			//Contador que se va incrementando conforme haya letras que existan en la palabra
			var contPalabra = parseInt(sessionStorage.getItem("palabra")) + 1;
			sessionStorage.setItem("palabra",contPalabra);
			$("#l"+resp[i]).val(letraIngresada);

			ValidaGanado();
		}
		
	}
	//Si la letra NO existe dentro de la palabra
	else{
		//Contador para sumar los intentos e ir pintando cada parte del monito ahorcado
		var contador = parseInt(sessionStorage.getItem("contador")) + 1;
		sessionStorage.setItem("contador",contador);

		//Envío a todos los jugadores la letra que ingresaron
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