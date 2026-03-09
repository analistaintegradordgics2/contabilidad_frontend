
# Medios distritales

- Modulo creado para el cliente Nelly vega donde se ejectua medios distritales, que es un reporte parecido a exogena que se expide para la ciudad de bogota.

- cada tabla de articulo se deja en un componente 

- se hace validaciones de la siguiente manera para guardar parametrizacion:

    1. Concepto pago debe ser obligatorio si el articulo seleccionado es el 2, para los demas puede ir en null, se selecciona la cuenta, la naturaleza y existe un check que se marca si es devolucion la cuenta. (en el procedimiento si la cuenta en el parametro esta marcado como devolucion, la cuenta mayor_id debe restarse). 

    2. si se esta editando los parametros antes de pasar a otra tab, valida que se haya guardado.
    3. para generar la informacion de un articulo primero debe resolver las inconsistencias encontradas.
    4. se pueden descargar excel y archivo plano de la consulta. 
## ENDPOINT

#### Get Get_parametros

```http
  GET contabilidad/medios_distritales/get_parametros_medios'
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `ARRAY` | trae los parametros guardados por el usuario |

#### POST guardar_parametros

```http
  POST contabilidad/medios_distritales/guardar_parametros
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`      | `array` | si el id es null crea el parametro, si existe el id en la bd lo edita y si no va el id en la lista lo elimina  |

#### POST get_articulos

```http
  POST contabilidad/medios_distritales/get_articulos
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`      | `array` | en este endpoint se hace la consulta al procedimiento almacenado get_medios_distritales y cuando trae la informacion, se formatea las direcciones de notificacion y del articulo 12 las direcciones de los inmuebles en arriendo  |


#### POST guardar_parametros

```http
  POST contabilidad/medios_distritales/guardar_parametros
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`      | `array` | cuando se envia la data primero consulta todos los parametros guardados anteriormente y borra los que no vienen en la nueva data. si el id del nuevo parametro existe lo edita, y si es null crea uno nuevo.  |

#### POST searchInconsistencias

```http
  POST contabilidad/medios_distritales/searchInconsistencias
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `data`    | `array`  | se realiza el proceso como se hace en la exogena de validar nits, direcciones, ciudad, y adicional se agrega que valide los puntos espacios y guiones en los telefonos  |




#### Procedimiento almacenado

```SQL
    get_medios_distritales
```
la funcion recibe dos parametros, el año de consulta y el articulo a generar. se crea una tabla con toda los campos que se requiren en todos los articulos, la tabla principal es cont_mov y se busca los mayor_id que tiene cada articulo parametrizado. al final en el where se hace una condicion para que cuando sea el articulo 12 busque solo los inmuebles de bogota y con el concepto de canon de arrendamiento. 

## Authors

- [@Lfernando]

