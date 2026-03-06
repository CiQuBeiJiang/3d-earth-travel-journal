const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const dataFilePath = path.join(app.getPath('userData'), 'travelData.json');
const tagsFilePath = path.join(app.getPath('userData'), 'tagsData.json');

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
                tags: ["tag-1", "tag-5"],
                photos: [
                    "https://images.unsplash.com/photo-1543888775-8bd3c1bceeab?q=80&w=400&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1579737968434-d3ba919af468?q=80&w=400&auto=format&fit=crop"
                ],
                description: "## The City of Pandas and Spices\n\nChengdu is absolutely incredible..."
            }
        ];
        fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
    }

    if (!fs.existsSync(tagsFilePath)) {
        const defaultTags = [
            { id: 'tag-1', label: 'Vacation', icon: '🏖️', color: '#ff9800' },
            { id: 'tag-2', label: 'Business', icon: '💼', color: '#4caf50' },
            { id: 'tag-3', label: 'Nature', icon: '🏔️', color: '#2e7d32' },
            { id: 'tag-4', label: 'City', icon: '🏢', color: '#1976d2' },
            { id: 'tag-5', label: 'Food', icon: '🍜', color: '#e53935' }
        ];
        fs.writeFileSync(tagsFilePath, JSON.stringify(defaultTags, null, 2));
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
    // Register custom protocol to securely read from local filesystem
    protocol.registerFileProtocol('local', (request, callback) => {
        const url = request.url.replace('local://', '');
        try {
            return callback(decodeURIComponent(url));
        } catch (error) {
            console.error("Failed to load local file protocol:", error);
        }
    });

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

    ipcMain.handle('get-tags', () => {
        try {
            const data = fs.readFileSync(tagsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to read tags:', error);
            return [];
        }
    });

    ipcMain.handle('export-data', async () => {
        try {
            const locations = fs.existsSync(dataFilePath) ? JSON.parse(fs.readFileSync(dataFilePath, 'utf8')) : [];
            const tags = fs.existsSync(tagsFilePath) ? JSON.parse(fs.readFileSync(tagsFilePath, 'utf8')) : [];
            const backupData = { locations, tags, version: '1.0' };

            const { canceled, filePath } = await dialog.showSaveDialog({
                title: 'Export Travel Log Backup',
                defaultPath: 'travel-log-backup.json',
                filters: [{ name: 'JSON Files', extensions: ['json'] }]
            });

            if (canceled || !filePath) return { success: false, canceled: true };

            fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
            return { success: true, filePath };
        } catch (error) {
            console.error('Export failed:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('import-data', async () => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Import Travel Log Backup',
                properties: ['openFile'],
                filters: [{ name: 'JSON Files', extensions: ['json'] }]
            });

            if (canceled || filePaths.length === 0) return { success: false, canceled: true };

            const backupData = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));

            if (backupData.locations) fs.writeFileSync(dataFilePath, JSON.stringify(backupData.locations, null, 2));
            if (backupData.tags) fs.writeFileSync(tagsFilePath, JSON.stringify(backupData.tags, null, 2));

            return { success: true, data: backupData };
        } catch (error) {
            console.error('Import failed:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('save-tags', (event, tags) => {
        try {
            fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2));
            return { success: true };
        } catch (error) {
            console.error('Failed to save tags:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('select-images', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'webp', 'jpeg', 'gif'] }]
        });

        if (result.canceled) {
            return [];
        }

        const photosDir = path.join(app.getPath('userData'), 'photos');
        if (!fs.existsSync(photosDir)) {
            fs.mkdirSync(photosDir, { recursive: true });
        }

        const newPhotoURIs = [];
        for (const file of result.filePaths) {
            const ext = path.extname(file);
            const fileName = `photo_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
            const destPath = path.join(photosDir, fileName);
            fs.copyFileSync(file, destPath);
            // Prefix the path with our secure custom protocol so the frontend can load it
            newPhotoURIs.push(`local://${destPath}`);
        }

        return newPhotoURIs;
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
