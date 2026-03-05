/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愰〉闈㈠鑸€慞AGE NAVIGATION
     SPA锛堝崟椤靛簲鐢級璺敱鏍稿績锛?
     - 闅愯棌鍏ㄩ儴 .page锛屾樉绀虹洰鏍?.page
     - 鍚屾鏇存柊渚ц竟鏍?.nav-item 鐨?active 鐘舵€?
     - 瀵艰埅鍚庤嚜鍔ㄥ洖婊氬埌椤堕儴
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  // [Fix] 璁板綍褰撳墠椤甸潰锛岄伩鍏嶉噸澶嶅垏鎹㈠鑷村姩鐢诲弽澶嶉噸缃埌 opacity=0
  let currentPageId = 'dashboard';
  function showPage(pageId, navEl) {
    const target = document.getElementById('page-' + pageId);
    if (!target) return;

    // [Fix] 鍚屼竴椤甸潰閲嶅瑙﹀彂鏃剁洿鎺ヨ繑鍥烇紝闃叉浜屾瑙﹀彂鍔ㄧ敾
    if (currentPageId === pageId && target.classList.contains('active')) {
      closeSidebar();
      return;
    }

    // 1. 鍏堥殣钘忔墍鏈夐〉闈紙绉婚櫎 active class锛夊苟娓呯悊鍙兘娈嬬暀鐨勫彲瑙佹€ф牱寮?
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.opacity = '';
      p.style.visibility = '';
      p.style.animation = '';
    });

    // 2. 鎵惧埌鐩爣椤甸潰骞舵樉绀?
    target.classList.add('active');

    // [Fix] 鍒囬〉鍚庡己鍒剁洰鏍囬〉鍙锛岄伩鍏嶉〉闈㈠崱鍦ㄩ€忔槑鐘舵€?
    target.style.opacity = '1';
    target.style.visibility = 'visible';
    currentPageId = pageId;

    // 3. 鏇存柊渚ц竟鏍忓鑸珮浜?
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (navEl) {
      // 濡傛灉鏄粠渚ц竟鏍忕偣鍑昏繘鏉ワ紝鐩存帴婵€娲昏瀵艰埅椤?
      navEl.classList.add('active');
    } else {
      // 濡傛灉鏄粠缃戞牸鍗＄墖鐐瑰嚮杩涙潵锛岄€氳繃 onclick 灞炴€у尮閰嶅搴斿鑸」
      document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + pageId + "'")) {
          n.classList.add('active');
        }
      });
    }

    // 4. 绉诲姩绔細鍏抽棴渚ц竟鏍忛伄缃?
    closeSidebar();

    // 5. 骞虫粦婊氬姩鍥為《閮?
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愮Щ鍔ㄧ渚ц竟鏍忋€慡IDEBAR MOBILE TOGGLE
     720px 浠ヤ笅锛氫晶杈规爮榛樿鏀惰捣锛坱ransform 婊戝嚭灞忓箷锛夛紝
     鐐瑰嚮姹夊牎鑿滃崟鍥炬爣鍚庢粦鍏ワ紱鐐瑰嚮閬僵鍏抽棴銆?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // 纭繚鍒濆鍖栨椂閬僵涓洪殣钘忥紝閬垮厤鍦?CSS/缂撳瓨/鏂偣鍐茬獊鏃惰鐩栦富鍐呭
  if (overlay) overlay.style.display = 'none';

  // [Fix] 闃叉鑴氭湰閲嶅鍔犺浇瀵艰嚧渚ф爮鎸夐挳浜嬩欢閲嶅缁戝畾
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && !sidebarToggle.dataset.bound) {
    sidebarToggle.dataset.bound = '1';
    // 姹夊牎鑿滃崟鎸夐挳鐐瑰嚮浜嬩欢
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      // 鍚屾鍒囨崲閬僵灞傛樉绀?闅愯棌
      overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    });
  }

  // 鍏抽棴渚ц竟鏍忥紙瀵艰埅鍚庛€侀伄缃╃偣鍑诲悗璋冪敤锛?
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愭棩鏈熸樉绀恒€慏ATE DISPLAY
     鍦?Dashboard 椤堕儴灞曠ず锛氭棩鏈熸暟瀛椼€佹槦鏈熴€佹湀浠?骞翠唤
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  function updateDate() {
    const now = new Date();
    const weekdays = ['鏄熸湡鏃?,'鏄熸湡涓€','鏄熸湡浜?,'鏄熸湡涓?,'鏄熸湡鍥?,'鏄熸湡浜?,'鏄熸湡鍏?];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    document.getElementById('dateDay').textContent = now.getDate();               // 鏃ユ湡鏁板瓧锛堝 2锛?
    document.getElementById('dateWeekday').textContent = weekdays[now.getDay()];  // 涓枃鏄熸湡
    document.getElementById('dateMonth').textContent = months[now.getMonth()] + ' 路 ' + now.getFullYear();
  }
  updateDate(); // 椤甸潰鍔犺浇鏃剁珛鍗虫墽琛?

  // [Fix] 鍒犻櫎涓存椂璇婃柇涓庡己鍒跺洖璺抽€昏緫锛岄伩鍏嶅垏椤电姸鎬佽瑕嗙洊

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愭亱鐖卞ぉ鏁拌绠椼€慙OVE DAYS COUNTER
     鏍规嵁銆屽湪涓€璧锋棩鏈熴€嶅拰銆屽垵娆＄害浼氭棩鏈熴€嶈嚜鍔ㄨ绠楀ぉ鏁般€?
     鈿狅笍 濡傞渶淇敼鏃ユ湡锛屽彧闇€鏇存柊浠ヤ笅涓や釜 Date 瀛楃涓诧細
       - TOGETHER_DATE锛氬湪涓€璧风邯蹇垫棩
       - FIRST_DATE锛氬垵娆＄害浼氭棩鏈?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  function updateLoveDays() {
    const TOGETHER_DATE = new Date('2026-01-28');  // 鈫?鍦ㄤ竴璧锋棩鏈燂紙Y 涓?M锛?
    const FIRST_DATE    = new Date('2026-02-20');  // 鈫?鍒濇绾︿細鏃ユ湡
    const now = new Date();

    // 璁＄畻"鍦ㄤ竴璧?澶╂暟
    const daysTogether = Math.floor((now - TOGETHER_DATE) / (1000 * 60 * 60 * 24));
    const elTogether = document.getElementById('daysTogether');
    if (elTogether) elTogether.textContent = daysTogether >= 0 ? daysTogether + ' 澶? : '杩樻病鍒伴偅澶?;

    // 璁＄畻"鍒濇绾︿細"澶╂暟
    const daysFirst = Math.floor((now - FIRST_DATE) / (1000 * 60 * 60 * 24));
    const elFirst = document.getElementById('daysFirstDate');
    if (elFirst) elFirst.textContent = daysFirst >= 0 ? daysFirst + ' 澶? : '杩樻病鍒伴偅澶?;

    // 璁＄畻涓嬩竴涓懆骞寸邯蹇垫棩璺濅粖澶╂暟
    const nextAnniv = new Date(TOGETHER_DATE);
    nextAnniv.setFullYear(now.getFullYear());                     // 鍏堣涓轰粖骞村悓鏈堟棩
    if (nextAnniv <= now) nextAnniv.setFullYear(now.getFullYear() + 1); // 宸茶繃鍒欐帹鍒版槑骞?
    const daysToAnniv = Math.ceil((nextAnniv - now) / (1000 * 60 * 60 * 24));
    const elAnniv = document.getElementById('nextAnniversary');
    if (elAnniv) elAnniv.textContent = '杩樻湁 ' + daysToAnniv + ' 澶?;
  }
  updateLoveDays(); // 椤甸潰鍔犺浇鏃剁珛鍗宠绠?

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愪富椤佃糠浣犵暘鑼勯挓銆慏ASHBOARD MINI TIMER
     25 鍒嗛挓鍊掕鏃讹紝涓庝笓娉ㄩ〉澶х暘鑼勯挓鍏变韩 pomodoroCount銆?
     鐘舵€佸彉閲忚鏄庯細
       dashSeconds  鈥?鍓╀綑绉掓暟
       dashRunning  鈥?鏄惁姝ｅ湪杩愯
       dashInterval 鈥?setInterval 鍙ユ焺锛堢敤浜?clearInterval锛?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  let dashSeconds = 25 * 60;  // 榛樿 25 鍒嗛挓
  let dashRunning = false;
  let dashInterval = null;

  // 寮€濮?/ 鏆傚仠鍒囨崲
  function toggleDashTimer() {
    const btn = document.getElementById('dashTimerBtn');
    if (dashRunning) {
      // 褰撳墠杩愯涓?鈫?鏆傚仠
      clearInterval(dashInterval);
      dashRunning = false;
      btn.textContent = '寮€濮?;
    } else {
      // 褰撳墠鏆傚仠 鈫?鍚姩
      dashRunning = true;
      btn.textContent = '鏆傚仠';
      dashInterval = setInterval(() => {
        if (dashSeconds <= 0) {
          // 鍊掕鏃剁粨鏉燂細閲嶇疆鐘舵€併€佹彁绀恒€佹洿鏂扮暘鑼勮鏁?
          clearInterval(dashInterval);
          dashRunning = false;
          btn.textContent = '寮€濮?;
          showToast('馃崊 涓€涓暘鑼勫畬鎴愶紒濂藉ソ浼戞伅涓€涓嬨€?);
          pomodoroCount++;
          updatePomodoroStats();
          return;
        }
        dashSeconds--;
        document.getElementById('dashTimer').textContent = formatTime(dashSeconds);
      }, 1000); // 姣?1000ms锛?绉掞級瑙﹀彂涓€娆?
    }
  }

  // 閲嶇疆杩蜂綘璁℃椂鍣ㄥ埌 25:00
  function resetDashTimer() {
    clearInterval(dashInterval);
    dashRunning = false;
    dashSeconds = 25 * 60;
    document.getElementById('dashTimer').textContent = '25:00';
    document.getElementById('dashTimerBtn').textContent = '寮€濮?;
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愪笓娉ㄩ〉澶х暘鑼勯挓銆慒OCUS PAGE BIG TIMER
     鏀寔涓夌妯″紡锛氫笓娉?5min / 鐭紤5min / 闀夸紤15min
     瀹屾垚鍚庤嚜鍔ㄧ疮璁?pomodoroCount 鍜?totalFocusMin銆?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  let bigSeconds = 25 * 60;   // 澶ц鏃跺櫒鍓╀綑绉掓暟
  let bigRunning = false;      // 杩愯鐘舵€?
  let bigInterval = null;      // setInterval 鍙ユ焺

  // 鍏ㄥ眬鐣寗缁熻锛堜富椤佃糠浣犻挓鍜屼笓娉ㄩ〉鍏变韩锛?
  let pomodoroCount = 0;      // 浠婃棩瀹屾垚鐣寗鏁?
  let totalFocusMin = 0;      // 浠婃棩绱涓撴敞鍒嗛挓鏁?

  // 鍒囨崲涓撴敞妯″紡锛?5min / 5min / 15min锛?
  function setMode(btn, minutes) {
    // 绉婚櫎鍏朵粬鎸夐挳鐨?active 鐘舵€?
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');   // 婵€娲诲綋鍓嶆寜閽?

    resetBigTimer();               // 鍏堥噸缃鏃跺櫒
    bigSeconds = minutes * 60;     // 璁剧疆鏂版椂闀?
    document.getElementById('bigTimer').textContent = formatTime(bigSeconds);
  }

  // 澶ц鏃跺櫒锛氬紑濮?/ 鏆傚仠鍒囨崲
  function toggleBigTimer() {
    const btn = document.getElementById('bigTimerBtn');
    if (bigRunning) {
      clearInterval(bigInterval);
      bigRunning = false;
      btn.textContent = '寮€濮嬩笓娉?;
    } else {
      bigRunning = true;
      btn.textContent = '鏆傚仠';
      bigInterval = setInterval(() => {
        if (bigSeconds <= 0) {
          clearInterval(bigInterval);
          bigRunning = false;
          btn.textContent = '寮€濮嬩笓娉?;
          showToast('馃帀 涓撴敞瀹屾垚锛佺粰鑷繁涓€鐐瑰鍔便€?);
          pomodoroCount++;
          totalFocusMin += 25;   // 绱涓撴敞鏃堕棿锛堥粯璁ゆ寜 25min 璁★紝鏃犺閫夊摢涓ā寮忥級
          updatePomodoroStats(); // 鍒锋柊鍙充晶缁熻鍗?
          return;
        }
        bigSeconds--;
        document.getElementById('bigTimer').textContent = formatTime(bigSeconds);
      }, 1000);
    }
  }

  // 閲嶇疆澶ц鏃跺櫒锛堜繚鎸佸綋鍓嶆ā寮忔椂闀夸笉鍙橈級
  function resetBigTimer() {
    clearInterval(bigInterval);
    bigRunning = false;
    bigSeconds = 25 * 60;  // 閲嶇疆鍥?25 鍒嗛挓锛堝闇€淇濇寔褰撳墠妯″紡鍙敼閫狅級
    document.getElementById('bigTimer').textContent = '25:00';
    document.getElementById('bigTimerBtn').textContent = '寮€濮嬩笓娉?;
  }

  // 鍒锋柊涓撴敞椤靛彸渚с€屼粖鏃ユ垬鏋溿€嶇粺璁℃暟鎹?
  function updatePomodoroStats() {
    const countEl = document.getElementById('pomodoroCount');
    const barEl   = document.getElementById('pomodoroBar');
    const focusEl = document.getElementById('totalFocus');
    if (countEl) countEl.textContent = pomodoroCount;
    // 杩涘害鏉★細姣忓畬鎴?涓暘鑼?10%锛屾渶澶?00%锛堝嵆10涓級
    if (barEl)   barEl.style.width = Math.min(pomodoroCount * 10, 100) + '%';
    if (focusEl) focusEl.textContent = totalFocusMin + ' min';
  }

  /**
   * 灏嗙鏁版牸寮忓寲涓?MM:SS 瀛楃涓?
   * @param {number} s - 鍓╀綑绉掓暟
   * @returns {string} 濡?"25:00"銆?04:59"
   */
  function formatTime(s) {
    const m = Math.floor(s / 60);   // 鍙栨暣鍒嗛挓鏁?
    const sec = s % 60;             // 鍓╀綑绉掓暟
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愭竻鍗曚氦浜掋€慍HECKLIST INTERACTIONS
     鏀寔鐐瑰嚮鎵撳嬀/鍙栨秷銆佸姩鎬佹坊鍔犳潯鐩紙鍥炶溅鎴栨寜閽級銆?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

  // 鍒囨崲鍗曚釜鏉＄洰鐨勫畬鎴愮姸鎬侊紙鐐瑰嚮琛岃Е鍙戯級
  function toggleCheck(item) {
    item.classList.toggle('done');  // 娣诲姞/绉婚櫎 done class锛堣Е鍙戝垹闄ょ嚎+缁胯壊鏍峰紡锛?
    const mark = item.querySelector('.checkmark');
    mark.textContent = item.classList.contains('done') ? '鉁? : '';  // 鏇存柊鍕惧彿鏂囧瓧
  }

  /**
   * 鍚戞寚瀹氭竻鍗曞姩鎬佹坊鍔犳柊鏉＄洰
   * @param {string} listId   - 鐩爣娓呭崟鐨?DOM id锛堝 'today-list'锛?
   * @param {string} inputId  - 杈撳叆妗嗙殑 DOM id锛堝 'todayInput'锛?
   */
  function addTask(listId, inputId) {
    const input = document.getElementById(inputId);
    const val = input.value.trim();
    if (!val) return;  // 绌鸿緭鍏ヤ笉澶勭悊

    // 鍔ㄦ€佸垱寤烘潯鐩?DOM
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = 'check-item';
    item.onclick = function() { toggleCheck(this); };  // 缁戝畾鐐瑰嚮浜嬩欢
    item.innerHTML = `<div class="checkmark"></div><div class="check-text">${val}</div>`;
    list.appendChild(item);

    input.value = '';  // 娓呯┖杈撳叆妗?
    showToast('鉁?宸叉坊鍔犲埌娓呭崟');
  }

  // 鍚戜笓娉ㄩ〉浠诲姟闃熷垪娣诲姞鏂颁换鍔?
  function addQueueTask() {
    const input = document.getElementById('taskInput');
    const val = input.value.trim();
    if (!val) return;

    const list = document.getElementById('task-queue-list');
    const item = document.createElement('div');
    item.className = 'task-item';
    // 鏂颁换鍔￠粯璁や紭鍏堢骇涓恒€屼綆銆嶏紙宸︿晶缁胯壊绔栨潯锛?
    item.innerHTML = `
      <div class="task-pri pri-low"></div>
      <div class="task-info"><div class="task-name">${val}</div><div class="task-time">鏂颁换鍔?/div></div>
      <div class="task-check" onclick="toggleTaskCheck(this)"></div>`;
    list.appendChild(item);
    input.value = '';
    showToast('馃搵 浠诲姟宸插姞鍏ラ槦鍒?);
  }

  // 鍒囨崲浠诲姟闃熷垪涓崟涓换鍔＄殑瀹屾垚鐘舵€?
  function toggleTaskCheck(el) {
    el.classList.toggle('done');
    el.textContent = el.classList.contains('done') ? '鉁? : '';
    if (el.classList.contains('done')) showToast('馃幆 瀹屾垚涓€椤逛换鍔★紒');
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愭儏缁褰曘€慚OOD TRACKER
     浜旂骇鎯呯华閫夋嫨锛堭煒答煒愷煓傪煒婐煠╋級锛岀偣鍑婚€変腑涓€涓€?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

  // 閫夋嫨鎯呯华锛氭竻闄ゅ叾浠栭€変腑锛屾縺娲诲綋鍓?
  function selectMood(el) {
    document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
  }

  // 淇濆瓨鎯呯华璁板綍锛堝綋鍓嶄负 UI 鍙嶉锛屽彲鎵╁睍涓?localStorage 瀛樺偍锛?
  function saveMood() {
    showToast('馃尅 鐘舵€佸凡璁板綍锛屼粖澶╀篃杈涜嫤浜?鉁?);
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愮暀瑷€鍙戦€?& 鍒楄〃鍔犺浇銆慚ESSAGE SEND & LOAD
     璋冪敤鍚庣 API 鎻愪氦 / 鎷夊彇鐣欒█锛屾覆鏌撳埌椤甸潰銆?
     API_BASE锛氬悓鍩熺暀绌猴紱璺ㄥ煙鏃跺～鍐欐湇鍔″櫒鍦板潃銆?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

  const API_BASE = '';  // 鍚屽煙閮ㄧ讲鏃剁暀绌猴紱璺ㄥ煙鏃舵敼涓?'http://your-ip:5000'

  /** 杞箟 HTML锛岄槻姝?XSS */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** 鎻愪氦鐣欒█鍒板悗绔?POST /api/messages */
  async function sendMessage() {
    const nicknameEl = document.getElementById('msg-nickname');
    const contentEl  = document.getElementById('msg-content');
    const nickname = (nicknameEl ? nicknameEl.value.trim() : '') || '鍖垮悕';
    const content  = contentEl ? contentEl.value.trim() : '';

    if (!content) { showToast('鉁忥笍 璇峰厛鍐欑偣浠€涔堝啀鍙戦€?); return; }

    try {
      const resp = await fetch(API_BASE + '/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, content })
      });
      const result = await resp.json();
      if (result.success) {
        showToast('馃挰 鐣欒█宸蹭繚瀛橈紝璋㈣阿浣犵殑鏂囧瓧 鉁?);
        if (contentEl) contentEl.value = '';
        loadMessages();
      } else {
        showToast('鉂?' + (result.message || '鎻愪氦澶辫触'));
      }
    } catch (err) {
      console.error('鐣欒█鎻愪氦澶辫触:', err);
      showToast('鈿狅笍 缃戠粶閿欒锛岃绋嶅悗閲嶈瘯');
    }
  }

  /** 浠庡悗绔?GET /api/messages 鎷夊彇鐣欒█锛屾覆鏌撳埌 #messages-list */
  async function loadMessages() {
    const container = document.getElementById('messages-list');
    if (!container) return;
    try {
      const resp = await fetch(API_BASE + '/api/messages');
      const result = await resp.json();
      if (!result.success || !result.data.length) {
        container.innerHTML = '<div style="color:var(--ink3);font-size:13px;padding:8px 0">杩樻病鏈夌暀瑷€锛屾潵绗竴涓惂 鉁?/div>';
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
      console.error('鍔犺浇鐣欒█澶辫触:', err);
      container.innerHTML = '<div style="color:var(--ink3);font-size:13px">鐣欒█鍔犺浇澶辫触锛岃鍒锋柊閲嶈瘯</div>';
    }
  }

  // 椤甸潰鍔犺浇瀹屾垚鍚庤嚜鍔ㄦ媺鍙栫暀瑷€
  loadMessages();

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愯交鎻愮ず銆慣OAST NOTIFICATION
     鍏ㄥ眬鎿嶄綔鍙嶉锛屽彸涓嬭寮瑰嚭锛?.8 绉掑悗鑷姩娑堝け銆?
     浣跨敤鏂规硶锛歴howToast('浠绘剰鎻愮ず鏂囧瓧');
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */
  let toastTimeout;  // 鐢ㄤ簬娓呴櫎涓婁竴涓湭瀹屾垚鐨勮鏃跺櫒
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');        // 娣诲姞 show class 瑙﹀彂娣″叆鍔ㄧ敾
    clearTimeout(toastTimeout);         // 閲嶇疆璁℃椂锛堣繛缁搷浣滀笉浼氬彔鍔狅級
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);  // 2.8绉掑悗娑堝け
  }

  /* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
     銆愯繘鍦哄姩鐢汇€慐NTRANCE ANIMATION
     椤甸潰鍔犺浇鍚庯紝妯″潡鍗＄墖鍜岀疆椤跺崱鐗囦緷娆℃贰鍏?涓婄Щ銆?
     stagger锛堥敊钀藉欢杩燂級閫氳繃 animation-delay 瀹炵幇锛?
     姣忓紶鍗＄墖姣斾笂涓€寮犲欢杩?60ms锛屽舰鎴愭尝娴劅銆?
  鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

  // 妯″潡缃戞牸鍗＄墖杩涘満
  document.querySelectorAll('.module-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    // 淇濈暀鎮仠杩囨浮锛屽悓鏃惰拷鍔犺繘鍦鸿繃娓★紙甯?delay锛?
    card.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s, box-shadow 0.3s ease, border-color 0.3s ease`;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 60);  // 鏁翠綋寤惰繜 100ms 鍚庡紑濮嬶紝姣忓紶鍐嶉敊钀?60ms
  });


