/**
 * ELECTRON PRELOAD SCRIPT - BẢNG ĐIỀU KHIỂN ELEVENLABS
 * 
 * Cầu nối an toàn giữa Electron main process và React renderer
 * Cung cấp API để React app tương tác với filesystem và OS
 */

const { contextBridge, ipcRenderer } = require('electron')

// Expose APIs an toàn cho renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations - Thao tác file
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  saveFile: (options) => ipcRenderer.invoke('save-file', options),

  // Event listeners - Lắng nghe sự kiện từ main process
  onFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  onNavigateToTab: (callback) => ipcRenderer.on('navigate-to-tab', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),

  // Utility functions - Hàm tiện ích
  platform: process.platform,
  versions: process.versions,
  
  // App info
  appInfo: {
    name: 'Bảng Điều Khiển ElevenLabs',
    version: '2.0.0',
    isElectron: true
  }
})

// Log thông tin preload
console.log('🔌 Electron Preload đã được tải thành công')
console.log('📋 API đã được expose:', Object.keys(window.electronAPI || {}))
