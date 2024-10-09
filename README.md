# Proyecto de Automatización con Appium

Este proyecto contiene pruebas automatizadas para una aplicación móvil utilizando Appium y Plantilla de BrowserStack.

## Requisitos de Instalación

### Prerrequisitos

1. **Node.js**: Asegúrate de tener Node.js instalado. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

2. **Appium**: Instala Appium globalmente usando npm:
    ```sh
    npm install -g appium
    ```

3. **Appium Doctor**: Instala Appium Doctor para verificar que todos los requisitos estén configurados correctamente:
    ```sh
    npm install -g appium-doctor
    ```

4. **Java Development Kit (JDK)**: Asegúrate de tener el JDK instalado. Puedes descargarlo desde [Oracle](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).

5. **Android SDK**: Asegúrate de tener el Android SDK instalado. Puedes descargarlo desde [Android Developers](https://developer.android.com/studio).

6. **Configuración de Variables de Entorno**:
    - Añade `JAVA_HOME` a tus variables de entorno, apuntando a la ruta de instalación del JDK.
    - Añade `ANDROID_HOME` a tus variables de entorno, apuntando a la ruta de instalación del Android SDK.
    - Añade las rutas `platform-tools` y `tools` del Android SDK a la variable de entorno `PATH`.

### Instalación

1. **Clona el repositorio**:
    ```sh
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2. **Instala las dependencias del proyecto**:
    ```sh
    npm install
    ```

3. **Verifica la configuración de Appium**:
    ```sh
    appium-doctor --android
    ```

### Configuración de BrowserStack

Este proyecto utiliza BrowserStack para ejecutar las pruebas en dispositivos reales. La APK que se está probando se llama `booking`.

1. **Modifica el archivo `Browserstack.yml`**:
    - Abre el archivo `Browserstack.yml` en el editor de texto de tu preferencia.
    - Actualiza las siguientes claves con la información de tu cuenta de BrowserStack:
        ```yaml
        userName: "YOUR_BROWSERSTACK_USERNAME"
        accessKey: "YOUR_BROWSERSTACK_ACCESS_KEY"
        app: "bs://<app-id>"
        devices:
          - "Google Pixel 3"
          - "Samsung Galaxy S10"
        ```

    - **userName**: Tu nombre de usuario de BrowserStack.
    - **accessKey**: Tu clave de acceso de BrowserStack.
    - **app**: El ID de la aplicación subida a BrowserStack. Puedes obtener este ID después de subir tu APK a BrowserStack.
    - **devices**: Lista de dispositivos en los que deseas ejecutar las pruebas.

### Ejecución de Pruebas

1. **Inicia el servidor de Appium**:
    ```sh
    appium
    ```

2. **Ejecuta las pruebas**:
    ```sh
    npm test
    ```

### Estructura del Proyecto

- `test/`: Contiene los archivos de prueba.
- `config/`: Contiene los archivos de configuración.
- `screenshots/`: Contiene las capturas de pantalla tomadas durante las pruebas.

### Lenguaje de Programación

Las pruebas están escritas en **JavaScript**. Se eligió JavaScript porque es un lenguaje ampliamente utilizado y soportado por Appium, lo que facilita la integración con otras herramientas y bibliotecas de automatización. Además, JavaScript es conocido por su simplicidad y flexibilidad, lo que permite una rápida iteración y desarrollo.

### Uso de BrowserStack

Se utilizó **BrowserStack** para ejecutar las pruebas en dispositivos reales. BrowserStack proporciona una amplia gama de dispositivos y versiones de sistemas operativos, lo que permite asegurar que la aplicación funcione correctamente en diferentes entornos. Esto es crucial para aplicaciones móviles, donde la fragmentación de dispositivos y sistemas operativos puede ser un desafío significativo.

### Cobertura de Pruebas

El script de prueba cubre las siguientes funcionalidades:
- Selección de fechas de check-in y check-out.
- Confirmación de la selección de fechas.
- Ajuste del número de huéspedes.
- Selección de alojamiento y reserva.

### Herramientas y Técnicas Utilizadas

1. **Appium**: Utilizado para la automatización de pruebas en aplicaciones móviles.
2. **BrowserStack**: Utilizado para ejecutar pruebas en dispositivos reales.
3. **JavaScript**: Lenguaje de programación utilizado para escribir los scripts de prueba.
4. **Appium Doctor**: Utilizado para verificar la configuración de Appium.
5. **Capturas de Pantalla**: Utilizadas para registrar el estado de la aplicación durante las pruebas y para la depuración de errores.

### Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

### Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
