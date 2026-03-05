/**
 * 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
 * PINKAEGIS 鍔熻兘妯″潡鎵╁睍
 * 鍖呭惈锛氱瑪璁般€侀」鐩€佹棩璁般€佸伐浣滄棩蹇椼€佽兘閲忚拷韪€佷釜浜烘。妗?
 * 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
 */

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愬涔犵瑪璁版ā鍧椼€慛OTES MANAGER
   鍔熻兘锛氬垱寤恒€佸垹闄ゃ€佹悳绱€佹爣绛捐繃婊ょ瑪璁?
   瀛樺偍锛歀ocalStorage (pinkaegis_notes)
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

class NotesManager {
  constructor() {
    this.notes = [];
    this.defaultTags = ['鐭ヨ瘑', '鎯虫硶', '鎽樺綍', '鐏垫劅'];
    this.load();
    this.renderNotes();
    this.renderTagFilters();
  }

  // 浠?LocalStorage 鍔犺浇
  load() {
    const data = localStorage.getItem('pinkaegis_notes');
    if (data) {
      try {
        this.notes = JSON.parse(data);
      } catch (e) {
        console.error('绗旇鍔犺浇澶辫触:', e);
        this.notes = [];
      }
    }
  }

  // 淇濆瓨鍒?LocalStorage
  save() {
    localStorage.setItem('pinkaegis_notes', JSON.stringify(this.notes));
  }

  // 鍒涘缓鏂扮瑪璁?
  createNote(title, content, tags) {
    if (!title.trim() || !content.trim()) return false;
    const note = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.notes.unshift(note);
    this.save();
    return true;
  }

  // 鍒犻櫎绗旇
  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.save();
    this.renderNotes();
  }

  // 鑾峰彇鎵€鏈夊敮涓€鐨勬爣绛?
  getAllTags() {
    const tags = new Set(this.defaultTags);
    this.notes.forEach(n => {
      if (n.tags) n.tags.forEach(t => tags.add(t));
    });
    return Array.from(tags);
  }

  // 鎸夋爣绛捐繃婊?
  filterByTag(tag) {
    if (!tag) return this.notes;
    return this.notes.filter(n => n.tags && n.tags.includes(tag));
  }

  // 鎼滅储绗旇锛堟爣棰?+ 鍐呭锛?
  search(query) {
    if (!query) return this.notes;
    const q = query.toLowerCase();
    return this.notes.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q)
    );
  }

  // 娓叉煋绗旇鍗＄墖
  renderNotes(notes = this.notes) {
    const grid = document.getElementById('notesGrid');
    if (!grid) return;

    if (notes.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink3);padding:40px">娌℃湁鎵惧埌鐩稿叧绗旇</div>';
      return;
    }

    grid.innerHTML = notes.map(note => {
      const date = new Date(note.createdAt).toLocaleDateString('zh-CN');
      const tagHtml = note.tags ? note.tags.map(t => 
        `<span style="display:inline-block;background:var(--purple-bg);color:var(--purple);padding:3px 8px;border-radius:4px;font-size:11px;margin-right:4px">${t}</span>`
      ).join('') : '';
      return `
        <div style="background:white;border:1px solid var(--border);border-radius:12px;padding:16px;position:relative;transition:all 0.3s">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div style="flex:1">
              <div style="font-weight:600;color:var(--ink);margin-bottom:4px;word-break:break-word">${escHtml(note.title)}</div>
              <div style="font-size:11px;color:var(--ink3)">${date}</div>
            </div>
            <button onclick="notesManager.deleteNote(${note.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer;font-size:16px">鉁?/button>
          </div>
          <div style="color:var(--ink2);font-size:13px;line-height:1.5;margin-bottom:8px;max-height:80px;overflow:hidden;text-overflow:ellipsis">
            ${escHtml(note.content).substring(0, 200)}${note.content.length > 200 ? '...' : ''}
          </div>
          ${tagHtml ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">${tagHtml}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // 娓叉煋鏍囩杩囨护鍣?
  renderTagFilters() {
    const container = document.getElementById('tagFilters');
    if (!container) return;
    container.innerHTML = this.getAllTags().map(tag => 
      `<button onclick="notesManager.filterAndRender('${tag}')" style="background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-bg);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px">${tag}</button>`
    ).join('');
  }

  filterAndRender(tag) {
    this.renderNotes(this.filterByTag(tag));
  }
}

function openNoteModal() {
  if (!notesManager) return;
  document.getElementById('noteModal').style.display = 'flex';
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  renderNoteTagButtons();
}

function closeNoteModal() {
  document.getElementById('noteModal').style.display = 'none';
}

function renderNoteTagButtons() {
  const container = document.getElementById('noteTags');
  container.innerHTML = ['鐭ヨ瘑', '鎯虫硶', '鎽樺綍', '鐏垫劅'].map(tag =>
    `<button onclick="toggleNoteTag(this)" data-tag="${tag}" data-selected="0" style="background:var(--surface2);border:1px solid var(--border);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px">${tag}</button>`
  ).join('');
}

function toggleNoteTag(btn) {
  const isSelected = btn.dataset.selected === '1';
  btn.dataset.selected = isSelected ? '0' : '1';
  btn.style.background = isSelected ? 'var(--surface2)' : 'var(--purple-bg)';
  btn.style.color = isSelected ? 'inherit' : 'var(--purple)';
  btn.style.borderColor = isSelected ? 'var(--border)' : 'var(--purple-bg)';
}

function addCustomTag() {
  const input = document.getElementById('customTag');
  const tag = input.value.trim();
  if (tag) {
    const btn = document.createElement('button');
    btn.onclick = () => toggleNoteTag(btn);
    btn.dataset.tag = tag;
    btn.style.cssText = 'background:var(--purple-bg);border:1px solid var(--purple-bg);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:11px;color:var(--purple)';
    btn.textContent = tag;
    document.getElementById('noteTags').appendChild(btn);
    input.value = '';
  }
}

function saveNote() {
  if (!notesManager) return;
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;
  const tags = Array.from(document.querySelectorAll('#noteTags button[data-selected="1"]'))
    .map(btn => btn.dataset.tag);

  if (notesManager.createNote(title, content, tags)) {
    showToast('鉁?绗旇宸蹭繚瀛?);
    closeNoteModal();
    notesManager.renderNotes();
    notesManager.renderTagFilters();
  } else {
    showToast('鈿狅笍 鏍囬鍜屽唴瀹逛笉鑳戒负绌?);
  }
}

function filterNotes() {
  if (!notesManager) return;
  const query = document.getElementById('noteSearch').value;
  notesManager.renderNotes(notesManager.search(query));
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愰」鐩褰曟ā鍧椼€慞ROJECTS MANAGER
   鍔熻兘锛氶」鐩垱寤恒€佽繘搴﹁拷韪€佹妧鑳芥爣绛俱€佺姸鎬佺鐞?
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.load();
    this.renderProjects();
  }

  load() {
    const data = localStorage.getItem('pinkaegis_projects');
    if (data) {
      try {
        this.projects = JSON.parse(data);
      } catch (e) {
        this.projects = [];
      }
    }
  }

  save() {
    localStorage.setItem('pinkaegis_projects', JSON.stringify(this.projects));
  }

  createProject(title, desc, startDate, endDate, progress, status, skills) {
    const project = {
      id: Date.now(),
      title: title.trim(),
      desc: desc.trim(),
      startDate,
      endDate,
      progress: parseInt(progress) || 0,
      status,
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      createdAt: new Date().toISOString()
    };
    this.projects.unshift(project);
    this.save();
    return true;
  }

  deleteProject(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.save();
    this.renderProjects();
  }

  renderProjects(projects = this.projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    if (projects.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink3);padding:40px">娌℃湁鎵惧埌鐩稿叧椤圭洰</div>';
      return;
    }

    grid.innerHTML = projects.map(proj => {
      const statusIcon = { 'completed': '鉁?, 'in-progress': '鈴?, 'planned': '馃搵' }[proj.status];
      const statusText = { 'completed': '宸插畬鎴?, 'in-progress': '杩涜涓?, 'planned': '璁″垝' }[proj.status];
      const skillsHtml = proj.skills.map(s => 
        `<span style="display:inline-block;background:var(--blue-bg);color:var(--blue);padding:3px 8px;border-radius:4px;font-size:10px;margin-right:4px">${s}</span>`
      ).join('');
      const startStr = new Date(proj.startDate).toLocaleDateString('zh-CN', {month:'2-digit', day:'2-digit'});
      return `
        <div style="background:white;border:1px solid var(--border);border-radius:12px;padding:16px;position:relative">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <div style="font-weight:600;color:var(--ink)">${escHtml(proj.title)}</div>
            <button onclick="projectsManager.deleteProject(${proj.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer">鉁?/button>
          </div>
          <div style="font-size:11px;color:var(--ink3);margin-bottom:8px">${startStr} 路 ${statusIcon} ${statusText}</div>
          <div style="color:var(--ink2);font-size:12px;line-height:1.4;margin-bottom:8px">${escHtml(proj.desc).substring(0, 80)}${proj.desc.length > 80 ? '...' : ''}</div>
          <div style="background:var(--surface2);height:6px;border-radius:3px;overflow:hidden;margin-bottom:8px">
            <div style="background:var(--accent);height:100%;width:${proj.progress}%;transition:width 0.3s"></div>
          </div>
          <div style="font-size:10px;color:var(--ink3);margin-bottom:8px">${proj.progress}%</div>
          ${skillsHtml ? `<div style="margin-top:6px">${skillsHtml}</div>` : ''}
        </div>
      `;
    }).join('');
  }
}

function openProjectModal() {
  document.getElementById('projectModal').style.display = 'flex';
  document.getElementById('projTitle').value = '';
  document.getElementById('projDesc').value = '';
  document.getElementById('projStart').value = new Date().toISOString().split('T')[0];
  document.getElementById('projEnd').value = '';
  document.getElementById('projProgress').value = 0;
  document.getElementById('projProgressVal').textContent = '0%';
}

function closeProjectModal() {
  document.getElementById('projectModal').style.display = 'none';
}

function saveProject() {
  if (!projectsManager) return;
  const title = document.getElementById('projTitle').value;
  const desc = document.getElementById('projDesc').value;
  if (!title || !desc) {
    showToast('鈿狅笍 椤圭洰鍚嶇О鍜屾弿杩颁笉鑳戒负绌?);
    return;
  }
  projectsManager.createProject(
    title, desc,
    document.getElementById('projStart').value,
    document.getElementById('projEnd').value,
    document.getElementById('projProgress').value,
    'planned',
    ''
  );
  showToast('馃帀 椤圭洰宸插垱寤?);
  closeProjectModal();
  projectsManager.renderProjects();
}

function filterProjects() {
  const query = document.getElementById('projectSearch').value.toLowerCase();
  const status = document.getElementById('projectFilter').value;
  const filtered = projectsManager.projects.filter(p => {
    const matchQuery = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    const matchStatus = !status || p.status === status;
    return matchQuery && matchStatus;
  });
  projectsManager.renderProjects(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  const projProgress = document.getElementById('projProgress');
  if (projProgress) {
    projProgress.addEventListener('input', (e) => {
      document.getElementById('projProgressVal').textContent = e.target.value + '%';
    });
  }
});

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愭瘡鏃ユ潅璁版ā鍧椼€慗OURNAL MANAGER
   鍔熻兘锛氬揩閫熻褰曘€佸績鎯呮爣绛俱€佹椂闂磋酱鏄剧ず銆佹悳绱㈣繃婊?
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

class JournalManager {
  constructor() {
    this.entries = [];
    this.currentMood = null;
    this.load();
    this.renderTimeline();
  }

  load() {
    const data = localStorage.getItem('pinkaegis_journal');
    if (data) {
      try {
        this.entries = JSON.parse(data);
      } catch (e) {
        this.entries = [];
      }
    }
  }

  save() {
    localStorage.setItem('pinkaegis_journal', JSON.stringify(this.entries));
  }

  createEntry(content, mood) {
    const entry = {
      id: Date.now(),
      content: content.trim(),
      mood: mood || '馃檪',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    this.entries.unshift(entry);
    this.save();
    return true;
  }

  deleteEntry(id) {
    this.entries = this.entries.filter(e => e.id !== id);
    this.save();
    this.renderTimeline();
  }

  setMood(mood) {
    this.currentMood = mood;
  }

  renderTimeline(entries = this.entries) {
    const timeline = document.getElementById('journalTimeline');
    if (!timeline) return;

    if (entries.length === 0) {
      timeline.innerHTML = '<div style="text-align:center;color:var(--ink3);padding:40px">杩樻病鏈夋棩璁帮紝鍏堝湪涓婇潰鍐欎笅姝ゅ埢鐨勬兂娉曞惂</div>';
      return;
    }

    timeline.innerHTML = entries.map(entry => {
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('zh-CN', {year:'numeric', month:'2-digit', day:'2-digit'});
      const timeStr = date.toLocaleTimeString('zh-CN', {hour:'2-digit', minute:'2-digit'});
      return `
        <div style="display:flex;gap:16px;margin-bottom:20px;position:relative">
          <div style="flex-shrink:0;width:40px;text-align:center">
            <div style="width:40px;height:40px;background:var(--surface2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px">${entry.mood}</div>
            <div style="font-size:10px;color:var(--ink3);margin-top:4px">${dateStr}</div>
          </div>
          <div style="flex:1;background:white;border:1px solid var(--border);border-radius:12px;padding:16px;position:relative">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div style="font-size:11px;color:var(--ink3);font-family:monospace">${timeStr}</div>
              <button onclick="journalManager.deleteEntry(${entry.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer">鉁?/button>
            </div>
            <div style="color:var(--ink2);font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word">${escHtml(entry.content)}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function selectJournalMood(btn, mood) {
  if (btn && btn.parentElement) {
    Array.from(btn.parentElement.querySelectorAll('button')).forEach(b => b.style.opacity = '0.5');
    btn.style.opacity = '1';
  }
  if (journalManager) {
    journalManager.currentMood = mood;
  }
}

function saveQuickJournal() {
  const input = document.getElementById('journalQuickInput');
  const content = input ? input.value : '';
  if (!content.trim()) {
    showToast('鉁忥笍 璇峰厛鍐欑偣浠€涔?);
    return;
  }
  if (journalManager && journalManager.createEntry(content, journalManager.currentMood || '馃檪')) {
    showToast('馃摑 鏃ヨ宸蹭繚瀛?);
    if (input) input.value = '';
    journalManager.currentMood = null;
    journalManager.renderTimeline();
  }
}

function filterJournals() {
  if (!journalManager) return;
  const query = document.getElementById('journalSearch').value.toLowerCase();
  const dateFilter = document.getElementById('journalDateFilter').value;
  const filtered = journalManager.entries.filter(e => {
    const matchQuery = e.content.toLowerCase().includes(query);
    const matchDate = !dateFilter || e.date.startsWith(dateFilter);
    return matchQuery && matchDate;
  });
  journalManager.renderTimeline(filtered);
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愬疄涔犺褰曟ā鍧椼€慦ORK LOG MANAGER
   鍔熻兘锛氭棩蹇楄褰曘€佹椂闂寸粺璁°€佸績鎯呮爣绛俱€佸鐩樼瑪璁?
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

class WorkLogManager {
  constructor() {
    this.logs = [];
    this.startDate = new Date('2026-01-15'); // 瀹炰範寮€濮嬫棩鏈燂紙鍙嚜瀹氫箟锛?
    this.load();
    this.updateStats();
    this.renderTimeline();
  }

  load() {
    const data = localStorage.getItem('pinkaegis_worklogs');
    if (data) {
      try {
        this.logs = JSON.parse(data);
      } catch (e) {
        this.logs = [];
      }
    }
  }

  save() {
    localStorage.setItem('pinkaegis_worklogs', JSON.stringify(this.logs));
  }

  createLog(date, title, tasks, learnings, hours, mood) {
    const log = {
      id: Date.now(),
      date,
      title: title.trim(),
      tasks: tasks.split('\n').filter(t => t.trim()),
      learnings: learnings.split('\n').filter(l => l.trim()),
      hours: parseInt(hours) || 0,
      mood,
      createdAt: new Date().toISOString()
    };
    this.logs.push(log);
    this.save();
    return true;
  }

  updateStats() {
    const now = new Date();
    const workDays = Math.floor((now - this.startDate) / (1000 * 60 * 60 * 24));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthLogs = this.logs.filter(l => new Date(l.date) >= thisMonth);
    const totalHours = monthLogs.reduce((sum, l) => sum + l.hours, 0);

    const el1 = document.getElementById('workDays');
    const el2 = document.getElementById('monthHours');
    const el3 = document.getElementById('monthLogs');
    if (el1) el1.textContent = workDays;
    if (el2) el2.textContent = totalHours;
    if (el3) el3.textContent = monthLogs.length;
  }

  renderTimeline(logs = this.logs) {
    const timeline = document.getElementById('workTimeline');
    if (!timeline) return;

    if (logs.length === 0) {
      timeline.innerHTML = '<div style="text-align:center;color:var(--ink3);padding:40px">鏆傛棤鏃ュ織</div>';
      return;
    }

    timeline.innerHTML = logs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => {
      const dateStr = new Date(log.date).toLocaleDateString('zh-CN');
      const tasksHtml = log.tasks.map(t => `<li style="margin-left:16px">${escHtml(t)}</li>`).join('');
      const learningsHtml = log.learnings.map(l => `<li style="margin-left:16px">${escHtml(l)}</li>`).join('');
      return `
        <div style="background:white;border-left:3px solid var(--accent);border-radius:8px;padding:16px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <div>
              <div style="font-weight:600;color:var(--ink)">${escHtml(log.title) || '宸ヤ綔鏃ュ織'}</div>
              <div style="font-size:12px;color:var(--ink3)">1锔忊儯 ${dateStr} 路 ${log.mood || '馃槓'}</div>
            </div>
            <button onclick="workLogManager.deleteLog(${log.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer">鉁?/button>
          </div>
          ${log.tasks.length > 0 ? `<div style="margin-bottom:8px"><div style="font-size:12px;font-weight:600;color:var(--ink2)">鉁?瀹屾垚浠诲姟</div><ul style="margin:4px 0">${tasksHtml}</ul></div>` : ''}
          ${log.learnings.length > 0 ? `<div style="margin-bottom:8px"><div style="font-size:12px;font-weight:600;color:var(--ink2)">馃挕 瀛﹀埌鐨勭煡璇?/div><ul style="margin:4px 0">${learningsHtml}</ul></div>` : ''}
          <div style="font-size:12px;color:var(--ink2)">鈴?宸ヤ綔鏃舵暟锛?{log.hours}h</div>
        </div>
      `;
    }).join('');
  }

  deleteLog(id) {
    this.logs = this.logs.filter(l => l.id !== id);
    this.save();
    this.updateStats();
    this.renderTimeline();
  }
}

function openWorkLogModal() {
  document.getElementById('workLogModal').style.display = 'flex';
  document.getElementById('workDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('workTitle').value = '';
  document.getElementById('workTasks').value = '';
  document.getElementById('workLearnings').value = '';
  document.getElementById('workHours').value = '';
}

function closeWorkLogModal() {
  document.getElementById('workLogModal').style.display = 'none';
}

function selectWorkMood(btn, mood) {
  document.querySelectorAll('.mood-emoji').forEach(b => b.style.opacity = '0.5');
  btn.style.opacity = '1';
  btn.dataset.mood = mood;
}

function saveWorkLog() {
  const date = document.getElementById('workDate').value;
  const title = document.getElementById('workTitle').value;
  const tasks = document.getElementById('workTasks').value;
  const learnings = document.getElementById('workLearnings').value;
  const hours = document.getElementById('workHours').value;

  if (!date) {
    showToast('鈿狅笍 璇烽€夋嫨鏃ユ湡');
    return;
  }

  if (workLogManager && workLogManager.createLog(date, title, tasks, learnings, hours, '馃槓')) {
    showToast('馃搵 鏃ュ織宸蹭繚瀛?);
    closeWorkLogModal();
    workLogManager.updateStats();
    workLogManager.renderTimeline();
  }
}

function filterWorkLogs() {
  if (!workLogManager) return;
  const query = document.getElementById('workSearch').value.toLowerCase();
  const filtered = workLogManager.logs.filter(l =>
    l.title.toLowerCase().includes(query) ||
    l.tasks.some(t => t.toLowerCase().includes(query)) ||
    l.learnings.some(le => le.toLowerCase().includes(query))
  );
  workLogManager.renderTimeline(filtered);
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愯兘閲忚拷韪ā鍧椼€慐NERGY TRACKER
   鍔熻兘锛氭棩甯歌兘閲忚褰曘€佺潯鐪犺拷韪€佽秼鍔垮垎鏋?
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

class EnergyTracker {
  constructor() {
    this.records = [];
    this.load();
    this.updateStats();
    this.renderChart();
  }

  load() {
    const data = localStorage.getItem('pinkaegis_energy');
    if (data) {
      try {
        this.records = JSON.parse(data);
      } catch (e) {
        this.records = [];
      }
    }
  }

  save() {
    localStorage.setItem('pinkaegis_energy', JSON.stringify(this.records));
  }

  createRecord(energy, sleep, focus) {
    const record = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      energy,
      sleep,
      focus,
      timestamp: new Date().toISOString()
    };
    this.records.push(record);
    this.save();
    return true;
  }

  getLast7Days() {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = this.records.find(r => r.date === dateStr);
      result.push({date: dateStr, ...record});
    }
    return result;
  }

  updateStats() {
    const last7 = this.getLast7Days().filter(r => r.id);
    const avgSleep = last7.length ? (last7.reduce((s, r) => s + (r.sleep || 0), 0) / last7.length).toFixed(1) : '--';
    const avgEnergy = last7.length ? (last7.reduce((s, r) => s + (r.energy || 0), 0) / last7.length).toFixed(0) : '--';

    document.getElementById('avgSleep').textContent = avgSleep;
    document.getElementById('avgEnergy').textContent = avgEnergy;
    document.getElementById('bestTime').textContent = '涓嬪崍14:00-16:00';
    document.getElementById('worstDay').textContent = last7.length > 0 ? last7.sort((a, b) => a.energy - b.energy)[0].date : '--';
  }

  renderChart() {
    const chart = document.getElementById('energyChart');
    if (!chart) return;

    const last7 = this.getLast7Days();
    chart.innerHTML = last7.map((r, i) => {
      const height = r.id ? (r.energy || 0) * 25 : 0;
      const date = r.date.split('-')[2];
      return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">
          <div style="width:30px;height:${height || 5}px;background:${r.id ? 'var(--accent)' : 'var(--border)'};border-radius:3px;transition:height 0.3s"></div>
          <div style="font-size:10px;color:var(--ink3)">${date}</div>
        </div>
      `;
    }).join('');
  }
}

let currentEnergy = 0;
let currentFocus = 0;

function setEnergy(btn, val) {
  if (btn && btn.parentElement) {
    Array.from(btn.parentElement.querySelectorAll('button')).forEach(b => b.style.opacity = '0.5');
    btn.style.opacity = '1';
  }
  currentEnergy = val;
}

function setFocus(btn, val) {
  if (btn && btn.parentElement) {
    Array.from(btn.parentElement.querySelectorAll('button')).forEach(b => b.style.opacity = '0.5');
    btn.style.opacity = '1';
  }
  currentFocus = val;
}

function saveEnergyRecord() {
  const levelEl = document.getElementById('energyLevel');
  const sleepEl = document.getElementById('energySleep');
  const level = levelEl ? parseInt(levelEl.value) : currentEnergy;
  const sleep = sleepEl ? parseFloat(sleepEl.value) : 0;
  
  if (level === 0 || currentEnergy === 0) {
    showToast('鈿狅笍 璇烽€夋嫨鑳介噺鍊?);
    return;
  }
  
  if (energyTracker) {
    energyTracker.createRecord(level, sleep, currentFocus);
    showToast('鈿?鑳介噺璁板綍宸蹭繚瀛?);
    currentEnergy = 0;
    currentFocus = 0;
    energyTracker.updateStats();
    energyTracker.renderChart();
  }
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愪釜浜烘。妗堟ā鍧椼€慞ROFILE MANAGER
   鍔熻兘锛氫釜浜轰俊鎭紪杈戙€佹妧鑳界鐞嗐€佹垚灏卞睍绀恒€佹。妗堝鍑?
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

class ProfileManager {
  constructor() {
    this.profile = {
      name: '',
      title: '',
      bio: '',
      skills: [],
      achievements: [],
      links: {}
    };
    this.load();
  }

  load() {
    const data = localStorage.getItem('pinkaegis_profile');
    if (data) {
      try {
        this.profile = JSON.parse(data);
      } catch (e) {
        //淇濇寔榛樿鍊?
      }
    }
    this.render();
  }

  save() {
    localStorage.setItem('pinkaegis_profile', JSON.stringify(this.profile));
  }

  render() {
    document.getElementById('profileName').value = this.profile.name || '';
    document.getElementById('profileTitle').value = this.profile.title || '';
    document.getElementById('profileBio').value = this.profile.bio || '';

    const skillsList = document.getElementById('skillsList');
    if (this.profile.skills.length === 0) {
      skillsList.innerHTML = '<div style="font-size:12px;color:var(--ink3)">鐐瑰嚮涓嬫柟娣诲姞鎶€鑳?/div>';
    } else {
      skillsList.innerHTML = this.profile.skills.map((skill, i) => 
        `<div style="background:var(--surface2);padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px">
          ${skill}
          <button onclick="profileManager.deleteSkill(${i})" style="background:none;border:none;color:var(--ink3);cursor:pointer">鉁?/button>
        </div>`
      ).join('');
    }

    document.getElementById('linkGithub').value = this.profile.links.github || '';
    document.getElementById('linkPortfolio').value = this.profile.links.portfolio || '';
    document.getElementById('linkLinkedin').value = this.profile.links.linkedin || '';
    document.getElementById('linkEmail').value = this.profile.links.email || '';

    const achList = document.getElementById('achievementsList');
    if (this.profile.achievements.length === 0) {
      achList.innerHTML = '<div style="font-size:12px;color:var(--ink3)">杩樻病鏈夋垚灏憋紝璧跺揩鍘诲垱閫犲惂</div>';
    } else {
      achList.innerHTML = this.profile.achievements.map((ach, i) =>
        `<div style="background:var(--warm-bg);color:var(--warm);padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px">
          馃弳 ${ach}
          <button onclick="profileManager.deleteAchievement(${i})" style="background:none;border:none;color:var(--warm);cursor:pointer">鉁?/button>
        </div>`
      ).join('');
    }
  }

  deleteSkill(i) {
    this.profile.skills.splice(i, 1);
    this.save();
    this.render();
  }

  deleteAchievement(i) {
    this.profile.achievements.splice(i, 1);
    this.save();
    this.render();
  }
}

function saveProfileBasic() {
  if (profileManager) {
    profileManager.profile.name = document.getElementById('profileName').value;
    profileManager.profile.title = document.getElementById('profileTitle').value;
    profileManager.profile.bio = document.getElementById('profileBio').value;
    profileManager.save();
    showToast('馃捑 淇℃伅宸蹭繚瀛?);
  }
}

function addSkill() {
  if (!profileManager) return;
  const input = document.getElementById('skillInput');
  const skill = input.value.trim();
  if (skill && !profileManager.profile.skills.includes(skill)) {
    profileManager.profile.skills.push(skill);
    profileManager.save();
    input.value = '';
    profileManager.render();
    showToast('鉁?鎶€鑳藉凡娣诲姞');
  }
}

function addAchievement() {
  if (!profileManager) return;
  const input = document.getElementById('achievementInput');
  const ach = input.value.trim();
  if (ach) {
    profileManager.profile.achievements.push(ach);
    profileManager.save();
    input.value = '';
    profileManager.render();
    showToast('馃弳 鎴愬氨宸叉坊鍔?);
  }
}

function saveProfileLinks() {
  if (!profileManager) return;
  profileManager.profile.links = {
    github: document.getElementById('linkGithub').value,
    portfolio: document.getElementById('linkPortfolio').value,
    linkedin: document.getElementById('linkLinkedin').value,
    email: document.getElementById('linkEmail').value
  };
  profileManager.save();
  showToast('馃敆 閾炬帴宸蹭繚瀛?);
}

function exportProfile() {
  if (!profileManager) return;
  const profile = profileManager.profile;
  const content = `
PINKAEGIS 涓汉妗ｆ
================

馃懁 ${profile.name || '鏈懡鍚?} 路 ${profile.title || '鏈缃?}
${profile.bio}

馃尦 鎶€鑳芥爲
${profile.skills.map(s => '  鉁?' + s).join('\n') || '  锛堟殏鏃犳妧鑳斤級'}

馃弳 鎴愬氨
${profile.achievements.map(a => '  馃弳 ' + a).join('\n') || '  锛堟殏鏃犳垚灏憋級'}

馃敆 绀句氦
${Object.entries(profile.links).filter(([k, v]) => v).map(([k, v]) => `  鈥?${k}: ${v}`).join('\n') || '  锛堟殏鏃犻摼鎺ワ級'}

瀵煎嚭鏃堕棿: ${new Date().toLocaleString('zh-CN')}
  `;
  
  const file = new Blob([content], {type: 'text/plain'});
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name || 'profile'}_${new Date().getTime()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('馃搫 妗ｆ宸插鍑?);
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愬叏灞€鍙橀噺澹版槑銆慓LOBAL VARIABLES
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/
let notesManager = null;
let projectsManager = null;
let journalManager = null;
let workLogManager = null;
let energyTracker = null;
let profileManager = null;

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?
   銆愰〉闈㈠姞杞藉垵濮嬪寲銆慞AGE INITIALIZATION
鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?*/

document.addEventListener('DOMContentLoaded', () => {
  try {
    // 鍒濆鍖栨墍鏈夌鐞嗗櫒
    notesManager = new NotesManager();
    console.log('鉁?NotesManager 鍔犺浇鎴愬姛');
    
    projectsManager = new ProjectsManager();
    console.log('鉁?ProjectsManager 鍔犺浇鎴愬姛');
    
    journalManager = new JournalManager();
    console.log('鉁?JournalManager 鍔犺浇鎴愬姛');
    
    workLogManager = new WorkLogManager();
    console.log('鉁?WorkLogManager 鍔犺浇鎴愬姛');
    
    energyTracker = new EnergyTracker();
    console.log('鉁?EnergyTracker 鍔犺浇鎴愬姛');
    
    profileManager = new ProfileManager();
    console.log('鉁?ProfileManager 鍔犺浇鎴愬姛');

    console.log('鉁?鎵€鏈夊姛鑳芥ā鍧楀凡鍔犺浇');
  } catch (error) {
    console.error('鉂?妯″潡鍔犺浇澶辫触:', error);
  }
});

// [Fix] 鍒犻櫎涓存椂椤甸潰娓叉煋璋冭瘯杈撳嚭锛岄伩鍏嶆帶鍒跺彴鍣煶涓庤鍒?

