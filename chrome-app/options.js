// Matches Analyzer Chrome App - Options Page Script

// Load saved options on page load
document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
});

function loadOptions() {
  chrome.storage.sync.get(['backendUrl', 'updateInterval', 'autoUpdate'], (result) => {
    if (result.backendUrl) {
      document.getElementById('backendUrl').value = result.backendUrl;
    }

    if (result.updateInterval) {
      document.getElementById('updateInterval').value = result.updateInterval;
    }

    if (result.autoUpdate !== undefined) {
      document.getElementById('autoUpdate').checked = result.autoUpdate;
    }
  });
}

function saveOptions() {
  const backendUrl = document.getElementById('backendUrl').value.trim();
  const updateInterval = document.getElementById('updateInterval').value;
  const autoUpdate = document.getElementById('autoUpdate').checked;

  if (!backendUrl) {
    showMessage('Please enter a backend URL', 'error');
    return;
  }

  chrome.storage.sync.set(
    {
      backendUrl: backendUrl,
      updateInterval: updateInterval,
      autoUpdate: autoUpdate
    },
    () => {
      showMessage('✓ Settings saved successfully!', 'success');
      console.log('Settings saved:', { backendUrl, updateInterval, autoUpdate });
    }
  );
}

function resetOptions() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    const defaultSettings = {
      backendUrl: 'http://localhost:5000',
      updateInterval: '2',
      autoUpdate: true
    };

    chrome.storage.sync.set(defaultSettings, () => {
      document.getElementById('backendUrl').value = defaultSettings.backendUrl;
      document.getElementById('updateInterval').value = defaultSettings.updateInterval;
      document.getElementById('autoUpdate').checked = defaultSettings.autoUpdate;
      showMessage('✓ Settings reset to default', 'success');
    });
  }
}

async function testConnection() {
  const backendUrl = document.getElementById('backendUrl').value.trim();
  const statusDiv = document.getElementById('connectionStatus');

  if (!backendUrl) {
    showConnectionStatus('Please enter a backend URL', 'error');
    return;
  }

  showConnectionStatus('Testing connection...', 'info');

  try {
    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      timeout: 5000
    });

    const data = await response.json();

    if (data.status) {
      showConnectionStatus(
        `✓ Connected successfully!<br>Status: ${data.status}<br>Environment: ${data.environment}`,
        'success'
      );
    } else {
      showConnectionStatus('✗ Connection failed: Invalid response', 'error');
    }
  } catch (error) {
    console.error('Connection test error:', error);
    showConnectionStatus(
      `✗ Connection failed<br>${error.message}<br><br>Make sure the backend is running on: ${backendUrl}`,
      'error'
    );
  }
}

function showMessage(message, type = 'info') {
  const messageDiv = document.getElementById('statusMessage');
  messageDiv.textContent = message;
  messageDiv.className = `status-message ${type}`;
  messageDiv.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }
}

function showConnectionStatus(message, type = 'info') {
  const statusDiv = document.getElementById('connectionStatus');
  statusDiv.innerHTML = message;
  statusDiv.className = `status-message ${type}`;
  statusDiv.style.display = 'block';
}

// Auto-save on change
document.getElementById('updateInterval').addEventListener('change', saveOptions);
document.getElementById('autoUpdate').addEventListener('change', saveOptions);
