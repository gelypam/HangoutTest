/**
 * Función de inicialización de la aplicación
 */
function bootstrap() {
 prepareViewDOM();

 if (gapi && gapi.hangout) {


  var initHangout = function(apiReadyEvent) {
    /**
     * Esta lista el API para ser utilizada? Es preciso preguntar esto, debido a que todos los 
     * participantes pueden estar listos en nuestra APP, pero el API no fue descargada para ser 
     * utilizada.
     */  
   if (apiReadyEvent.isApiReady) {

    /**
     * Toma por defecto el API KEY registrado en el Hangout
     * Utilizado para el manejo de la autenticación y autorización.
     */
    gapi.client.setApiKey(null);

    /**
     * Obteniendo los participantes del hangout
     */
    participants = gapi.hangout.getParticipants();
    for ( var index = 0; index < participants.length; index++) {
     console.log("participants + 1");
    }
                                //...
                                //...
    /**
     * Pidiendo autorización para distintos scoupes de OAuth
     * client_id es nulo porque toma por defecto el client id
     * asociado al proyecto de Hangout.
     */
    gapi.auth.authorize({
     client_id : null,
     scope : globalScopes,
     immediate : true
    }, function() {
     //...
    });

    /**
     * Handling global events
     * Un nuevo Participante se unió al Hangout?
     */
    gapi.hangout.onParticipantsAdded
      .add(function(participantsAddedEvent) {
       console.log("participantsAddedEvent");
      });

    /**
     * Obtenemos el nivel de Audio del participante  
     */
    gapi.hangout.av .getParticipantAudioLevel(gapi.hangout.getParticipantId());
                               
    /**
     * Cambió el nivel del volumen?
     */
    gapi.hangout.av.onVolumesChanged.add(function(volChangeEvent) {
      console.log("volume Changed");
     // TODO make something with information
     /**
      * volChangeEvent --> valumes : Object.<String, String> -
      * The volume level for each participant, keyed by
      * participant id. The volume is a number from 0 to 5,
      * inclusive.
      */
    });

    /**
     * Se activó el audio de alguno de los Speakers?
     */
    gapi.hangout.av.onHasSpeakers.add(function(hasSpeakersEvent) {
      console.log("has Speaker");
     // TODO make something with information
     /**
      * hasSpeakersEvent --> hasSpeakers : boolean - Indicates
      * whether the local participant's audio speakers are
      * activated.
      */
    });

    /**
     * Se realizó mute en la cámara?
     */
    gapi.hangout.av.onCameraMute
      .add(function(cameraMuteEvent) {
       $("#camera").attr('checked',
         !cameraMuteEvent.isCameraMute);
      });

    /**
     * Tenemos cámara?
     */
    gapi.hangout.av.onHasCamera.add(function(hasCamera) {
     console.log(hasCamera);
    });

    /**
     * Tenemos micrófono?
     */
    gapi.hangout.av.onHasMicrophone.add(function(hasMicrophone) {
     console.log(hasMicrophone);
    });
                 //...
   }
  };

    /**
     * Evento disparado cuando el API esta lista para ser utilizada!!!!
     * el callback a utilizar es la función definida en la variable inithangout
     */ 
  gapi.hangout.onApiReady.add(initHangout);


  var onStateChange = function(eventObj) {
    for (var i = 0; i < eventObj.addedKeys.length; ++i) {
      foo(eventObj.addedKeys[i].key,
          eventObj.addedKeys[i].value,
          eventObj.addedKeys[i].timestamp);
          console.log(eventObj.addedKeys[i].value);
    }
    for (var j = 0; j < eventObj.removedKeys.length; ++j) {
      bar(eventObj.removedKeys[j]);
    }
    state_ = eventObj.state;
    metadata_ = eventObj.metadata;
  };
  gapi.hangout.data.onStateChanged.add(onStateChange);

  var onParticipantsChange = function(eventObj) {
  participants_ = eventObj.participants;
  console.log(participants_);
  };

 }
};