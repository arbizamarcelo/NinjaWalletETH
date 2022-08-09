# :ninja: Ninja Wallet 

Para el desarrollo de la aplicación se utilizaron las siguientes tecnologías:
**NodeJS**
**React Native**
**Expo**
**Redux**
**Ethers.js**
 
## Resumen
Se utiliza React Native ya que el cliente requiere que utilicemos React , mediante este podemos utilizar sus características nativas en el desarrollo mobile. Expo nos brinda la interfaz para poder visualizar el desarrollo de la aplicación además de contar con una gran variedad de herramientas que facilitan el desarrollo.
Redux además de ser requerido por el cliente nos brinda la posibilidad de centralizar determinadas variables, de modo que todas las partes de nuestra aplicación puedan acceder a las mismas sin necesidad de estar transfiriéndolas de unas a otras, creando un local storage.
Ethers.js es la librería que utilizamos como puente para interactuar con la EVM. Además de contar con otras funciones que nos facilitan la creación de la Wallet, tales como createRandom(), getHistory(address), getDefaultProvider(), etc.
El cliente también solicitó que se utilizara MongoDB. Este no fue utilizado para evitar la centralización de la aplicación.
Todo el funcionamiento se desarrolla en la misma aplicación, por lo que la seguridad de la Wallet dependerá exclusivamente del usuario y no de externos. Dentro de la aplicación, los datos se guardan de manera encriptada y solo se podrá acceder a ellos si el usuario se encuentra logueado. Para el caso de solicitar ver la clave privada o la frase semilla, se vuelve a pedir al usuario que ingrese la contraseña como una doble medida de seguridad.
 
## Arquitectura
### HomePage
En esta página se presentarán dos opciones:
>> Create Wallet
>> Import Wallet 

### Create Wallet -> LoginScreen 

Se generará una nueva wallet con su clave privada, clave pública y frase mnemónica.
Se le solicitará al usuario que ingrese una contraseña. Esta contraseña será hasheada y con la misma se encriptará la wallet y se guardará en el archivo wallet.json. Esta contraseña se guardará en el store de Redux.
Para hashear la contraseña se utiliza la función ethers.utils.hashMessage(string).
Esta función criptográfica recibe como parámetro un string y devuelve un string hexadecimal de 32 bytes.
Para crear la wallet se utiliza la función ethers.Wallet.createRandom().
Esta función retorna una wallet con una clave privada random. Una wallet creada mediante esta función tendrá una frase mnemónica.
Para la encriptación de la wallet se utiliza la función wallet.encrypt(password).
Esta función encripta la wallet utilizando la contraseña y retorna un JSON de esa wallet encriptado. Esta función utiliza el algoritmo simétrico cipher cuyo valor es aes-128-ctr para encriptar la contraseña creando una key que luego hasheará junto con la wallet con el algoritmo de encriptación SHA256.
 
Luego de esto, pasa a la página SecretKeysScreen.
 
### SecretKeysScreen 

En esta página se traerá del archivo wallet.json la wallet creada, se desencriptará y se tomará su frase mnemónica que será mostrada en pantalla para que el usuario pueda copiarla y guardarla en algún lugar seguro.
Para la desencriptación se utilizó la función ethers.Wallet.fromEncryptedJson(json, password).
Esta función toma la wallet encriptada en formato json y utiliza la contraseña para desencriptarla. Esta contraseña es la misma que se utilizó cuando se encriptó la wallet.
Luego se pasará a la página ImportScreen.
 
### ImportScreen 

Aquí se solicitará al usuario que ingrese la frase mnemónica que se le mostró en la página anterior. Esto se hace para dar seguridad al usuario ya que, si este no guardó correctamente dicha frase, no podrá acceder posteriormente a su wallet.
El string ingresado por el usuario se compa con la frase mnemónica obtenida de la misma forma que en la página anterior. En el caso de coincidir se pasará a la WalletScreen.
 
 
### WalletScreen 

Una vez en esta página, podremos acceder a todas las funcionalidades de la wallet. Las mismas serán detalladas aquí.
Como primer paso deberemos escoger un proveedor y la clave publica de la wallet que vamos a utilizar. En un principio la única clave pública que aparecerá disponible será la de la wallet que se creó.
Como primera opción tendremos 

#### :pushpin: TRANSFER: 

Este método desencripta la wallet que coincida con la clave pública seleccionada, de esta forma podremos acceder a la clave privada, necesaria para poder realizar la transacción. Deberemos tener seleccionado el proveedor por el cual se conectará la wallet para realizar la transferencia. También definiremos el monto (en ETH) y la clave publica a la cual transferir.
Para realizar la transacción se utiliza la función ethers.wallet.sendTransaction(transaction).
Como se comentó anteriormente ethers.js es un puente para poder interactuar con la EVM.
Por lo que a través de esta se accederá a la función transfer del contrato para poder realizar la
transferencia.
La firma de la transacción la realiza la misma función de manera interna.
Anteriormente se utilizaba la función signTransaction(transaction) para firmarla antes de
poder transferir.
 
#### :pushpin: GET BALANCE: 

Toma la clave pública seleccionada y el proveedor, y a través de la función
provider.getBalance(address), se conectará con el contrato accediendo a la función balanceOf para obtener el balance de dicha clave publica para ese contrato.
 
#### :pushpin: ADD WALLET: 

Esta opción nos permite crear una nueva wallet como lo hicimos al principio.
 
#### :pushpin: IMPORT WALLET: 

Esta opción utiliza la función ethers.Wallet.(privateKey), para traer una wallet a partir de una
clave privada que le pasemos. Esta se encriptará y guardará en el archivo wallet.json.
PRIVATE KEY y MNEMONIC:
Estas opciones solicitarán que se ingrese nuevamente la contraseña como método de
seguridad y esta se hasheará y compará con la key guardada. En el caso de ser coincidir se
desencriptará con la misma la wallet y se mostrará la clave privada o frase mnemónica (frase
semilla) según la opción.
 
Aquellas wallets que se importen no tendrán frase semilla.

#### :pushpin: HISTORY: 

Por medio de la función etherscanProvider.getHistory(address) que se conecta con la API de Etherscan para dicho proveedor, podremos obtener el historial de transacciones de la clave publica seleccionada.
 
## Import Wallet -> LoginImportScreen 

Aquí podremos crear una cuenta nueva e importar una wallet mediante su frase semilla.
Al igual que con Create Wallet se creará una key con la password y con esta key se encriptará la wallet y se guardará en el archivo wallet.json
Para poder importar la wallet a partir de la frase semilla se utiliza la función ethers.Wallet.fromMnemonic(mnemonic, path).
La ruta BIP por defecto será m/44'/60'/0'/0/0. Y por defecto las palabras estarán en inglés.
m=frase, 44 es la HD key system, 60 representa a la red de Ethereum, 0 este numero indica que comenzara en 0 y se incrementará, indica la jerarquía, 0 este número no suele usarce en Ethereum, 0 este número nos indica el idioma de las palabras en este caso serán en ingles.
 
 
Bibliografía: 

https://docs.ethers.io/v5/
https://jetsoanalin.github.io/EthersJsTutorialJetso/
https://julien-maffre.medium.com/what-is-an-ethereum-keystore-file-86c8c5917b97
https://ethereum.stackexchange.com/questions/70017/can-someone-explain-the-meaning-of-derivation-path-in-wallet-in-plain-english-s
https://reactnative.dev/
https://expo.dev/
