// 智能视频处理系统 - 前端交互脚本

class VideoProcessingApp {
    constructor() {
        this.currentStep = 'upload';
        this.selectedVideo = null;
        this.selectedScenicSpot = '';
        this.matchResults = [];
        this.selectedMatch = null;
        this.taskId = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupDragAndDrop();
    }

    bindEvents() {
        // 文件选择
        const uploadArea = document.getElementById('uploadArea');
        const videoInput = document.getElementById('videoInput');
        
        uploadArea.addEventListener('click', () => {
            videoInput.click();
        });
        
        videoInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // 景点选择
        const scenicSelect = document.getElementById('scenicSelect');
        scenicSelect.addEventListener('change', (e) => {
            this.selectedScenicSpot = e.target.value;
            this.updateMatchButtonState();
        });

        // 开始匹配按钮
        const matchBtn = document.getElementById('matchBtn');
        matchBtn.addEventListener('click', () => {
            this.startMatching();
        });

        // 生成视频按钮
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.addEventListener('click', () => {
            this.startVideoGeneration();
        });

        // 结果操作按钮
        this.bindResultActions();
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
    }

    handleFileSelect(file) {
        if (!file) return;
        
        // 验证文件类型
        if (!file.type.startsWith('video/')) {
            this.showNotification('请选择视频文件', 'error');
            return;
        }
        
        // 验证文件大小 (500MB)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification('文件大小不能超过500MB', 'error');
            return;
        }
        
        this.selectedVideo = file;
        this.simulateUpload();
    }

    simulateUpload() {
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.querySelector('.progress-percent');
        const scenicSpotSelector = document.getElementById('scenicSpotSelector');
        
        progressContainer.style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressPercent.textContent = Math.round(progress) + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    scenicSpotSelector.style.display = 'block';
                    this.showNotification('视频上传成功！', 'success');
                }, 500);
            }
        }, 200);
    }

    updateMatchButtonState() {
        const matchBtn = document.getElementById('matchBtn');
        if (this.selectedVideo && this.selectedScenicSpot) {
            matchBtn.style.display = 'block';
            matchBtn.disabled = false;
        } else {
            matchBtn.disabled = true;
        }
    }

    startMatching() {
        const matchSection = document.getElementById('matchSection');
        const matchStatus = document.getElementById('matchStatus');
        
        matchSection.style.display = 'block';
        matchSection.scrollIntoView({ behavior: 'smooth' });
        
        // 模拟匹配过程
        setTimeout(() => {
            this.displayMatchResults();
        }, 3000);
    }

    displayMatchResults() {
        const matchStatus = document.getElementById('matchStatus');
        const matchResults = document.getElementById('matchResults');
        const generateBtn = document.getElementById('generateBtn');
        
        // 模拟匹配结果数据
        this.matchResults = [
            {
                id: 'sv_001',
                title: `${this.selectedScenicSpot}日出美景`,
                similarity: 0.92,
                season: '春季',
                weather: '晴朗',
                time: '日出',
                duration: '8秒',
                thumbnail: 'assets/scenic-1.jpg'
            },
            {
                id: 'sv_002', 
                title: `${this.selectedScenicSpot}云海奇观`,
                similarity: 0.87,
                season: '春季',
                weather: '多云',
                time: '清晨',
                duration: '6秒',
                thumbnail: 'assets/scenic-2.jpg'
            },
            {
                id: 'sv_003',
                title: `${this.selectedScenicSpot}山峰全景`,
                similarity: 0.83,
                season: '春季',
                weather: '晴朗',
                time: '上午',
                duration: '10秒',
                thumbnail: 'assets/scenic-3.jpg'
            },
            {
                id: 'sv_004',
                title: `${this.selectedScenicSpot}石林景观`,
                similarity: 0.78,
                season: '春季',
                weather: '阴天',
                time: '下午',
                duration: '7秒',
                thumbnail: 'assets/scenic-4.jpg'
            }
        ];
        
        matchStatus.innerHTML = `
            <span class="status-text">找到 ${this.matchResults.length} 个匹配结果</span>
            <span style="color: #48bb78; font-weight: 600;">✅ 匹配完成</span>
        `;
        
        matchResults.innerHTML = this.matchResults.map((match, index) => `
            <div class="match-item" data-match-id="${match.id}" onclick="app.selectMatch('${match.id}')">
                <div class="match-thumbnail" style="background: linear-gradient(45deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    🏔️
                </div>
                <div class="match-info">
                    <div class="match-title">${match.title}</div>
                    <div class="match-details">
                        <span class="match-tag">${match.season}</span>
                        <span class="match-tag">${match.weather}</span>
                        <span class="match-tag">${match.time}</span>
                        <span class="match-tag">${match.duration}</span>
                    </div>
                    <div class="match-score">相似度: ${(match.similarity * 100).toFixed(0)}%</div>
                </div>
            </div>
        `).join('');
        
        // 默认选择第一个匹配结果
        this.selectMatch(this.matchResults[0].id);
        generateBtn.style.display = 'block';
    }

    selectMatch(matchId) {
        // 移除之前的选择
        document.querySelectorAll('.match-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 选择当前项
        const selectedItem = document.querySelector(`[data-match-id="${matchId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            this.selectedMatch = this.matchResults.find(match => match.id === matchId);
        }
    }

    startVideoGeneration() {
        const generateSection = document.getElementById('generateSection');
        generateSection.style.display = 'block';
        generateSection.scrollIntoView({ behavior: 'smooth' });
        
        this.simulateVideoGeneration();
    }

    simulateVideoGeneration() {
        const steps = document.querySelectorAll('.step');
        const progressFill = document.querySelector('.generate-progress .progress-fill');
        const progressText = document.querySelector('.generate-progress .progress-text');
        const timeEstimate = document.querySelector('.time-estimate');
        
        let currentStepIndex = 2; // 从第三步开始（前两步已完成）
        let progress = 65;
        
        const interval = setInterval(() => {
            progress += Math.random() * 8;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '% 完成';
            
            // 更新时间估计
            const remainingTime = Math.max(0, Math.round((100 - progress) * 1.5));
            timeEstimate.textContent = `预计还需 ${remainingTime} 秒`;
            
            // 更新步骤状态
            if (progress > 80 && currentStepIndex === 2) {
                steps[2].classList.remove('processing');
                steps[2].classList.add('active');
                steps[3].classList.add('processing');
                currentStepIndex = 3;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                steps[3].classList.remove('processing');
                steps[3].classList.add('active');
                
                setTimeout(() => {
                    this.showVideoResult();
                }, 1000);
            }
        }, 300);
    }

    showVideoResult() {
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        this.showNotification('🎉 视频生成完成！', 'success');
    }

    bindResultActions() {
        // 下载按钮
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('download-btn')) {
                this.downloadVideo();
            }
            
            if (e.target.classList.contains('share-btn')) {
                this.shareVideo();
            }
            
            if (e.target.classList.contains('restart-btn')) {
                this.restartProcess();
            }
        });
    }

    downloadVideo() {
        // 模拟下载
        this.showNotification('开始下载视频...', 'info');
        
        // 创建模拟下载链接
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${this.selectedScenicSpot}_智能拼接视频_${new Date().getTime()}.mp4`;
        
        setTimeout(() => {
            this.showNotification('视频下载完成！', 'success');
        }, 2000);
    }

    shareVideo() {
        // 模拟分享功能
        if (navigator.share) {
            navigator.share({
                title: '我的专属景点视频',
                text: `看看我在${this.selectedScenicSpot}的精彩视频！`,
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('分享链接已复制到剪贴板', 'success');
            });
        }
    }

    restartProcess() {
        // 重置所有状态
        this.currentStep = 'upload';
        this.selectedVideo = null;
        this.selectedScenicSpot = '';
        this.matchResults = [];
        this.selectedMatch = null;
        this.taskId = null;
        
        // 隐藏所有后续步骤
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('scenicSpotSelector').style.display = 'none';
        document.getElementById('matchBtn').style.display = 'none';
        document.getElementById('matchSection').style.display = 'none';
        document.getElementById('generateSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        
        // 重置表单
        document.getElementById('videoInput').value = '';
        document.getElementById('scenicSelect').value = '';
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.showNotification('已重置，可以重新开始制作', 'info');
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#667eea'
        };
        return colors[type] || colors.info;
    }

    // API 模拟方法（实际项目中会调用真实API）
    async uploadVideo(file) {
        // 模拟API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    video_id: 'vid_' + Date.now(),
                    status: 'uploaded'
                });
            }, 2000);
        });
    }

    async matchVideos(videoId, scenicSpot) {
        // 模拟API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    matches: this.matchResults,
                    total: this.matchResults.length
                });
            }, 3000);
        });
    }

    async generateVideo(userVideoId, scenicVideoId) {
        // 模拟API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    task_id: 'task_' + Date.now(),
                    status: 'processing'
                });
            }, 1000);
        });
    }
}

// 初始化应用
const app = new VideoProcessingApp();

// 添加一些额外的交互效果
document.addEventListener('DOMContentLoaded', () => {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加滚动效果
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
});

// 导出给全局使用
window.app = app;