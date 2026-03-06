export const translations = {
    en: {
        app: {
            title: 'My Travel ',
            titleHighlight: 'Log',
            subtitle: 'Explore the globe to see my memories.',
            shortcutHint: '(Press H to hide UI)',
            addMemory: 'Add Memory',
            playJourney: 'Play Journey',
            stop: 'Stop',
            settings: 'Settings',
            exitImmersive: 'Exit Immersive'
        },
        settings: {
            title: 'Settings',
            language: 'Language',
            theme: 'Theme',
            themeSky: 'Sky',
            themeSpace: 'Space',
            immersive: 'Immersive Mode', // Renamed from immersiveMode
            fontSize: {
                title: 'Font Size',
                small: 'Small',
                medium: 'Medium',
                large: 'Large'
            },
            rotation: { // Restructured from rotation, rotAlways, rotIdle, rotNever
                title: 'Globe Rotation',
                always: 'Always Spin',
                idle: 'Spin When Idle',
                never: 'Never Spin'
            },
            dataManagement: 'Data Management',
            exportBackup: 'Export Backup',
            importBackup: 'Import Backup'
        },
        tags: {
            vacation: 'Vacation',
            business: 'Business',
            nature: 'Nature',
            city: 'City',
            food: 'Food'
        },
        shortcuts: {
            title: 'Keyboard Shortcuts',
            pauseRotation: 'Pause / Resume',
            spacebar: 'Space',
            closePanel: 'Close Details Panel',
            escape: 'ESC',
            toggleImmersive: 'Toggle Immersive Mode',
            ctrlH: '⌘H / Ctrl+H'
        },
        locationForm: {
            title: 'Add New Memory',
            cityDetails: 'City & Details',
            cityName: 'City Name',
            cityNamePlaceholder: 'e.g., Kyoto, Japan',
            date: 'Date',
            datePlaceholder: 'e.g., Spring 2024',
            travelogue: 'Travelogue',
            traveloguePlaceholder: 'Title of your journey...',
            description: 'Experience Description (Markdown Supported)',
            descriptionPlaceholder: 'What did you see? Who did you meet? How was the food?',
            tags: 'Tags',
            selectTags: 'Select primary tag...',
            photos: 'Photos',
            selectPhotos: 'Select Photos from Computer',
            selectPhotosPlaceholder: 'Choose Files...',
            addPhoto: 'Add Photo',
            cancel: 'Cancel',
            save: 'Save Memory'
        },
        locationDetails: {
            deleteConfirm: 'Are you sure you want to delete the travel log for {city}?'
        }
    },
    zh: {
        app: {
            title: '我的旅行',
            titleHighlight: '日志',
            subtitle: '转动地球，探索我的记忆坐标。',
            shortcutHint: '（按 H 键隐藏界面）',
            addMemory: '添加记忆',
            playJourney: '播放旅程',
            stop: '停止播放',
            settings: '设置',
            exitImmersive: '退出沉浸模式'
        },
        settings: {
            title: '系统设置',
            language: '界面语言',
            theme: '主题模式',
            themeSky: '白昼天空',
            themeSpace: '深空宇宙',
            immersive: '沉浸全屏模式', // Renamed from immersiveMode
            fontSize: {
                title: '字体大小',
                small: '小',
                medium: '中',
                large: '大'
            },
            rotation: { // Restructured from rotation, rotAlways, rotIdle, rotNever
                title: '地球自转',
                always: '始终自转',
                idle: '空闲时自转',
                never: '从不自转'
            },
            dataManagement: '数据管理',
            exportBackup: '导出备份',
            importBackup: '导入备份'
        },
        tags: {
            vacation: '度假旅行',
            business: '商务出差',
            nature: '自然风光',
            city: '城市探索',
            food: '美食打卡'
        },
        shortcuts: {
            title: '快捷键说明',
            pauseRotation: '暂停 / 恢复自转',
            spacebar: '空格 (Space)',
            closePanel: '关闭详情面板',
            escape: 'ESC',
            toggleImmersive: '沉浸全屏模式',
            ctrlH: '⌘H / Ctrl+H'
        },
        locationForm: {
            title: '新增旅行记忆',
            cityDetails: '城市与细节',
            cityName: '城市名称',
            cityNamePlaceholder: '例如：中国 成都',
            date: '时间',
            datePlaceholder: '例如：2024年春',
            travelogue: '游记',
            traveloguePlaceholder: '这段旅程的主标题...',
            description: '经历描述（支持 Markdown 语法）',
            descriptionPlaceholder: '你看到了什么？遇见了谁？食物味道如何？',
            tags: '标签分类',
            selectTags: '选择关联标签...',
            photos: '照片精选',
            selectPhotos: '从电脑中选择照片',
            selectPhotosPlaceholder: '点击选择文件...',
            addPhoto: '添加图片',
            cancel: '取消',
            save: '保存记忆'
        },
        locationDetails: {
            deleteConfirm: '确定要删除 {city} 的旅行记录吗？'
        }
    }
};
