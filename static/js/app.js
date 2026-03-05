/* ══════════════════════════════════════════════════════
     【页面导航】PAGE NAVIGATION
     SPA（单页应用）路由核心：
     - 隐藏全部 .page，显示目标 .page
     - 同步更新侧边栏 .nav-item 的 active 状态
     - 导航后自动回滚到顶部
  ══════════════════════════════════════════════════════ */
  // [Fix] 记录当前页面，避免重复切换导致动画被反复重置
  let currentPageId = 'dashboard';
  function showPage(pageId, navEl) {
    const target = document.getElementById('page-' + pageId);
    if (!target) return;

    // [Fix] 同页重复触发时直接返回
    if (currentPageId === pageId && target.classList.contains('active')) {
      closeSidebar();
      return;
    }

    // 1. 先隐藏所有页面（移除 active class）并清理残留内联样式
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.opacity = '';
      p.style.visibility = '';
      p.style.animation = '';
    });

    // 2. 找到目标页面并显示
    target.classList.add('active');
    // [Fix] 强制目标页可见，防止停留在透明状态
    target.style.opacity = '1';
    target.style.visibility = 'visible';
    currentPageId = pageId;

    // 3. 更新侧边栏导航高亮
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navEl) {
      // 如果是从侧边栏点击进来，直接激活该导航项
      navEl.classList.add('active');
    } else {
      // 如果是从网格卡片点击进来，通过 onclick 属性匹配对应导航项
      document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + pageId + "'")) {
          n.classList.add('active');
        }
      });
    }

    // 4. 移动端：关闭侧边栏遮罩
    closeSidebar();

    // 5. 平滑滚动回顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ══════════════════════════════════════════════════════
     【移动端侧边栏】SIDEBAR MOBILE TOGGLE
     720px 以下：侧边栏默认收起（transform 滑出屏幕），
     点击汉堡菜单图标后滑入；点击遮罩关闭。
  ══════════════════════════════════════════════════════ */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // [Fix] 防止脚本重复加载导致按钮事件重复绑定
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && !sidebarToggle.dataset.bound) {
    sidebarToggle.dataset.bound = '1';
    // 汉堡菜单按钮点击事件
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      // 同步切换遮罩层显示/隐藏
      overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    });
  }

  // 关闭侧边栏（导航后、遮罩点击后调用）
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  }

  /* ══════════════════════════════════════════════════════
     【日期显示】DATE DISPLAY
     在 Dashboard 顶部展示：日期数字、星期、月份+年份
  ══════════════════════════════════════════════════════ */
  function updateDate() {
    const now = new Date();
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    document.getElementById('dateDay').textContent = now.getDate();               // 日期数字（如 2）
    document.getElementById('dateWeekday').textContent = weekdays[now.getDay()];  // 中文星期
    document.getElementById('dateMonth').textContent = months[now.getMonth()] + ' · ' + now.getFullYear();
  }
  updateDate(); // 页面加载时立即执行

  /* ══════════════════════════════════════════════════════
     【恋爱天数计算】LOVE DAYS COUNTER
     根据「在一起日期」和「初次约会日期」自动计算天数。
     ⚠️ 如需修改日期，只需更新以下两个 Date 字符串：
       - TOGETHER_DATE：在一起纪念日
       - FIRST_DATE：初次约会日期
  ══════════════════════════════════════════════════════ */
  function updateLoveDays() {
    const TOGETHER_DATE = new Date('2026-01-28');  // ← 在一起日期（Y 与 M）
    const FIRST_DATE    = new Date('2026-02-20');  // ← 初次约会日期
    const now = new Date();

    // 计算"在一起"天数
    const daysTogether = Math.floor((now - TOGETHER_DATE) / (1000 * 60 * 60 * 24));
    const elTogether = document.getElementById('daysTogether');
    if (elTogether) elTogether.textContent = daysTogether >= 0 ? daysTogether + ' 天' : '还没到那天';

    // 计算"初次约会"天数
    const daysFirst = Math.floor((now - FIRST_DATE) / (1000 * 60 * 60 * 24));
    const elFirst = document.getElementById('daysFirstDate');
    if (elFirst) elFirst.textContent = daysFirst >= 0 ? daysFirst + ' 天' : '还没到那天';

    // 计算下一个周年纪念日距今天数
    const nextAnniv = new Date(TOGETHER_DATE);
    nextAnniv.setFullYear(now.getFullYear());                     // 先设为今年同月日
    if (nextAnniv <= now) nextAnniv.setFullYear(now.getFullYear() + 1); // 已过则推到明年
    const daysToAnniv = Math.ceil((nextAnniv - now) / (1000 * 60 * 60 * 24));
    const elAnniv = document.getElementById('nextAnniversary');
    if (elAnniv) elAnniv.textContent = '还有 ' + daysToAnniv + ' 天';
  }
  updateLoveDays(); // 页面加载时立即计算

  /* ══════════════════════════════════════════════════════
     【主页迷你番茄钟】DASHBOARD MINI TIMER
     25 分钟倒计时，与专注页大番茄钟共享 pomodoroCount。
     状态变量说明：
       dashSeconds  — 剩余秒数
       dashRunning  — 是否正在运行
       dashInterval — setInterval 句柄（用于 clearInterval）
  ══════════════════════════════════════════════════════ */
  let dashSeconds = 25 * 60;  // 默认 25 分钟
  let dashRunning = false;
  let dashInterval = null;

  // 开始 / 暂停切换
  function toggleDashTimer() {
    const btn = document.getElementById('dashTimerBtn');
    if (dashRunning) {
      // 当前运行中 → 暂停
      clearInterval(dashInterval);
      dashRunning = false;
      btn.textContent = '开始';
    } else {
      // 当前暂停 → 启动
      dashRunning = true;
      btn.textContent = '暂停';
      dashInterval = setInterval(() => {
        if (dashSeconds <= 0) {
          // 倒计时结束：重置状态、提示、更新番茄计数
          clearInterval(dashInterval);
          dashRunning = false;
          btn.textContent = '开始';
          showToast('🍅 一个番茄完成！好好休息一下。');
          pomodoroCount++;
          updatePomodoroStats();
          return;
        }
        dashSeconds--;
        document.getElementById('dashTimer').textContent = formatTime(dashSeconds);
      }, 1000); // 每 1000ms（1秒）触发一次
    }
  }

  // 重置迷你计时器到 25:00
  function resetDashTimer() {
    clearInterval(dashInterval);
    dashRunning = false;
    dashSeconds = 25 * 60;
    document.getElementById('dashTimer').textContent = '25:00';
    document.getElementById('dashTimerBtn').textContent = '开始';
  }

  /* ══════════════════════════════════════════════════════
     【专注页大番茄钟】FOCUS PAGE BIG TIMER
     支持三种模式：专注25min / 短休5min / 长休15min
     完成后自动累计 pomodoroCount 和 totalFocusMin。
  ══════════════════════════════════════════════════════ */
  let bigSeconds = 25 * 60;   // 大计时器剩余秒数
  let bigRunning = false;      // 运行状态
  let bigInterval = null;      // setInterval 句柄

  // 全局番茄统计（主页迷你钟和专注页共享）
  let pomodoroCount = 0;      // 今日完成番茄数
  let totalFocusMin = 0;      // 今日累计专注分钟数

  // 切换专注模式（25min / 5min / 15min）
  function setMode(btn, minutes) {
    // 移除其他按钮的 active 状态
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');   // 激活当前按钮

    resetBigTimer();               // 先重置计时器
    bigSeconds = minutes * 60;     // 设置新时长
    document.getElementById('bigTimer').textContent = formatTime(bigSeconds);
  }

  // 大计时器：开始 / 暂停切换
  function toggleBigTimer() {
    const btn = document.getElementById('bigTimerBtn');
    if (bigRunning) {
      clearInterval(bigInterval);
      bigRunning = false;
      btn.textContent = '开始专注';
    } else {
      bigRunning = true;
      btn.textContent = '暂停';
      bigInterval = setInterval(() => {
        if (bigSeconds <= 0) {
          clearInterval(bigInterval);
          bigRunning = false;
          btn.textContent = '开始专注';
          showToast('🎉 专注完成！给自己一点奖励。');
          pomodoroCount++;
          totalFocusMin += 25;   // 累计专注时间（默认按 25min 计，无论选哪个模式）
          updatePomodoroStats(); // 刷新右侧统计卡
          return;
        }
        bigSeconds--;
        document.getElementById('bigTimer').textContent = formatTime(bigSeconds);
      }, 1000);
    }
  }

  // 重置大计时器（保持当前模式时长不变）
  function resetBigTimer() {
    clearInterval(bigInterval);
    bigRunning = false;
    bigSeconds = 25 * 60;  // 重置回 25 分钟（如需保持当前模式可改造）
    document.getElementById('bigTimer').textContent = '25:00';
    document.getElementById('bigTimerBtn').textContent = '开始专注';
  }

  // 刷新专注页右侧「今日战果」统计数据
  function updatePomodoroStats() {
    const countEl = document.getElementById('pomodoroCount');
    const barEl   = document.getElementById('pomodoroBar');
    const focusEl = document.getElementById('totalFocus');
    if (countEl) countEl.textContent = pomodoroCount;
    // 进度条：每完成1个番茄=10%，最多100%（即10个）
    if (barEl)   barEl.style.width = Math.min(pomodoroCount * 10, 100) + '%';
    if (focusEl) focusEl.textContent = totalFocusMin + ' min';
  }

  /**
   * 将秒数格式化为 MM:SS 字符串
   * @param {number} s - 剩余秒数
   * @returns {string} 如 "25:00"、"04:59"
   */
  function formatTime(s) {
    const m = Math.floor(s / 60);   // 取整分钟数
    const sec = s % 60;             // 剩余秒数
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  }

  /* ══════════════════════════════════════════════════════
     【清单交互】CHECKLIST INTERACTIONS
     支持点击打勾/取消、动态添加条目（回车或按钮）。
  ══════════════════════════════════════════════════════ */

  // 切换单个条目的完成状态（点击行触发）
  function toggleCheck(item) {
    item.classList.toggle('done');  // 添加/移除 done class（触发删除线+绿色样式）
    const mark = item.querySelector('.checkmark');
    mark.textContent = item.classList.contains('done') ? '✓' : '';  // 更新勾号文字
  }

  /**
   * 向指定清单动态添加新条目
   * @param {string} listId   - 目标清单的 DOM id（如 'today-list'）
   * @param {string} inputId  - 输入框的 DOM id（如 'todayInput'）
   */
  function addTask(listId, inputId) {
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (!val) return;  // 空输入不处理

    // 动态创建条目 DOM
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = 'check-item';
    item.onclick = function() { toggleCheck(this); };  // 绑定点击事件
    item.innerHTML = `<div class="checkmark"></div><div class="check-text">${val}</div>`;
    list.appendChild(item);

    input.value = '';  // 清空输入框
    showToast('✅ 已添加到清单');
  }

  // 向专注页任务队列添加新任务
  function addQueueTask() {
    const input = document.getElementById('taskInput');
    const val = input.value.trim();
    if (!val) return;

    const list = document.getElementById('task-queue-list');
    const item = document.createElement('div');
    item.className = 'task-item';
    // 新任务默认优先级为「低」（左侧绿色竖条）
    item.innerHTML = `
      <div class="task-pri pri-low"></div>
      <div class="task-info"><div class="task-name">${val}</div><div class="task-time">新任务</div></div>
      <div class="task-check" onclick="toggleTaskCheck(this)"></div>`;
    list.appendChild(item);
    input.value = '';
    showToast('📋 任务已加入队列');
  }

  // 切换任务队列中单个任务的完成状态
  function toggleTaskCheck(el) {
    el.classList.toggle('done');
    el.textContent = el.classList.contains('done') ? '✓' : '';
    if (el.classList.contains('done')) showToast('🎯 完成一项任务！');
  }

  /* ══════════════════════════════════════════════════════
     【情绪记录】MOOD TRACKER
     五级情绪选择（😴😐🙂😊🤩），点击选中一个。
  ══════════════════════════════════════════════════════ */

  // 选择情绪：清除其他选中，激活当前
  function selectMood(el) {
    document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
  }

  // 保存情绪记录（当前为 UI 反馈，可扩展为 localStorage 存储）
  function saveMood() {
    showToast('🌡 状态已记录，今天也辛苦了 ✦');
  }

  /* ══════════════════════════════════════════════════════
     【留言发送 & 列表加载】MESSAGE SEND & LOAD
     调用后端 API 提交 / 拉取留言，渲染到页面。
     API_BASE：同域留空；跨域时填写服务器地址。
  ══════════════════════════════════════════════════════ */

  const API_BASE = '';  // 同域部署时留空；跨域时改为 'http://your-ip:5000'

  /** 转义 HTML，防止 XSS */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** 提交留言到后端 POST /api/messages */
  async function sendMessage() {
    const nicknameEl = document.getElementById('msg-nickname');
    const contentEl  = document.getElementById('msg-content');
    const nickname = (nicknameEl ? nicknameEl.value.trim() : '') || '匿名';
    const content  = contentEl ? contentEl.value.trim() : '';

    if (!content) { showToast('✏️ 请先写点什么再发送'); return; }

    try {
      const resp = await fetch(API_BASE + '/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, content })
      });
      const result = await resp.json();
      if (result.success) {
        showToast('💬 留言已保存，谢谢你的文字 ✦');
        if (contentEl) contentEl.value = '';
        loadMessages();
      } else {
        showToast('❌ ' + (result.message || '提交失败'));
      }
    } catch (err) {
      console.error('留言提交失败:', err);
      showToast('⚠️ 网络错误，请稍后重试');
    }
  }

  /** 从后端 GET /api/messages 拉取留言，渲染到 #messages-list */
  async function loadMessages() {
    const container = document.getElementById('messages-list');
    if (!container) return;
    try {
      const resp = await fetch(API_BASE + '/api/messages');
      const result = await resp.json();
      if (!result.success || !result.data.length) {
        container.innerHTML = '<div style="color:var(--ink3);font-size:13px;padding:8px 0">还没有留言，来第一个吧 ✦</div>';
        return;
      }
      container.innerHTML = result.data.map(msg => {
        const date = new Date(msg.created_at + 'Z');
        const t = isNaN(date) ? msg.created_at
          : date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        return '<div style="padding:10px 0;border-bottom:1px solid var(--border)">'
          + '<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
          + '<span style="font-size:13px;font-weight:600;color:var(--ink)">' + escHtml(msg.nickname) + '</span>'
          + '<span style="font-size:11px;color:var(--ink3);font-family:monospace">' + t + '</span>'
          + '</div>'
          + '<div style="font-size:13px;color:var(--ink2);line-height:1.6">' + escHtml(msg.content) + '</div>'
          + '</div>';
      }).join('');
    } catch (err) {
      console.error('加载留言失败:', err);
      container.innerHTML = '<div style="color:var(--ink3);font-size:13px">留言加载失败，请刷新重试</div>';
    }
  }

  // 页面加载完成后自动拉取留言
  loadMessages();

  /* ══════════════════════════════════════════════════════
     【轻提示】TOAST NOTIFICATION
     全局操作反馈，右下角弹出，2.8 秒后自动消失。
     使用方法：showToast('任意提示文字');
  ══════════════════════════════════════════════════════ */
  let toastTimeout;  // 用于清除上一个未完成的计时器
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');        // 添加 show class 触发淡入动画
    clearTimeout(toastTimeout);         // 重置计时（连续操作不会叠加）
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);  // 2.8秒后消失
  }

  /* ══════════════════════════════════════════════════════
     【进场动画】ENTRANCE ANIMATION
     页面加载后，模块卡片和置顶卡片依次淡入+上移。
     stagger（错落延迟）通过 animation-delay 实现，
     每张卡片比上一张延迟 60ms，形成波浪感。
  ══════════════════════════════════════════════════════ */

  // 模块网格卡片进场
  document.querySelectorAll('.module-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    // 保留悬停过渡，同时追加进场过渡（带 delay）
    card.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s, box-shadow 0.3s ease, border-color 0.3s ease`;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 60);  // 整体延迟 100ms 后开始，每张再错落 60ms
  });
