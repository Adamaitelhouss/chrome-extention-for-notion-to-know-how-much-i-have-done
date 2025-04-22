(function () {
    let statsContainer = document.getElementById('checkbox-stats-container');
    if (!statsContainer) {
      statsContainer = document.createElement('div');
      statsContainer.id = 'checkbox-stats-container';
      Object.assign(statsContainer.style, {
        position: 'fixed',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 10000,
        width: '320px',
        bottom: '20px',
        right: '20px'
      });
      document.body.appendChild(statsContainer);
    }
  
    const headerIcon = `<svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle; margin-right:8px;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    </svg>`;
    
    const totalIcon = `<svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle; margin-right:8px;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <line x1="8" y1="8" x2="16" y2="8"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
      <line x1="8" y1="16" x2="16" y2="16"></line>
    </svg>`;
    
    const checkedIcon = `<svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle; margin-right:8px;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
    
    const notCheckedIcon = `<svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle; margin-right:8px;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>`;
  
    function createOrGet(id, tag = 'p', style = {}) {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement(tag);
        el.id = id;
        Object.assign(el.style, style);
        statsContainer.appendChild(el);
      }
      return el;
    }
  
    const header = createOrGet('checkbox-stats-header', 'h4', {
      margin: '0 0 12px 0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#37352F',
      userSelect: 'none'
    });
    header.innerHTML = headerIcon + 'To-Do Stats';
  
    const totalPara = createOrGet('checkbox-total', 'p', {
      margin: '4px 0',
      fontSize: '14px',
      color: '#444'
    });
    const checkedPara = createOrGet('checkbox-checked', 'p', {
      margin: '4px 0',
      fontSize: '14px',
      color: '#444'
    });
    const notCheckedPara = createOrGet('checkbox-notchecked', 'p', {
      margin: '4px 0',
      fontSize: '14px',
      color: '#444'
    });
  
    let graphContainer = document.getElementById('checkbox-graph');
    if (!graphContainer) {
      graphContainer = document.createElement('div');
      graphContainer.id = 'checkbox-graph';
      Object.assign(graphContainer.style, {
        width: '100%',
        height: '12px',
        backgroundColor: '#e2e2e2',
        borderRadius: '6px',
        marginTop: '12px',
        display: 'flex',
        overflow: 'hidden'
      });
      statsContainer.appendChild(graphContainer);
    }
  
    let doneBar = document.getElementById('checkbox-done-bar');
    if (!doneBar) {
      doneBar = document.createElement('div');
      doneBar.id = 'checkbox-done-bar';
      doneBar.style.height = '100%';
      doneBar.style.backgroundColor = 'rgb(55,53,47)';
      doneBar.style.transition = 'width 0.3s ease';
      graphContainer.appendChild(doneBar);
    }
    
    let notDoneBar = document.getElementById('checkbox-notdone-bar');
    if (!notDoneBar) {
      notDoneBar = document.createElement('div');
      notDoneBar.id = 'checkbox-notdone-bar';
      notDoneBar.style.height = '100%';
      notDoneBar.style.backgroundColor = 'lightgrey';
      notDoneBar.style.transition = 'width 0.3s ease';
      graphContainer.appendChild(notDoneBar);
    }
  
    function updateStats() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const total = checkboxes.length;
      let checkedCount = 0;
      checkboxes.forEach(cb => {
        if (cb.checked) {
          checkedCount++;
        }
      });
      const notCheckedCount = total - checkedCount;
      const donePercentage = total > 0 ? (checkedCount / total * 100).toFixed(2) : 0;
      const notDonePercentage = total > 0 ? (notCheckedCount / total * 100).toFixed(2) : 0;
  
      totalPara.innerHTML = totalIcon + `Total Checkboxes: ${total}`;
      checkedPara.innerHTML = checkedIcon + `Checked: ${checkedCount} (${donePercentage}%)`;
      notCheckedPara.innerHTML = notCheckedIcon + `Not Checked: ${notCheckedCount} (${notDonePercentage}%)`;
  
      doneBar.style.width = donePercentage + '%';
      doneBar.title = `Done: ${donePercentage}%`;
      notDoneBar.style.width = notDonePercentage + '%';
      notDoneBar.title = `Not Done: ${notDonePercentage}%`;
    }
  
    function attachListeners() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.removeEventListener('change', updateStats);
        cb.addEventListener('change', updateStats);
      });
    }
  
    attachListeners();
    updateStats();
  
    const observer = new MutationObserver(mutations => {
      let needUpdate = false;
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('input[type="checkbox"]')) {
              node.addEventListener('change', updateStats);
              needUpdate = true;
            } else if (node.querySelectorAll) {
              const nested = node.querySelectorAll('input[type="checkbox"]');
              if (nested.length > 0) {
                nested.forEach(cb => cb.addEventListener('change', updateStats));
                needUpdate = true;
              }
            }
          }
        });
      });
      if (needUpdate) {
        attachListeners();
        updateStats();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    setInterval(updateStats, 5000);
  
    function makeDraggable(container, handle) {
      handle.style.cursor = 'grab';
      handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        if (container.style.bottom || container.style.right) {
          const cs = window.getComputedStyle(container);
          const bottom = parseInt(cs.bottom, 10) || 0;
          const right = parseInt(cs.right, 10) || 0;
          container.style.left = (window.innerWidth - right - container.offsetWidth) + 'px';
          container.style.top = (window.innerHeight - bottom - container.offsetHeight) + 'px';
          container.style.bottom = 'auto';
          container.style.right = 'auto';
        }
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        handle.style.cursor = 'grabbing';
        function onMouseMove(e) {
          container.style.left = (e.clientX - offsetX) + 'px';
          container.style.top = (e.clientY - offsetY) + 'px';
        }
        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          handle.style.cursor = 'grab';
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  
    makeDraggable(statsContainer, header);
  })();