// Input handler
class InputHandler {
    constructor(game) {
        this.game = game;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isTouching = false;
        this.adminCodeBuffer = '';
        this.adminCodeTimer = null;
        this.bindEvents();
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Mouse movement view control - edge trigger
        const gameScreen = document.getElementById('game-screen');
        gameScreen.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch controls for mobile
        gameScreen.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        gameScreen.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        gameScreen.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    handleKeyPress(e) {
        const target = e.target;
        const isAdminField = target && target.closest && target.closest('#admin-menu-panel');

        if (this.game.state.isGameRunning && !isAdminField && !e.ctrlKey && !e.metaKey && !e.altKey) {
            this.trackAdminCode(e.key);
        }

        if (this.game.state.adminMenuOpen) {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.game.closeAdminMenu();
            }
            if (isAdminField) {
                return;
            }
            if (e.key !== 'Escape') {
                e.preventDefault();
            }
            return;
        }

        if (!this.game.state.isGameRunning) return;
        
        switch(e.key.toLowerCase()) {
            case 'v': 
                this.game.toggleVents(); 
                break;
            case ' ': 
                e.preventDefault();
                this.game.toggleCamera();
                break;
            case 'e':
                this.game.toggleDoor();
                break;
        }
    }

    trackAdminCode(key) {
        if (key === '9') {
            this.adminCodeBuffer = (this.adminCodeBuffer + '9').slice(-3);
            if (this.adminCodeTimer) {
                clearTimeout(this.adminCodeTimer);
            }
            this.adminCodeTimer = setTimeout(() => {
                this.adminCodeBuffer = '';
                this.adminCodeTimer = null;
            }, 900);

            if (this.adminCodeBuffer === '999') {
                this.adminCodeBuffer = '';
                clearTimeout(this.adminCodeTimer);
                this.adminCodeTimer = null;
                this.game.toggleAdminMenu();
            }
        } else if (key.length === 1) {
            this.adminCodeBuffer = '';
            if (this.adminCodeTimer) {
                clearTimeout(this.adminCodeTimer);
                this.adminCodeTimer = null;
            }
        }
    }

    handleMouseMove(e) {
        if (!this.game.state.isGameRunning || this.game.state.cameraOpen) return;
        
        const edgeThreshold = 100;
        const mouseX = e.clientX;
        const screenWidth = window.innerWidth;
        
        // Check if at left edge
        if (mouseX < edgeThreshold) {
            this.game.isRotatingLeft = true;
            this.game.isRotatingRight = false;
        }
        // Check if at right edge
        else if (mouseX > screenWidth - edgeThreshold) {
            this.game.isRotatingRight = true;
            this.game.isRotatingLeft = false;
        }
        // In middle area, stop rotation
        else {
            this.game.isRotatingLeft = false;
            this.game.isRotatingRight = false;
        }
    }
    
    handleTouchStart(e) {
        if (!this.game.state.isGameRunning || this.game.state.cameraOpen) return;
        
        // Don't prevent default if touching UI elements
        const target = e.target;
        if (target.closest('.hotspot') || target.closest('.control-panel-button') || 
            target.closest('.camera-button') || target.closest('#control-panel-popup')) {
            return;
        }
        
        e.preventDefault();
        
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.isTouching = true;
    }
    
    handleTouchMove(e) {
        if (!this.game.state.isGameRunning || this.game.state.cameraOpen || !this.isTouching) return;
        
        // Don't prevent default if touching UI elements
        const target = e.target;
        if (target.closest('.hotspot') || target.closest('.control-panel-button') || 
            target.closest('.camera-button') || target.closest('#control-panel-popup')) {
            return;
        }
        
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        
        // Only rotate if horizontal swipe (not vertical)
        if (deltaY < 50) {
            const sensitivity = 0.002;
            // Reverse the direction: swipe right = view right, swipe left = view left
            const movement = -deltaX * sensitivity;
            
            // Update view position directly
            this.game.viewPosition += movement;
            this.game.viewPosition = Math.max(0, Math.min(1, this.game.viewPosition));
            this.game.ui.updateViewPosition(this.game.viewPosition);
            
            // Update touch start position for smooth continuous movement
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }
    }
    
    handleTouchEnd(e) {
        if (!this.game.state.isGameRunning) return;
        
        this.isTouching = false;
        this.game.isRotatingLeft = false;
        this.game.isRotatingRight = false;
    }
}

