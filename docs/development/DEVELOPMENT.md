# Desarrollo — primer setup y día a día

Guía para clonar el repo, instalar dependencias y correr la app en cada plataforma.

---

## Requisitos

- **Node.js 24**
- **git**
- **npm** (viene con Node)

Plataforma adicional según lo que vayas a tocar:

| Objetivo | Herramientas |
|----------|----------------|
| Desktop | CLI de tinyjs ([Desktop](#desktop)) |
| iOS | macOS, Xcode, [CocoaPods](#ios--cocoapods) |
| Android | Android Studio |

---

## Primer clone

```bash
git clone https://github.com/matiasbarrios/magical-mixing-console.git
cd magical-mixing-console
npm install
```

`npm install` alcanza para escritorio. El build de tinyjs no incluye Capacitor: carga `src/console/gui/platform/adapter.tinyjs.js`, y el build mobile redirige ese import a `adapter.capacitor.js`.

Los plugins de Capacitor **no están versionados en el repo**. Hacen falta solo para iOS y Android. Clonalos y compilalos, y después corré `npm install` en la raíz. En el `package.json` son dependencias `file:plugins/...`. Tienen que estar en `dependencies`: `cap sync` solo mira esa lista y `devDependencies`. Si quedan en `optionalDependencies`, el sync los borra del proyecto nativo y el UDP deja de funcionar. Si las carpetas no existen, `npm install` igual termina.

### capacitor-udp-socket

```bash
git clone https://github.com/matiasbarrios/capacitor-udp-socket.git plugins/capacitor-udp-socket
cd plugins/capacitor-udp-socket
npm install
npm run build
cd ../..
```

### capacitor-navigation-bar

```bash
git clone https://github.com/matiasbarrios/capacitor-navigation-bar.git plugins/capacitor-navigation-bar
cd plugins/capacitor-navigation-bar
npm install
npm run build
cd ../..
```

Si `plugins/` ya existe pero está roto, borrá la carpeta del plugin y repetí el clone.

Después de actualizar un plugin, volvé a `npm run build` dentro de su carpeta y, si usás mobile, `npm run cap-dev` o `cap-make` según corresponda.

---

## Scripts npm útiles

Desde la raíz del repo:

| Comando | Uso |
|---------|-----|
| `npm run tinyjs-dev` | App de escritorio en modo desarrollo |
| `npm run cap-dev` | Bundle web + `cap sync` para mobile en desarrollo |
| `npm run cap-make` | Bundle de producción + `cap sync` (antes de release mobile) |
| `npm run cap-android` | Abre el proyecto en Android Studio |
| `npm run cap-ios` | Abre el proyecto en Xcode |
| `npm run cap-assets` | Regenera íconos/splash de Capacitor |
| `npm run lint` | ESLint en `./src` |
| `npm test` | Tests unitarios (Vitest) — ver [TESTING.md](../TESTING.md) |
| `npm run test:integration` | Integración mixers + virtual X18 — ver [TESTING.md](../TESTING.md) |

Empaquetado desktop: `build-linux` y `build-windows` arman el instalador en esa máquina (antes, `tinyjs-build`). `build-mac` arma y notariza los dos DMG en la Mac y los deja en `out/macos-arm64/` y `out/macos-x86_64/`.

---

## Desktop

tinyjs no hace cross-compile: cada sistema genera su propio build. El proyecto exige el CLI 0.68.0 o posterior (`minTinyjsVersion` en `tinyjs.json`).

| Comando | Uso |
|---------|-----|
| `npm run tinyjs-dev` | App en modo desarrollo (dev server en el puerto 3002, logs del backend en la terminal) |
| `npm run tinyjs-build` | Build de producción en `dist/` |

### Debug

- **DevTools:** `F12` en la ventana de `tinyjs-dev` (siempre activas en dev).
- **Log del backend:** sale en la terminal de `tinyjs-dev` (`console.log` del backend).
- **Tráfico del puente página ↔ backend:** `TINYJS_DEBUG=1` traza cada mensaje (`NAVQ`, `CALL`, `RET`, `EVAL`…). En PowerShell: `$env:TINYJS_DEBUG='1'; npm run tinyjs-dev`.
- **CDP en Windows:** `$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS='--remote-debugging-port=9222'` antes de `tinyjs-dev` expone el WebView2 en `http://127.0.0.1:9222/json`, para inspeccionarlo desde `edge://inspect` o un script.

### Build en Windows

1. Instalar Node 24 y git.
2. Instalar el CLI de tinyjs desde PowerShell y abrir una terminal nueva para que tome el `PATH`:

   ```powershell
   irm https://tinyjs.app/install.ps1 | iex
   tinyjs update
   tinyjs --version
   ```

3. Clonar el repo y correr `npm install`. Los plugins de Capacitor no hacen falta para este build.
4. Probar primero en modo desarrollo, que muestra los logs del backend (el `.exe` final no tiene consola):

   ```powershell
   npm run tinyjs-dev
   ```

   Al buscar consolas no tiene que aparecer `Winsock not available` ni `UDP broadcast not available on this platform`.

5. Generar el build:

   ```powershell
   npm run tinyjs-build
   .\dist\magical-mixing-console.exe
   ```

   `dist/` es una carpeta portable: `magical-mixing-console.exe` y `launcher.exe` tienen que ir juntos. Para llevarla a otra PC, comprimir la carpeta entera. Necesita el runtime de WebView2, que viene con Windows 11.

6. Generar el instalador. Requiere [Inno Setup](https://jrsoftware.org/isinfo.php) 6.3 o superior, una sola vez por máquina:

   ```powershell
   winget install JRSoftware.InnoSetup
   npm run build-windows
   ```

   Genera `dist/magical-mixing-console-<versión>-windows-x64-setup.exe`. El script está en `installer/windows/magical-mixing-console.iss`. Falla si las versiones de `package.json` y `tinyjs.json` difieren, o si falta el build. Si Inno Setup está en una ruta no estándar, definir `ISCC` con la ruta a `ISCC.exe`.

   El instalador:
   - Instala por usuario, sin permisos de administrador, en `%LocalAppData%\Programs\Magical Mixing Console`.
   - Crea el acceso directo en el menú inicio (y en el escritorio, opcional), la entrada en "Agregar o quitar programas" y el desinstalador.
   - Si falta WebView2, descarga el bootstrapper de Microsoft y lo instala para el usuario. Si no puede, avisa y ofrece abrir la página de descarga.
   - Si encuentra la versión de Electron (`%LocalAppData%\magical-mixing-console\Update.exe`), la desinstala con Squirrel antes de copiar los archivos. Los datos de Electron en `%APPDATA%\Magical Mixing Console` no se tocan: la app los copia a su carpeta en el primer arranque.
   - Al desinstalar borra caché y logs (`%LocalAppData%\com.magicalmixing.console`), pero no los settings ni los vaults (`%APPDATA%\com.magicalmixing.console`).
   - Deja un log en `%TEMP%\Setup Log <fecha>.txt`.

Si Windows pide permiso de red para la app, aceptarlo para redes privadas. Si la búsqueda no encuentra consolas y no hay errores en los logs, revisar el firewall.

### Build en Linux

Sirve cualquier Debian o Ubuntu con escritorio. El build no compila nada nativo: usa los binarios precompilados de tinyjs, que piden glibc 2.35 o superior (Ubuntu 22.04, Debian 12, Mint 21 y posteriores), sin importar en qué distro se genere.

1. Instalar Node 24, git y el runtime de WebKitGTK:

   ```bash
   sudo apt install libwebkit2gtk-4.1-0
   ```

2. Instalar el CLI de tinyjs y abrir una terminal nueva:

   ```bash
   curl -fsSL https://tinyjs.app/install | sh
   tinyjs update
   tinyjs --version
   ```

3. Clonar el repo y correr `npm install`. Los plugins de Capacitor no hacen falta para este build.
4. Probar en modo desarrollo (`npm run tinyjs-dev`). La búsqueda de consolas usa el mismo socket que en mac.
5. Generar el build y el `.deb`:

   ```bash
   npm run tinyjs-build
   ./dist/magical-mixing-console
   npm run build-linux
   sudo apt install ./dist/magical-mixing-console-<versión>-linux-amd64.deb
   ```

   `dist/` es una carpeta portable: `magical-mixing-console`, `launcher` e `icon.png`. El `.deb` lo arma `installer/linux/build.js` con `dpkg-deb`:
   - Mismo nombre de paquete que el `.deb` de Electron (`magical-mixing-console`): instalarlo reemplaza esa versión y borra sus archivos. Los datos de Electron (`~/.config/Magical Mixing Console`) se migran en el primer arranque.
   - Instala en `/usr/lib/magical-mixing-console/`, con `magical-mixing-console` en el `PATH`, la entrada en el menú de aplicaciones y el ícono.
   - Declara las librerías que usan los binarios de tinyjs (WebKitGTK 4.1, GTK 3, AppIndicator, PipeWire, libXtst, libffi); `apt` las instala si faltan.
   - En el primer arranque la app escribe su propio `~/.local/share/applications/com.magicalmixing.console.desktop`. Tiene el mismo nombre que el del paquete, así que lo tapa y no aparece dos veces en el menú. Al desinstalar con `apt` ese archivo queda, porque es del usuario.

---

## Capas del código

No importes GUI desde `mixers`. Resumen de carpetas:

| Capa | Ruta |
|------|------|
| UI | `src/console/gui/` |
| tinyjs / Capacitor (plataforma) | `src/console/tinyjs/`, `src/console/capacitor/` |
| Hooks React | `src/mixers-react/` |
| Drivers OSC | `src/mixers/` |
| Mixer virtual (dev) | `src/virtual-devices/` |

Detalle: [ARCHITECTURE.md](../reference/ARCHITECTURE.md), términos de dominio: [CONCEPTS.md](../reference/CONCEPTS.md).

### Paquetes npm (workspaces)

El root declara `"workspaces": ["src/*"]`. Estos directorios **son** los paquetes npm que importa la app:

| Carpeta | Nombre npm | Rol |
|---------|------------|-----|
| `src/mixers/` | `@magical-mixing/mixers` | Drivers OSC, búsqueda de mesas, protocolo |
| `src/mixers-react/` | `@magical-mixing/mixers-react` | Hooks React sobre mixers |
| `src/console/` | `@magical-mixing/console` | App (GUI + tinyjs/capacitor) |
| `src/virtual-devices/` | `@magical-mixing/virtual-devices` | X18 simulado para dev |

Tras `npm install`, `node_modules/@magical-mixing/mixers` es un **symlink** a `src/mixers` (no una copia del registry). **Si editás `src/mixers/`, la app usa esos cambios al instante** sin `npm update`.

La app importa `@magical-mixing/mixers` / `mixers-react` en el código; no importa rutas `src/mixers/...` directamente.

La versión en `src/mixers/package.json` (`1.0.0` hoy) es la del **paquete npm**, distinta de la app (`2.0.0` en el root).

### Tres “salidas” distintas (no se actualizan solas)

| Dónde | Qué es | Cómo se actualiza |
|-------|--------|-------------------|
| **Este monorepo** | `magical-mixing-console` → carpeta `src/mixers/` | `git push` del repo de la consola |
| **GitHub público** | [matiasbarrios/magical-mixers](https://github.com/matiasbarrios/magical-mixers) | `git push` a **ese** repo |
| **npm** | `@magical-mixing/mixers` (scoped, desde `src/mixers/package.json`) | `npm publish` en `src/mixers` |

Si editás mixers acá y solo pusheás la consola, **GitHub magical-mixers y npm quedan viejos**. Por eso no ves tus últimos cambios en [github.com/matiasbarrios/magical-mixers](https://github.com/matiasbarrios/magical-mixers).

El repo público en GitHub tiene **otra historia y otro layout** (código bajo `src/`, ejemplos con `core/`, paquete documentado como `magical-mixers`). En el monorepo el código vive en la raíz de `src/mixers/` (`drivers/`, `devices/`, …) y el paquete se llama `@magical-mixing/mixers`. Son la misma librería en evolución, pero **no están enlazados por git**.

---

## iOS — CocoaPods

Antes de trabajar con iOS (o si `pod install` falla en `ios/`):

```bash
brew install cocoapods
```

Luego, tras `npm run cap-dev` o `cap-make`, abrí Xcode con `npm run cap-ios`.

### Fallo al distribuir (Archive → App Store)

Si la subida falla de forma rara, probá quitar un `rsync` de Homebrew que pisa el de Xcode:

```bash
brew uninstall rsync
```

---

## Android — logs en Android Studio

Filtro útil en Logcat:

```
package:mine level:info
```

---

## Depuración de red (OSC / UDP)

Filtros de Wireshark para el lab y tráfico X Air: [DEBUGGING_NETWORK.md](./DEBUGGING_NETWORK.md). Arquitectura de sockets: [CONNECTIVITY.md](../reference/CONNECTIVITY.md).

---

## Documentación relacionada

| Doc | Contenido |
|-----|-----------|
| [DEBUGGING_NETWORK.md](./DEBUGGING_NETWORK.md) | Wireshark |
| [HOTKEYS.md](./HOTKEYS.md) | Atajos de teclado configurables (guía para implementar) |
| [GUI.md](../gui/GUI.md) | Convenciones de UI |
| [LAYOUT.md](../gui/LAYOUT.md) | Shells, header trail, entity views (tabs, layout modes) |
| [LIST_PATTERN.md](../gui/LIST_PATTERN.md) | Patrones de listas en la GUI |
