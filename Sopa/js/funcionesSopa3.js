var sopa = [];
var respuestas = new Array ();
var revisarRes = new Array ();
var preguntas = new Array();
var resultados = new Array();
var seleccionados = ["--->"];
var numPalabras=0;
var aciertos=0;


/*VARIABLES GAPI.HANGOUT.DATA*/
var kSELECCIONADO = 'selected';
var kCONTADOR_PALABRA = 'contador_palabra';
var kPALABRA_ENCONTRADA = 'palabra_encontrada';
var kACIERTOS = 'aciertos';
var kSELECCIONADOS = 'seleccionados';
var kSOPA = 'sopa';
var kFILA = 'fila';
var kRESPUESTA_FILA = 'respuesta_fila';
var kRESULTADOS = 'resultados';
var kPREGUNTAS = 'preguntas';

//***********************************+//
//Esta variable es un arreglo con número de la preguntas/palabras que ya se encontraron en la sopa de letras
//Utilizala para saber que botón desactivas o le cambias el estilo para indicar que esa pregunta ya esta conectada
var preguntasContestadas = new Array();
//*****************************************************+//

//$(document).on('ready', function(){
function startApp(){	
	
	
	CargaPreguntas();

	palabra = "EjemplomasT";
	creaSopa(sopa);

	for(i = 0; i < 10; i++) {
		respuestas[i] = "*";
	};	

	//*****************************************************+//
	//AQUI METER LAS 10 PALABRAS EXTRAIDAS DE LA BD
	//Es muy importante validar que las palabras no contengan mas de 13 letras , ya que no cabrian verticalmente y cuasaría errores
	//Mete las palabras en MAYUSCULAS, ya que así se generan las letras aleatorias de relleno y además se ve mejor.
	setTimeout(function() {
		/*for(i=0;i<10;i++){
			console.log("tamaño: " + resultados.length);
			console.log("inicia ciclo");
			console.log("numero de palabra: "+ i+" ....");
			if (resultados[i]=="LAN") {
				
				console.log("-"+resultados[i]+"-");
				//acomodaPalabras(sopa, respuestas, "LANA");
			}else{
				console.log("*"+resultados[i]+"*");
				//acomodaPalabras(sopa, respuestas, resultados[i]);
			}
			
		}
		*/
		//Prueba con palabras fijas

		w1=resultados[0];
		w2=resultados[1];
		w3=resultados[2];
		w4=resultados[3];
		w5=resultados[4];
		w6=resultados[5];
		w7=resultados[6];
		w8=resultados[7];
		w9=resultados[8];
		w10=resultados[9];
		
		acomodaPalabras(sopa, respuestas, w1);
		acomodaPalabras(sopa, respuestas, w2);
		acomodaPalabras(sopa, respuestas, w3);
		acomodaPalabras(sopa, respuestas, w4);
		acomodaPalabras(sopa, respuestas, w5);
		acomodaPalabras(sopa, respuestas, w6);
		acomodaPalabras(sopa, respuestas, w7);
		acomodaPalabras(sopa, respuestas, w8);
		acomodaPalabras(sopa, respuestas, w9);
		acomodaPalabras(sopa, respuestas, w10);
		
		//recupera resultados[] para guardarlo en los shared states
		var result = "";
		for(var i=0; i < resultados.length; i++){
			result += resultados[i] + ",";
			gapi.hangout.data.setValue(kRESULTADOS, result);
		}


		//recupera respuestas[] para guardarlo en los shared states
		console.log(respuestas.length);
		for(var i=0; i < respuestas.length; i++){
			console.log(respuestas[i].length );
			var rfila = '';
			for(var j=0; j < respuestas[i][1].length; j++){
				//console.log(respuestas[i][1][j]);
				rfila += respuestas[i][1][j] + ",";
			}
			gapi.hangout.data.setValue(kRESPUESTA_FILA+i, rfila);
		}
		
		//*****************************************************+//

		//Comenta esta función si sólo quieres ver las 10 palabras que están dentro de la sopa de letras
		//rellena(sopa);
		dibujaSopa(sopa);
		
		
		/*rr="";
		var ar = new Array();
		for (i =0; i < 10; i++){
			//respuestas[i][j] = "*";
			rr += "pos pal " + i.toString()+ ": ";
			ar = respuestas[i][1];
			for(k=0; k < ar.length; k++){
				rr += ar[k] + " ";
			}
			rr += "---";
		}*/
	},2000);
	
}
//});

/*function mrespuestas(respuestas){
	for (i = 0; i < 10; i++) {
			respuestas[i] = "*";
	};	
}*/

//Función que genera letras aleatorias para rellenar la sopa de letras
function rellena(sopa){
	abc = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	for (i = 0; i < 13; i++) {
		for (j = 0; j <20; j++) {
			if (sopa[i][j] == "*") {
				ram = aleatorio (0,26);
				sopa[i][j] = abc.charAt(ram);
			}
			
		}
	}			
}



//Función que dibuja la sopa de letras completa en la página html
function dibujaSopa(sopa){
	console.log(sopa);
	laSopa = "";
	for (i = 0; i < 13; i++) {
		laFila = '';
		for (j = 0; j <20; j++) {
			//console.log(i + "," + j);
			laSopa += "<li><a id='"+(i.toString())+"_"+(j.toString())+"'>"+sopa[i][j]+"</a></li>";		
			laFila += sopa[i][j] + ',';		
		};
		gapi.hangout.data.setValue(kFILA+i,laFila);
	}		
	gapi.hangout.data.setValue(kSOPA,'true');
	$("#letras").append(laSopa);
	$("#letras li a").on("click", function(){			
		validaPalabra($(this));
	});
}

//Función que se manda a llamar cada que das clic a una letra.  Verifica que la letra pertenezca a una palabra
function validaPalabra(ob){
	ob.addClass("Usado");
	console.log("validaPalabra" + ob);
	$("#letras li a").each(function () {
		
		for (j = 0; j < 10; j ++) {
        	revisarRes[j] = respuestas[j][1];

        }
        tmp="";
        for (var i = 0; i < revisarRes.length; i++) {
        	for (var j = 0; j < revisarRes[i].length; j++) {
        		tmp += revisarRes[i][j] +" ";
        	};
        	tmp += "\n";
        };
        tmp +=	"";
        //console.log(tmp);
		if ($(this).hasClass('Usado')) {
			
			elid = $(this).attr("id");
            esta = true;
             	
         	//Verificar si ya estaba seleccionada
         	busca:
	 		for ( i = 0; i < seleccionados.length; i++) {
         		if ( seleccionados[i] == elid  ) {
         			
         			esta = true;
         			break busca;
         			
         		}
         		else{
         			//console.log("listo para meterlo");         			
         			esta = false ;
         			//Las pocisiones de las respuestas
         	
         		}	
         	}
         	
            if (!esta) {
    			
    			seleccionados.push(elid);

    			/*...inicia fragmento hangout ...*/
    			gapi.hangout.data.setValue(kSELECCIONADO,elid);
    			var s = "";
    			s = gapi.hangout.data.getValue(kSELECCIONADOS);
    			if(s){
    				s += elid + ",";    				
    			}
    			else{
    				for(int i=0; i < seleccionados.length; i++){
    					s += seleccionados[i] + ",";    				
    				}
    			}
    			gapi.hangout.data.setValue(kSELECCIONADOS,s);
    			/*...termina fragmento hangout ...*/


    			cc= new Array(10);
    			cc[0]=0;
    			cc[1]=0;
    			cc[2]=0;
    			cc[3]=0;
    			cc[4]=0;
    			cc[5]=0;
    			cc[6]=0;
    			cc[7]=0;
    			cc[8]=0;
    			cc[9]=0;
    			
    			
    			for (var i = 1; i < seleccionados.length; i++) {

    				for (var j = 0; j < revisarRes.length; j++) {
    					
    					for (var k = 0; k < revisarRes[j].length; k++) {
    						if (seleccionados[i] == revisarRes[j][k]){
    							cc[j] = cc[j] + 1;
    							console.log("Letra correcta");
    							console.log("contador palabra " +j+": "+cc[j]);
    							if (cc[j] == revisarRes[j].length) {
    								console.log("PALABRA ENCONTRADA");
    								aciertos ++;
    								

    								preguntasContestadas.push(respuestas[j][0]);

    								PreguntaContestada(j);

    								for (var i = 0; i < preguntasContestadas.length; i++) {
    									//alert ( preguntasContestadas[i]);
    								};
    								


    								for (var l = 0; l < revisarRes[j].length; l++) {
    									console.log("tamaño palabra "+ j+": "+revisarRes[j].length);
    									$('#' + revisarRes[j][l].toString()).removeClass();
             							$('#' + revisarRes[j][l].toString()).addClass("Bien");
             							posBorrar= seleccionados.indexOf(revisarRes[j][l].toString());
										seleccionados.splice(posBorrar, 1);

    								};
    								
    								for (var p = 1; p < seleccionados.length; p++) {
											//$('#' + seleccionados[i].toString()).removeClass(); 
										$('#' + seleccionados[p].toString()).removeClass();
             							
									};
									seleccionados.splice(1, seleccionados.length);
									console.log("aun quedan: "+seleccionados.length -1);
									cc[j]=0;

									selec="";
									for (var f=0 ; f < seleccionados.length;f++) {
										selec += seleccionados[i]+ " ";
									}
									console.log("CLICKEADOS: " + selec);

									if (aciertos==10) {
										alert("¡ Felicidades has encontrado todas las palabras !");
									};	
									
    							}
    						}
    						else{
    							//cc[j]=0;
    						}
    					};
    				};
    			};
    			
			}// IF - el id no estaba en los seleccionados						
             
        }// Tiene la clase Usado
    }); //Each
	selec="";
	for (i=0 ; i < seleccionados.length;i++) {
		selec += seleccionados[i]+ " ";
	}
	console.log("CLICKEADOS: " + selec);
}

function creaSopa(sopa){ 
	
	laSopa = "";
	for (i = 0; i < 13 ; i++) {
		sopa[i] = [20];
	}
	for (i = 0; i < 13; i++) {
		for ( j = 0; j < 20; j++) {
			sopa[i][j] = "*";
		};
	};	
}

function aleatorio(inferior,superior){ 
    numPosibilidades = superior - inferior; 
    aleat = Math.random() * numPosibilidades;
    aleat = Math.floor(aleat);
    return parseInt(inferior) + aleat;
} 




//Funcion que acomoda las palabras de 4 formas distintas aleatorias en un arreglo
function acomodaPalabras(sopa, respuestas, palabra){ 
	lon = palabra.length;
	cabe = false;
	acomodada = false ;
	
	
	do{
		tipo = aleatorio(1,5);
		if (lon>8) {
			tipo = aleatorio(1,3);	
		}
		else{
			tipo = aleatorio(1,5);
		}

		//tipo = 1;
		switch(tipo){
			
			//Tipo "1" es para palabras verticales de arriba hacia abajo
			case 1: 
			
				do{
					pos_v = aleatorio(0,(14 - lon));
					pos_h = aleatorio(0,20);
					numbn= false;
					if( (pos_v >= 0) && (pos_v <= 12) && (pos_h >=0)&& (pos_h <=19) ){
						numbn= true;	
					}
				}while(numbn != true);
				
				//console.log(" pos_v "+pos_v);	
				//console.log(" pos_h "+pos_h);	

				for (i = 0; i < lon; i++) {
					
					if (sopa[(pos_v )+ (i)][pos_h] != "*") {
						cabe = false;
						break;
					}
					else{
						cabe= true;
					}
				}

				if (cabe) {
					acomodada = true;
					numPalabras = numPalabras + 1;
					pos = new Array(lon);
					for (i=0; i < lon ; i++) { 
						sopa[(pos_v)+(i)][pos_h] = palabra.charAt(i);

						pos[i]=(pos_v+i).toString() +"_"+ pos_h.toString();

					}


					res:
						for (j = 0; j < 10; j++) {
							if (respuestas[j]=="*" ){
								//alert("res vacia");

								respuestas[j]= new Array(2);
								respuestas[j][0] = numPalabras ;
								respuestas[j][1] = pos ;
								
								break res;	
							}
							else{
								//alert("no esta vacia");
							}	
						}
				}		
				else{
					acomodada =false;
					
				}
			
			break;
			case 2: 
				//Tipo "2" es para palabras verticales de abajo hacia arriba
				do{
					pos_v = aleatorio(0,(14 - lon));
					pos_h = aleatorio(0,20);
					numbn= false;
					if( (pos_v >= 0) && (pos_v <= 12) && (pos_h >=0)&& (pos_h <=19) ){
						numbn= true;	
					}
				}while(numbn != true);
				
				for (i = 0; i < lon; i++) {
					
					if (sopa[(pos_v )+ (i)][pos_h] != "*") {
						cabe = false;
						break;
					}
					else{
						cabe= true;
					}
				}

				if (cabe) {
					acomodada = true;
					numPalabras = numPalabras + 1;
					pos = new Array(lon);
					for (i=0; i < lon ; i++) { 
						
						sopa[(pos_v)+(i)][pos_h] = palabra.charAt((lon-1)-i);

						pos[i]=(pos_v+i).toString() +"_"+ pos_h.toString();

					}


					res:
						for (j = 0; j < 10; j++) {
							if (respuestas[j]=="*" ){
								//alert("res vacia");

								respuestas[j]= new Array(2);
								respuestas[j][0] = numPalabras ;
								respuestas[j][1] = pos ;
								
								break res;	
							}
							else{
								//alert("no esta vacia");
							}	
						}
				}		
				else{
					acomodada =false;
					
				}
			break;
			
			case 3: 
				//Tipo "3" es para palabras horizontales de izq a derecha
				do{
					pos_v = aleatorio(0,14);
					pos_h = aleatorio(0,(20-lon));
					numbn= false;
					if( (pos_v >= 0) && (pos_v <= 12) && (pos_h >=0)&& (pos_h <=19) ){
						numbn= true;	
					}
				}while(numbn != true);


				verifica:
				for (i = 0; i < lon; i++) {
					veces= 0 ;	
					if (sopa[pos_v][(pos_h) + (i)] != "*") {
						cabe = false;
						break verifica;
					}
					cabe = true;
					
				}
				
				if (cabe) {
					acomodada = true;
					numPalabras = numPalabras + 1;
					pos = new Array(lon);
					for (i=0; i < lon ; i++) { 
						sopa[pos_v][(pos_h)+(i)] = palabra.charAt(i);
						pos[i]=pos_v.toString() +"_"+ (pos_h+i).toString();
						
					}
					
					res:
					for (j = 0; j < 10; j++) {
						if (respuestas[j]=="*" ){
								//alert("res vacia");
								respuestas[j]= new Array(2);
								respuestas[j][0] = numPalabras ;
								respuestas[j][1] = pos ;
								
								break res;	
							}
							else{
								//alert("no esta vacia");
							}	
						}
				}		
				else{
					acomodada =false;
					
				}

			
			break;
			case 4: 
				
				//Tipo "3" es para palabras horizontales de izq a derecha
				do{
					pos_v = aleatorio(0,14);
					pos_h = aleatorio(0,(20-lon));
					numbn= false;
					if( (pos_v >= 0) && (pos_v <= 12) && (pos_h >=0)&& (pos_h <=19) ){
						numbn= true;	
					}
				}while(numbn != true);


				verifica:
				for (i = 0; i < lon; i++) {
					veces= 0 ;	
					if (sopa[pos_v][(pos_h) + (i)] != "*") {
						cabe = false;
						break verifica;
					}
					cabe = true;
					
				}
				
				if (cabe) {
					acomodada = true;
					numPalabras = numPalabras + 1;
					pos = new Array(lon);
					for (i=0; i < lon ; i++) { 
						sopa[pos_v][(pos_h)+(i)] = palabra.charAt((lon-1)-i);
						pos[i]=pos_v.toString() +"_"+ (pos_h+i).toString();
						
					}
					
					res:
					for (j = 0; j < 10; j++) {
						if (respuestas[j]=="*" ){
								//alert("res vacia");
								respuestas[j]= new Array(2);
								respuestas[j][0] = numPalabras ;
								respuestas[j][1] = pos ;
								
								break res;	
							}
							else{
								//alert("no esta vacia");
							}	
						}
				}		
				else{
					acomodada =false;
					
				}

			
			break;



		default:
			alert ("fue default " + tipo);
			acomodada =false;
		
	}
		
	}while(acomodada != true);


	
	
}

//Funciones para mostrar los botones para las 10 preguntas
function CargaPreguntas(){
	//Recupero las preguntas aleatorias de la BD
	$.getJSON('http://metaversoeducativo.net/sisFH/msicu/php/servicioPreguntasSopa.php', function(data) {
	  	$.each(data.temario, function(indice, valor) {
	  		preguntas[indice] = valor.pregunta;
	  		//Genero los números del 1 al 10 que mostrarán cada pregunta
	  		var numeros = '<button type="button" id="'+indice+'"><b>'+(indice + 1)+'</b></button>';
		  	$("#botones").append(numeros);
		  	//var pre="b"+indice.toString();
		  	//alert(pre);
	  		$("#"+indice).on("click",function(){
	  			if ( ($("#"+indice).hasClass('Contestada')) ) {
	  				
	  				$("#preguntas").empty();
					$("#preguntas").append("Palabra encontrada: " + resultados[indice]);	
	  			}
	  			else{
	  				MuestraPregunta(this.id);	
	  			}
	  			
	  		});
	  		resultados[indice] = valor.respuesta.toUpperCase();
	  	});
	});
}

function MuestraPregunta(i){
	$("#preguntas").empty();
	$("#preguntas").append(preguntas[i]);
}

function PreguntaContestada(i){
	//$("#botones button b").empty();
	//$("#"+i).css("color","red");
	$('#' + i).removeClass();
    $('#' + i).addClass("Contestada");
	
	
}


/*-----SECCION PARA HANGOUT ------*/
function onStateChange() {
	var s = $("#" + gapi.hangout.data.getValue(kSELECCIONADO))
	if(s){
		console.log(s+" - onStateChange function");  
		validaPalabra(s);  
	}
};

 function stateToMatrix(kSTATE){
 	var ss = [];
	var n = 0;
	var f = "";
	var filas = gapi.hangout.data.getKeys();
	console.log("entro en SOPITA " + filas.length);	 

	if(kSTATE == kFILA){	
		for(var i=0; i < filas.length; i++){	      			      			
			if((filas[i].substring(0,4)) == kFILA){
				f = gapi.hangout.data.getValue(kSTATE+n);
				console.log("gapiFILA: "+ f);	      				
				ss[n] = f.split(",");
				console.log(ss[i]);
				n++;
			}
		}
		dibujaSopa(ss);
	}

	if(kSTATE == kRESPUESTA_FILA){
		
		for(var i=0; i < filas.length; i++){
			if((filas[i].substring(0,14)) == kRESPUESTA_FILA){
				f = gapi.hangout.data.getValue(kRESPUESTA_FILA+n);		
				console.log("gapiFILA: "+ f);
				ss[n]= new Array(2);	
				ss[n][0] = n+1;
				ss[n][1] = f.split(",");	
				ss[n][1].pop();
				n++;
			}
		}
		respuestas = ss;
	}

	if(kSTATE == kRESULTADOS){
		for(var i=0; i < resultados; i++){
			console.log(resultados[i]);
		}
	}

	if(kSTATE == kRESULTADOS){
		f = gapi.hangout.getValue(kPREGUNTAS);
		preguntas = f.split(",");
		preguntas.pop();

		for(var i; i < preguntas.length; i++){
	  		//Genero los números del 1 al 10 que mostrarán cada pregunta
	  		var numeros = '<button type="button" id="'+i+'"><b>'+(i + 1)+'</b></button>';
		  	$("#botones").append(numeros);

	  		$("#"+i).on("click",function(){
	  			if ( ($("#"+i).hasClass('Contestada')) ) {
	  				
	  				$("#preguntas").empty();
					$("#preguntas").append("Palabra encontrada: " + resultados[i]);	
	  			}
	  			else{
	  				MuestraPregunta(this.id);	
	  			}
	  			
	  		});
	  	}

	  	f = gapi.hangout.getValue(kRESULTADOS);
  		resultados = f.split(",");
  		resultados.pop();
	  		
	}

	if(kSTATE == kSELECCIONADOS){
		f = gapi.hangout.data.getValue(kSELECCIONADOS);
		ss = f.split();
		ss.pop();
		for(var i=1; i < ss.length; i++){
			validaPalabra(ss[i]);  
		}
	}
 }

gapi.hangout.onApiReady.add(function(eventObj) 
{ 
	var SOPITA = gapi.hangout.data.getValue(kSOPA);
	try { 
	    if (eventObj.isApiReady) { 
	      console.log("isApiReady"); 
	      if(SOPITA){	    
	      		
	      		stateToMatrix(kFILA);
	      		stateToMatrix(kRESPUESTA_FILA);
	      		stateToMatrix(kRESULTADOS);
	      		stateToMatrix(kSELECCIONADO)

	        }
	        else{

	        	startApp();
	        }
	    } 
	  }
	catch (e) { 
	    console.log(e.stack); 
	} 
}); 



gapi.hangout.data.onStateChanged.add(onStateChange);

/*----------------------------*/