<?php
include '../config.php';
include '../data/dbconnect.php'; 


function obtenerCuentasAdministradas($idUsuario){
    
    $sql = "PA_SEL_OBTENER_CUENTAS_ADMINISTRADAS " . $idUsuario;
    $ejecutar = sqlsrv_query(CONNECTION, $sql);
    $arr_cuentas =array();

    while($row = sqlsrv_fetch_object($ejecutar)) { 
        $arr_cuentas[] = array(
            'id' => $row->ID,
            'estado'    => $row->ESTADO,
            'correo'    => $row->CORREO,
            'nombre'    => $row->NOMBRE,
            'apellido'  => $row->APELLIDO,
            'area'      => $row->AREA,
            'telefono'  => $row->TELEFONO,
            'cantidad_eq' => $row->CANTIDAD_EQ
        );        
    }

    return $arr_cuentas;
}

function obtenerCuentaUsuario($idUsuario){
    $sql = "PA_SEL_OBTENER_USUARIO " . $idUsuario;
    $ejecutar = sqlsrv_query(CONNECTION, $sql);
    $arr_cuenta =array();

    while($row = sqlsrv_fetch_object($ejecutar)) { 
        $arr_cuenta[] = array(
            'nombre'    => $row->NOMBRE,
            'apellido'  => $row->APELLIDO,
            'correo'    => $row->CORREO,
            'area'      => $row->AREA,
            'telefono'  => $row->TELEFONO,
            'fecha_nac' => $row->FECHA_NACIMIENTO->format('Y-m-d')
        );        
    }

    return $arr_cuenta;
}

function actualizarCuentaUsuario($id,$nombre,$apellido,$area,$telefono){     
    try{
        $sql = "PA_UPD_ACTUALIZAR_CUENTA_USUARIO ?,?,?,?,?,?";
         
        $params = array(    
                    $id,  
                    $nombre,
                    $apellido,
                    $area,
                    "2020-23-11 00:00:00.000",
                    $telefono
                );

        $stmt = sqlsrv_query( CONNECTION, $sql, $params);
        if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
        }

    }catch(Exception $e){
        var_dump($e->getMessage());
    }        
}

function obtenerEquiposContratoUsuario($cliente, $idUsuario){
    
    $sql = "PA_SEL_OBTENER_EQUIPOS_CONTRATO_USUARIO ?,?";
    $params = array(    
        $cliente,  
        $idUsuario,
    );
    $ejecutar = sqlsrv_query(CONNECTION, $sql, $params);
    $arr_cuentas =array();

    while($row = sqlsrv_fetch_object($ejecutar)) { 
        $arr_cuentas[] = array(
            'activa' => $row->ACTIVA,
            'serie'    => $row->Serie,
            'contrato'    => $row->Contrato,
            'direccion'    => $row->Direccion,
            'ciudad'  => $row->Ciudad,
            'comuna'      => $row->Comuna,
            'ubicacion'  => $row->Ubicacion             						
        );        
    }

    return $arr_cuentas;
}

function obtenerEmpresaUsuario($idUsuario){
    $sql = "PA_SEL_OBTENER_EMPRESA_USUARIO " . $idUsuario;
    $ejecutar = sqlsrv_query(CONNECTION, $sql);
    $arr_empresa =array();

    while($row = sqlsrv_fetch_object($ejecutar)) { 
        $arr_empresa[] = array(
            'codigo_empresa'    => $row->CODIGO_EMPRESA,
            'nombre_empresa'    => $row->NOMBRE_EMPRESA
        );        
    }

    return $arr_empresa;
}

function registrarComentario($optTipoComentario,$idUsuario,$txtCodEmpresa,$txtComentario,$errorBD){

    try{
        $sql = "PA_INS_REGISTRAR_COMENTARIO ?,?,?,?"; 

        $params = array(    
                    $optTipoComentario,  
                    $idUsuario,
                    $txtCodEmpresa,
                    $txtComentario
                );

        $stmt = sqlsrv_query( CONNECTION, $sql, $params);
        if( $stmt === false ) {
            //ERROR DE CONEXION SRV DB
            die( print_r( sqlsrv_errors(), true));
        }

        //Validar error de BD LOGICA TRY CATCH TRANSANTION
        $errorBD=validarErrorBD($stmt);  

    }catch(Exception $e){
        var_dump($e->getMessage());
    } 

}


function obtenerEmpresa($idUsuario,$rutClienteSesion){

    $sql = "PA_SEL_OBTENER_EMPRESAS_USUARIO_POR_RUT " . $idUsuario . ",'" . $rutClienteSesion . "'";
    $ejecutar = sqlsrv_query(CONNECTION, $sql);
    $arr = array();

    while($row = sqlsrv_fetch_object($ejecutar)) { 
        $arr[] = array(
            'codEmpresa'  => $row->CODIGO_EMPRESA,
            'nomEmpresa'  => $row->NOMBRE_EMPRESA          
        );        
    }

    return $arr;
}

?>