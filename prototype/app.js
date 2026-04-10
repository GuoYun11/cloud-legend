/**
 * 《云传奇》UI原型交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 页面切换功能
    const navTabs = document.querySelectorAll('.nav-tab');
    const backButtons = document.querySelectorAll('.btn-back');
    const screens = document.querySelectorAll('.screen');
    
    // Tab切换
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetScreen = this.dataset.screen;
            switchScreen(targetScreen);
            
            // 更新tab激活状态
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 返回按钮
    backButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetScreen = this.dataset.screen;
            switchScreen(targetScreen);
            
            // 重置tab状态
            navTabs.forEach(t => t.classList.remove('active'));
            document.querySelector(`[data-screen="${targetScreen}"]`).classList.add('active');
        });
    });
    
    // 切换页面函数
    function switchScreen(screenName) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(`screen-${screenName}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
    
    // 离线收益按钮点击效果
    const offlineRewardBtn = document.querySelector('.btn-offline-reward');
    if (offlineRewardBtn) {
        offlineRewardBtn.addEventListener('click', function() {
            showToast('领取成功！获得金币 25,600', 'success');
            
            // 按钮动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // 装备格子点击效果
    const equipmentSlots = document.querySelectorAll('.equipment-slot, .bag-item, .zodiac-item');
    equipmentSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (!this.classList.contains('empty')) {
                // 添加点击动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // 显示提示
                const name = this.querySelector('.slot-name, .item-name, .zodiac-name');
                if (name) {
                    showToast(`选中: ${name.textContent}`, 'info');
                }
            }
        });
    });
    
    // 地图卡片点击效果
    const mapCards = document.querySelectorAll('.map-card');
    mapCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('locked')) {
                showToast('该地图尚未解锁', 'error');
            } else if (this.classList.contains('current')) {
                showToast('当前正在此地图挂机', 'info');
            } else {
                const mapName = this.querySelector('.map-card-name').textContent;
                showToast(`切换到: ${mapName}`, 'success');
                
                // 更新当前地图显示
                document.querySelector('.map-name').textContent = `🗺️ ${mapName}`;
            }
            
            // 点击动画
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 战斗日志自动滚动
    const battleLog = document.querySelector('.battle-log');
    if (battleLog) {
        // 模拟添加新日志
        setInterval(() => {
            const messages = [
                { text: '⚔️ 你攻击了双头血魔，造成' + Math.floor(Math.random() * 2000 + 1000) + '点伤害', type: 'normal' },
                { text: '💰 获得金币 +' + Math.floor(Math.random() * 500 + 100), type: 'gold' },
                { text: '☯️ 无极真气爆发！道法暴涨！', type: 'skill' },
            ];
            
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            addLogEntry(randomMsg.text, randomMsg.type);
        }, 3000);
    }
    
    function addLogEntry(text, type = 'normal') {
        if (!battleLog) return;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = text;
        
        if (type === 'gold') {
            entry.classList.add('gold');
        } else if (type === 'skill') {
            entry.classList.add('skill');
        }
        
        battleLog.appendChild(entry);
        battleLog.scrollTop = battleLog.scrollHeight;
        
        // 限制日志数量
        while (battleLog.children.length > 20) {
            battleLog.removeChild(battleLog.firstChild);
        }
    }
    
    // Toast提示函数
    function showToast(message, type = 'info') {
        // 移除已有的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // 样式
        toast.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            background: linear-gradient(180deg, #3D2416 0%, #2C1810 100%);
            border: 1px solid #D4AF37;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
            z-index: 2000;
            font-size: 13px;
            color: #F5DEB3;
            animation: toast-in 0.3s ease;
        `;
        
        if (type === 'success') {
            toast.style.borderColor = '#4CAF50';
        } else if (type === 'error') {
            toast.style.borderColor = '#DC143C';
        }
        
        document.body.appendChild(toast);
        
        // 自动消失
        setTimeout(() => {
            toast.style.animation = 'toast-out 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
    
    // 添加toast动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toast-in {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes toast-out {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 模拟血条变化
    function simulateBattle() {
        const monsterHealthFill = document.querySelector('.monster-health-bar .progress-fill');
        const healthPercent = document.querySelector('.health-percent');
        
        if (monsterHealthFill && healthPercent) {
            let currentHealth = 72;
            
            setInterval(() => {
                currentHealth -= Math.floor(Math.random() * 5 + 1);
                if (currentHealth < 0) {
                    currentHealth = 100;
                    showToast('双头血魔被击败！', 'success');
                }
                
                monsterHealthFill.style.width = currentHealth + '%';
                healthPercent.textContent = currentHealth + '%';
            }, 2000);
        }
    }
    
    // 启动战斗模拟
    simulateBattle();
    
    // 按钮点击音效模拟（视觉反馈）
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
    
    console.log('《云传奇》UI原型已加载完成');
});
