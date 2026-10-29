# Primal Echoes: Underground

Public source repository for the Primal Echoes: Underground browser game.

## Source
The current game files are in `public/` and were copied from the Hatchable project.

## Run locally
Serve the repository root with a local HTTP server and open `public/index.html`. Because the 3D/VR code uses ES modules and WebXR, opening the HTML directly as a `file://` URL may not work. WebXR also requires a supported browser, a secure context, and compatible VR hardware.

## APK status
This repository currently contains the web-game source. It is **not yet a verified Android/Meta Quest APK**. A wrapper and build workflow still need to be added and the immersive VR experience tested on a headset.
