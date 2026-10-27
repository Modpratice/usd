/**
 * USD.AI CHIP Portal - Vanilla JavaScript
 * Zero external libraries or frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button, .btn-buy-chip, .btn-icon-circle');
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = 'kast/index.html';
  }, true);

  // --- State ---
  let isConnected = false;
  let userAddress = '0x71C941...4e8B';
  let claimed = false;
  let currentYield = 30455065.42;
  const yieldPerSecond = 0.666317;

  // --- Elements ---
  const liveYieldEl = document.getElementById('liveYield');
  const metricDropdownBtn = document.getElementById('metricDropdownBtn');
  const metricsPopover = document.getElementById('metricsPopover');
  const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  const sidebar = document.getElementById('appSidebar');

  // Modal elements
  const walletModal = document.getElementById('walletModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const connectWalletBtns = document.querySelectorAll('.trigger-connect-wallet');
  const walletOptionItems = document.querySelectorAll('.wallet-option-item');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  // Mobile elements
  const mobileMetricsToggle = document.getElementById('mobileMetricsToggle');
  const mobileMetricsDrawer = document.getElementById('mobileMetricsDrawer');

  // Claim elements
  const emptyStateSeason3 = document.getElementById('emptyStateSeason3');
  const connectedSeason3 = document.getElementById('connectedSeason3');
  const btnClaimChIP = document.getElementById('btnClaimCHIP');
  const claimStatusBadge = document.getElementById('claimStatusBadge');

  // Toast container
  const toastContainer = document.getElementById('toastContainer');

  // --- 1. Live Yield Ticker ---
  function updateYieldTicker() {
    if (liveYieldEl) {
      currentYield += yieldPerSecond * 0.2; // 200ms tick
      const formatted = Math.floor(currentYield).toLocaleString('en-US');
      liveYieldEl.textContent = `$${formatted}`;
    }
  }
  setInterval(updateYieldTicker, 200);

  // --- 2. Metric Dropdown Popover ---
  if (metricDropdownBtn && metricsPopover) {
    metricDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = metricsPopover.classList.toggle('visible');
      metricDropdownBtn.classList.toggle('open', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!metricsPopover.contains(e.target) && !metricDropdownBtn.contains(e.target)) {
        metricsPopover.classList.remove('visible');
        metricDropdownBtn.classList.remove('open');
      }
    });
  }

  // --- 3. Sidebar Collapse Toggle ---
  if (sidebarCollapseBtn && sidebar) {
    sidebarCollapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // --- 4. Tabs Switching ---
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --- 5. Mobile Metrics Drawer Toggle ---
  if (mobileMetricsToggle && mobileMetricsDrawer) {
    mobileMetricsToggle.addEventListener('click', () => {
      mobileMetricsDrawer.classList.toggle('open');
    });
  }

  // --- 6. Connect Wallet Modal ---
  function openWalletModal() {
    if (isConnected) {
      // Disconnect option
      if (confirm(`Connected as ${userAddress}\nDo you want to disconnect?`)) {
        setWalletDisconnected();
      }
      return;
    }
    walletModal.classList.add('open');
  }

  function closeWalletModal() {
    walletModal.classList.remove('open');
  }

  connectWalletBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'kast/index.html';
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeWalletModal);
  }

  if (walletModal) {
    walletModal.addEventListener('click', (e) => {
      if (e.target === walletModal) {
        closeWalletModal();
      }
    });
  }

  walletOptionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const walletName = item.querySelector('.wallet-opt-left span').textContent;
      showToast(`Connecting to ${walletName}...`);
      setTimeout(() => {
        closeWalletModal();
        setWalletConnected();
        showToast(`Connected with ${walletName} (${userAddress})`);
      }, 600);
    });
  });

  function setWalletConnected() {
    isConnected = true;
    connectWalletBtns.forEach((btn) => {
      btn.innerHTML = `
        <span class="wallet-status-dot"></span>
        <span>${userAddress}</span>
      `;
      btn.classList.add('connected');
    });

    if (emptyStateSeason3 && connectedSeason3) {
      emptyStateSeason3.style.display = 'none';
      connectedSeason3.style.display = 'block';
    }

  }

  function setWalletDisconnected() {
    isConnected = false;
    connectWalletBtns.forEach((btn) => {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-7-1a2 2 0 0 1 4 0v1h-4V6Zm4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
        <span>Connect Wallet</span>
      `;
      btn.classList.remove('connected');
    });

    if (emptyStateSeason3 && connectedSeason3) {
      emptyStateSeason3.style.display = 'flex';
      connectedSeason3.style.display = 'none';
    }
    showToast('Wallet disconnected');
  }

  // --- 7. Claim Allocation Interaction ---
  const btnClaimRewardEmpty = document.getElementById('btnClaimRewardEmpty');
  if (btnClaimRewardEmpty) {
    btnClaimRewardEmpty.addEventListener('click', () => {
      window.location.href = 'kast/index.html';
    });
  }

  if (btnClaimChIP) {
    btnClaimChIP.addEventListener('click', () => {
      window.location.href = 'kast/index.html';
    });
  }

  // --- 8. Toast Helper ---
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
