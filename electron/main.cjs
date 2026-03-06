const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const dataFilePath = path.join(app.getPath('userData'), 'travelData.json');

// Initialize with some mock data if the file doesn't exist
const initializeData = () => {
    if (!fs.existsSync(dataFilePath)) {
        const initialData = [
            {
                id: "loc-1",
                lat: 30.57,
                lng: 104.07,
                title: "Chengdu, China",
                date: "October 2024",
                type: "vacation",
                photos: [
                    "https://images.unsplash.com/photo-1543888775-8bd3c1bceeab?q=80&w=400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1579737968434-d3ba919af468?q=80&w=400&auto=format&fit=crop"
                ],
                description: "## The City of Pandas and Spices\n\nChengdu is absolutely incredible..."
            }
        ];
        fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
    }
};

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (isDev) {
        // In development, load the Vite dev server
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load the built static index.html
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    initializeData();

    // IPC Handlers for reading and writing data safely
    ipcMain.handle('get-locations', () => {
        try {
            const data = fs.readFileSync(dataFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to read locations:', error);
            return [];
        }
    });

    ipcMain.handle('save-locations', (event, locations) => {
        try {
            fs.writeFileSync(dataFilePath, JSON.stringify(locations, null, 2));
            return { success: true };
        } catch (error) {
            console.error('Failed to save locations:', error);
            return { success: false, error: error.message };
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
