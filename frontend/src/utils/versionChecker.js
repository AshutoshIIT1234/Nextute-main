// Version checker to force reload when new version is deployed
let currentVersion = null;
let checkInterval = null;

export const startVersionCheck = () => {
  // Check version every 5 minutes
  checkInterval = setInterval(checkVersion, 5 * 60 * 1000);
  
  // Initial check after 1 minute
  setTimeout(checkVersion, 60 * 1000);
};

export const stopVersionCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
};

const checkVersion = async () => {
  try {
    // Fetch version with cache-busting timestamp
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) return;
    
    const data = await response.json();
    
    if (!currentVersion) {
      // First check, just store the version
      currentVersion = data.version;
      return;
    }
    
    if (data.version !== currentVersion) {
      // New version detected!
      console.log('New version available:', data.version);
      showUpdateNotification();
    }
  } catch (error) {
    console.error('Version check failed:', error);
  }
};

const showUpdateNotification = () => {
  // Show a friendly notification to user
  const notification = document.createElement('div');
  notification.id = 'version-update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <strong style="font-size: 16px;">New Update Available!</strong>
      </div>
      <p style="margin: 0 0 16px 0; font-size: 14px; opacity: 0.95;">
        A new version of Nextute is available. Refresh to get the latest features and improvements.
      </p>
      <div style="display: flex; gap: 8px;">
        <button onclick="location.reload(true)" style="
          flex: 1;
          background: white;
          color: #667eea;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          Refresh Now
        </button>
        <button onclick="document.getElementById('version-update-notification').remove()" style="
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        ">
          Later
        </button>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 30 seconds if user doesn't interact
  setTimeout(() => {
    const notif = document.getElementById('version-update-notification');
    if (notif) notif.remove();
  }, 30000);
};

// Export for manual checking
export const forceVersionCheck = checkVersion;
