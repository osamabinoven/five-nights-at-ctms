// 游戏状态管理
class GameState {
    constructor() {
        this.currentNight = 1;
        this.maxNights = 5; // 当前版本有5晚（Night 1-5），Night 6 是特殊关卡
        this.currentTime = 0; // 0-6 (12AM-6AM)
        this.oxygen = 100; // 氧气替代电量
        this.isGameRunning = false;
        this.tutorialActive = false; // 教程是否激活
        this.currentScene = 'office';
        this.cameraOpen = false;
        this.ventsClosed = false; // 通风口状态
        this.ventsToggling = false; // 通风口是否正在切换
        this.currentCam = 'cam11'; // 当前摄像头
        this.cameraFailed = false; // 摄像头是否故障
        this.cameraRestarting = false; // 摄像头是否正在重启
        this.controlPanelBusy = false; // 控制面板是否正在处理操作
        
        // Door system
        this.doorClosed = false; // 门是否关闭
        this.doorToggling = false; // 门是否正在切换
        this.doorCloseCount = 0; // 本夜关闭门的次数
        this.doorTimer = null; // 门关闭计时器
        this.doorCooldownTimer = null; // 门冷却计时器
        this.doorCooldownActive = false; // 门是否在冷却中
        this.doorFailed = false; // 门系统是否需要重启
        this.doorRestarting = false; // 门系统是否正在重启
        
        // Custom Night 状态
        this.customNight = false; // 是否为自定义夜晚
        this.customAILevels = {
            epstein: 0,
            drHope: 0,
            hawking: 0
        };
    }

    reset() {
        this.currentTime = 0;
        this.oxygen = 100;
        this.isGameRunning = true;
        this.tutorialActive = false;
        this.currentScene = 'office';
        this.cameraOpen = false;
        this.ventsClosed = false;
        this.ventsToggling = false;
        this.currentCam = 'cam11';
        this.cameraFailed = false;
        this.cameraRestarting = false;
        this.controlPanelBusy = false;
        
        // Reset door system
        this.doorClosed = false;
        this.doorToggling = false;
        this.doorCloseCount = 0;
        this.doorFailed = false;
        this.doorRestarting = false;
        if (this.doorTimer) {
            clearTimeout(this.doorTimer);
            this.doorTimer = null;
        }
        if (this.doorCooldownTimer) {
            clearTimeout(this.doorCooldownTimer);
            this.doorCooldownTimer = null;
        }
        this.doorCooldownActive = false;
        
        // 注意：不重置 customNight 和 customAILevels，因为它们在 initGame 之前设置
    }
}

