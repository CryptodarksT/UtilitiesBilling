/**
 * ELECTRON MAIN PROCESS - BẢNG ĐIỀU KHIỂN ELEVENLABS
 * 
 * Tạo ứng dụng desktop standalone từ React app
 * Tính năng: Native desktop app, auto-updater, system integration
 */

const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// Cấu hình ứng dụng
const isDev = process.env.NODE_ENV === 'development'
const APP_NAME = 'Bảng Điều Khiển ElevenLabs'
const APP_VERSION = '2.0.0'

let mainWindow = null

/**
 * Tạo cửa sổ chính của ứng dụng
 */
function createMainWindow() {
  // Cấu hình cửa sổ chính
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    title: APP_NAME,
    icon: path.join(__dirname, 'assets', 'icon.png'), // Thêm icon nếu có
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'electron-preload.js')
    },
    show: false, // Ẩn cửa sổ ban đầu để tránh flash
    titleBarStyle: 'default',
    backgroundColor: '#0f172a', // Màu nền tối như UI
    autoHideMenuBar: false, // Hiển thị menu bar
  })

  // Load ứng dụng React
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools() // Mở DevTools trong dev mode
  } else {
    // Load file HTML được build
    const indexPath = path.join(__dirname, 'index.html')
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath)
    } else {
      // Fallback: tạo HTML đơn giản
      const fallbackHTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${APP_NAME}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container { max-width: 600px; }
        h1 { color: #3b82f6; margin-bottom: 20px; }
        .status { 
            background: rgba(59, 130, 246, 0.1); 
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .error { 
            background: rgba(239, 68, 68, 0.1); 
            border-color: #ef4444;
            color: #fca5a5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎙️ ${APP_NAME}</h1>
        <div class="status error">
            <h3>⚠️ Không tìm thấy file ứng dụng</h3>
            <p>Vui lòng build ứng dụng trước khi chạy:</p>
            <code>npm run build</code>
        </div>
        <p>Phiên bản: ${APP_VERSION}</p>
        <p>Nền tảng tạo giọng nói AI với ElevenLabs</p>
    </div>
</body>
</html>`
      
      const tempPath = path.join(__dirname, 'temp-index.html')
      fs.writeFileSync(tempPath, fallbackHTML)
      mainWindow.loadFile(tempPath)
    }
  }

  // Hiển thị cửa sổ khi đã load xong
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Focus vào cửa sổ
    if (isDev) {
      mainWindow.focus()
    }
  })

  // Xử lý khi cửa sổ đóng
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Xử lý link external
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Xử lý menu context
  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = Menu.buildFromTemplate([
      { label: 'Quay lại', role: 'back' },
      { label: 'Tiến tới', role: 'forward' },
      { label: 'Tải lại', role: 'reload' },
      { type: 'separator' },
      { label: 'Cắt', role: 'cut' },
      { label: 'Sao chép', role: 'copy' },
      { label: 'Dán', role: 'paste' },
      { type: 'separator' },
      { label: 'Kiểm tra element', click: () => mainWindow.webContents.inspectElement(params.x, params.y) }
    ])
    menu.popup()
  })
}

/**
 * Tạo menu ứng dụng
 */
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Mở File TXT...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Text Files', extensions: ['txt'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            })
            
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0]
              const content = fs.readFileSync(filePath, 'utf-8')
              // Gửi nội dung file cho renderer process
              mainWindow.webContents.send('file-opened', { filePath, content })
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Cài đặt...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('open-settings')
          }
        },
        { type: 'separator' },
        { label: 'Thoát', role: 'quit' }
      ]
    },
    {
      label: 'Chỉnh sửa',
      submenu: [
        { label: 'Hoàn tác', role: 'undo' },
        { label: 'Làm lại', role: 'redo' },
        { type: 'separator' },
        { label: 'Cắt', role: 'cut' },
        { label: 'Sao chép', role: 'copy' },
        { label: 'Dán', role: 'paste' },
        { label: 'Chọn tất cả', role: 'selectall' }
      ]
    },
    {
      label: 'Xem',
      submenu: [
        { label: 'Tải lại', role: 'reload' },
        { label: 'Tải lại mạnh', role: 'forceReload' },
        { label: 'Công cụ phát triển', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Phóng to', role: 'zoomin' },
        { label: 'Thu nhỏ', role: 'zoomout' },
        { label: 'Kích thước thực', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Toàn màn hình', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Công cụ',
      submenu: [
        {
          label: '🎙️ Tạo Giọng Nói',
          click: () => {
            mainWindow.webContents.send('navigate-to-tab', 'voice-tool')
          }
        },
        {
          label: '🔑 Quản Lý API',
          click: () => {
            mainWindow.webContents.send('navigate-to-tab', 'api-management')
          }
        },
        {
          label: '📧 Email Tạm Thời',
          click: () => {
            mainWindow.webContents.send('navigate-to-tab', 'email-accounts')
          }
        },
        {
          label: '⚡ Đăng Ký Tự Động',
          click: () => {
            mainWindow.webContents.send('navigate-to-tab', 'auto-registration')
          }
        },
        {
          label: '📊 Thống Kê',
          click: () => {
            mainWindow.webContents.send('navigate-to-tab', 'analytics')
          }
        }
      ]
    },
    {
      label: 'Trợ giúp',
      submenu: [
        {
          label: 'Hướng dẫn sử dụng',
          click: () => {
            shell.openExternal('https://elevenlabs.io/docs')
          }
        },
        {
          label: 'Báo lỗi',
          click: () => {
            shell.openExternal('https://github.com/elevenlabs/issues')
          }
        },
        { type: 'separator' },
        {
          label: `Về ${APP_NAME}`,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: `Về ${APP_NAME}`,
              message: APP_NAME,
              detail: `Phiên bản: ${APP_VERSION}\n\nNền tảng tạo giọng nói AI với ElevenLabs\nHỗ trợ tiếng Việt đầy đủ\n\nPhát triển bởi: ElevenLabs Vietnam Community`,
              buttons: ['OK']
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

/**
 * Xử lý IPC từ renderer process
 */
function setupIPC() {
  // Xử lý yêu cầu đọc file
  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      return { success: true, content }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Xử lý yêu cầu ghi file
  ipcMain.handle('write-file', async (event, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Xử lý dialog chọn file
  ipcMain.handle('select-file', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options)
    return result
  })

  // Xử lý dialog lưu file
  ipcMain.handle('save-file', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options)
    return result
  })
}

/**
 * Khởi tạo ứng dụng
 */
app.whenReady().then(() => {
  createMainWindow()
  createMenu()
  setupIPC()

  // Xử lý khi click vào icon dock (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// Thoát ứng dụng khi tất cả cửa sổ đóng (trừ macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Xử lý protocol cho deep linking
app.setAsDefaultProtocolClient('elevenlabs-tools')

// Xử lý khi ứng dụng được mở lại
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

// Ngăn chặn nhiều instance
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// Log thông tin ứng dụng
console.log(`🎙️ ${APP_NAME} v${APP_VERSION} đang khởi động...`)
console.log(`📁 App Path: ${app.getAppPath()}`)
console.log(`💾 User Data: ${app.getPath('userData')}`)
console.log(`🔧 Platform: ${process.platform}`)
