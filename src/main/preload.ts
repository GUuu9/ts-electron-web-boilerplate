import { contextBridge } from 'electron';
import { tcpBridge } from './features/network/tcp/tcp.bridge.js';
import { udpBridge } from './features/network/udp/udp.bridge.js';
import { socketBridge } from './features/network/socket/socket.bridge.js';
import { osBridge } from './features/os/os.bridge.js';
import { systemBridge } from './features/system/system.bridge.js';
import { persistenceBridge } from './features/persistence/persistence.bridge.js';
import { securityBridge } from './features/security/security.bridge.js';
import { serialBridge } from './features/serial/serial.bridge.js';
import { mediaBridge } from './features/media/media.bridge.js';
import { fileBridge } from './features/file/file.bridge.js';
import { loggerBridge } from './features/logger/logger.bridge.js';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  tcp: tcpBridge,
  udp: udpBridge,
  socket: socketBridge,
  os: osBridge,
  system: systemBridge,
  persistence: persistenceBridge,
  security: securityBridge,
  serial: serialBridge,
  media: mediaBridge,
  file: fileBridge,
  logger: loggerBridge
});