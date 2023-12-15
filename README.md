[![codecov](https://codecov.io/gh/ulisesantana/PruebaTecnica/graph/badge.svg?token=C5KVkQmyAF)](https://codecov.io/gh/ulisesantana/PruebaTecnica)

# Prueba Tecnica Holafly

1. [📄 Instrucciones](#-instrucciones)
   1. [Notas](#notas)
1. [📄 Enunciado de la prueba](#-enunciado-de-la-prueba)
   1. [/hfswapi/getPeople/:id](#hfswapigetpeopleid)
   1. [/hfswapi/getPlanet/:id](#hfswapigetplanetid)
   1. [/hfswapi/getWeightOnPlanetRandom](#hfswapigetweightonplanetrandom)
   1. [/hfswapi/getLogs](#hfswapigetlogs)
1. [📝 Notas para quien revise](#-notas-para-quien-revise)
   1. [✨ Funcionalidades extra](#-funcionalidades-extra)
   1. [✅ Test automatizados](#-test-automatizados)
   1. [👷‍♂️ Github Actions](#-github-actions)
   1. [📦 Instalaciones extra](#-instalaciones-extra)

## 📄 Instrucciones

_Todas las instrucciones parten de la premisa de que el aspirante tiene una versión de node.js instalada en su sistema._

- Clonar este repositorio y realizar sobre el clon todos los cambios pedidos en el enunciado.
- Instalar las librerias externas mediante `npm install` y ejecutar el servidor mediante `npm run dev`
- Realizar los commits respetando la siguiente estructura: 
    - `Acción (contexto): mensaje`, siendo: 
        - Accion: `feat` para nuevas funcionalidades, `fix` para la corrección de errores, `refactor` para las tareas de refactorización de código o `chore` para cambios no relacionados con el código.
        - Contexto: una cadena descriptiva sobre la tarea que se está realiazndo
        - mensaje: un mensaje conciso sobre el cambio a realizar
    - Ejemplo: `feat (getPeople): Creada funcion de consulta a la BD` 
- Una vez se considere que la prueba está concluida, notificarnos la dirección del repositorio clonado para proceder a su revisión

### Notas
- Se recomienda realizar commits frecuentes para llevar una traza adecuada del trabajo realizado.
- No existe un máximo de tiempo para realizar la prueba.
- No existe limitación alguna a la hora de consultar cualquier fuente de documentación.
- La ayuda por parte de terceros queda prohibida. Esto incluye la peticion de ayuda en foros o chats especializados.
- El código ya posee las librerias externas necesarias para realizar todas las funciones requeridas. No obstante, si se desea utilizar alguna libreria externa adicional, esta debe poderse instalar a través de `npm` y su inclusión deberá estar justificada en un comentario en el fichero `README.md`.


## 📄 Enunciado de la Prueba
El presente código despliega un servidor node.js/express sobre el que se busca implementar los siguientes endpoints:


#### /hfswapi/getPeople/:id

> Dado el ID válido de un personaje de la franquicia Star Wars, consultar en la Base de datos (BD) facilitada y retornar un objeto con los siguientes datos: 
> - name: Nombre completo del personaje correspondiente al ID dado. 
> - mass: Masa del personaje correspondiente al ID dado.
> - height: Altura del personaje correspondiente al ID dado.
> - homeworldName: nombre del planeta natal del personaje correspondiente al ID dado.
> - homeworldId: Identificador del planeta natal del personaje correspondiente al ID dado.
>
> En caso de que dichos datos no se encuentren disponibles en la BD, se habrá de consultar en la SWAPI (https://swapi.dev/) sobre el endpoint adecuado


#### /hfswapi/getPlanet/:id

> Dado el ID válido de un planeta de la franquicia Star Wars, consultar en la Base de datos (BD) facilitada y retornar un objeto con los siguientes datos:
> - name: Nombre del planeta correspondiente al ID dado
> - gravity: factor de la gravedad del planeta correspondiente al ID dado en comparación con la considerada standard
>
> En caso de que dichos datos no se encuentren disponibles en la BD, se habrá de consultar en la SWAPI (https://swapi.dev/) sobre el endpoint adecuado


#### /hfswapi/getWeightOnPlanetRandom

> Tomados al azar dos identificadores cualesquiera, uno para personajes y otro para planetas, obtener de la Base de Datos (BD) el peso del personaje correspondiente a uno de los identificadores en el planeta correspondiente al otro identificador, considerando la siguiente relacion: 
> 
> $Peso_{Personaje} = Gravedad_{Planeta} · Masa_{Personaje}$
> 
> En caso de que los datos requeridos no se encuentren disponibles en la BD, se habrá de consultar en la SWAPI (https://swapi.dev/) sobre el endpoint adecuado.
>
> > _Funcionalidad extra:_ 
> > _Se debe detectar si se está tratando de calcular el peso de un personaje en su planeta natal y arrojar un error._

#### /hfswapi/getLogs

> Se deben retornar todas las llamadas realizadas a los endpoints anteriores, de las que se habrán almacenado previamente en la Base de Datos (BD) los siguientes datos: 
> - action: Endpoint al que se accede
> - header: Headers de la llamada almacenados como una cadena de texto plana
> - ip: Dirección IP desde donde se realiza la llamada


Adicionalmente a estos endpoints, se requiere ampliar el paquete `People` con las clases y funciones que sean necesarias para cubrir el caso de que el formato del objeto retornado por la SWAPI sea en idioma Wookiee.

## 📝 Notas para quien revise
### ✨ Funcionalidades extra
#### 1. Paginación de `/hfswapi/getLogs`
A registro por llamada a la API hará que la tabla crezca rápidamente. He añadido paginación al endpoint devolviendo los logs más recientes primero para evitar enviar la tabla entera con cada petición. Soy consciente de que esto es un *breaking change* de cara a que alguien o algo usara ese endpoint anteriormente.

#### 2. Wookiee format para `/hfswapi/getPlanet/:id`
Una vez añadida la funcionalidad de *Wookiee format* para **People**, hacerla para **Planet** era bastante fácil y tenía sentido hacerlo para que los endpoints fueran más coherentes.

#### 3. Añadir elemento a la base de datos después del fallback para `/hfswapi/getPeople/:id` y `/hfswapi/getPlanet/:id`
En caso de que el recurso no esté en base de datos lo pide a **SWAPI** y antes de devolverlo lo guarda en base de datos para tenerlo de cara a la próxima llamada. De esta manera vamos nutriendo nuestra base de datos reduciendo con el tiempo la dependencia a **SWAPI**. Además, acelera el tiempo de respuesta.

### ✅ Test automatizados
#### Unitarios
He añadido varias suites de test para comprobar que el proyecto cumple con los requisitos solicitados. Puedes ejecutar los test y ver el informe de cobertura de test con `npm test`.

#### End to End
He añadido un pequeño script que arranca el servidor y hace llamadas HTTP para comprobar que las diferentes capas de código se integran correctamente. La idea de este test es tener un pequeño arnés de seguridad que se pueda ejecutar rápidamente en local para estar seguros de que todo funciona como debería. Para ejecutarlos ejecuta `npm run test:e2e`. Si todo ha salido correctamente deberías ver esto:
```shell
✅ /hfswapi/getPeople/:id from database
✅ /hfswapi/getPeople/:id from SWAPI
✅ /hfswapi/getPlanet/:id from database
✅ /hfswapi/getPlanet/:id from SWAPI
✅ /hfswapi/getLogs
```

### 👷‍♂️ Github Actions
He añadido un workflow de Github Actions para ejecutar los test cada vez que se añade algo a la rama `main`. Ejecuta sólo los test unitarios ya que los test e2e necesitan acceder a SWAPI por HTTP. Además, recolecta la cobertura de los test para subirlos a [codecov.io](https://app.codecov.io/gh/ulisesantana/PruebaTecnica) y poder analizarlo posteriormente.

### 📦 Instalaciones extra
#### Dependencias de desarrollo
- **eslint**: He decidido instalar eslint con la configuración de [standardJS](https://standardjs.com) para que el código sea homogéneo.
- **nyc**: Aunque el test runner de Node.js es estable, su informe de cobertura de test es todavía experimental.
- **nock**: Aunque podría hacer los test tirando directamente contra SWAPI, prefiero mockear esas llamadas HTTP en los test automatizados. Además, me permite mockear casos como llamadas con un id aleatorio.
- **supertest**: Para poder automatizar los test de la API necesito esta librería.
