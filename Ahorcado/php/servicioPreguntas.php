<?php
$method = $_SERVER['REQUEST_METHOD'];
$resource = $_SERVER['REQUEST_URI'];
switch ($method) {
    case 'GET':
        //Reemplazar los datos de acuerdo a la configuración del servidor de datos
        $conexion = mysql_connect("direccion_ip", "usuario", "contraseña") or die("Error de conexion");

        if (!mysql_select_db("FactoresHumanos",$conexion)) die(mysql_error());
        $pregunta = rand(1,8);
        $sql='SELECT * FROM preguntas WHERE idTema = 1 AND idPregunta = '.$pregunta; 
        $query = mysql_query($sql,$conexion);
        $resultado = ($query);
        $con = 0;
        while ($fila = mysql_fetch_array($resultado, MYSQL_NUM)) {
            $data[$con] = array('id' => $fila[0], 'tema' => $fila[1], 'pregunta' => htmlentities($fila[2]), 'respuesta' => rawurlencode($fila[3]));
            $con++;
        }
        $dato=json_encode($data);
        //header('Content-type: application/json');
        echo '{"temario":'.$dato.'}';

    break;
    case 'POST':
        // código para método POST
        break;
    case 'PUT':
        // código para método PUT
        break;
    case 'DELETE':
        // código para método DELETE
        break;
}
?>