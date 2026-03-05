/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PINKAEGIS 功能模块扩展
 * 包含：笔记、项目、日记、工作日志、能量追踪、个人档案
 * ══════════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════
   【学习笔记模块】NOTES MANAGER
   功能：创建、删除、搜索、标签过滤笔记
   存储：LocalStorage (pinkaegis_notes)
═══════════════════════════════════════════════════════════════ */

class NotesManager {
  constructor() {
    this.notes = [];
    this.defaultTags = ['知识', '想法', '摘录', '灵感'];
    this.load();
    this.renderNotes();
    this.renderTagFilters();
  }

  // 从 LocalStorage 加载
  load() {
    const data = localStorage.getItem('pinkaegis_notes');
    if (data) {
      try {
        this.notes = JSON.parse(data);
      } catch (e) {
        console.error('笔记加载失败:', e);
        this.notes = [];
      }
    }
  }

  // 保存到 LocalStorage
  save() {
    localStorage.setItem('pinkaegis_notes', JSON.stringify(this.notes));
  }

  // 创建新笔记
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

  // 删除笔记
  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.save();
    this.renderNotes();
  }

  // 获取所有唯一的标签
  getAllTags() {
    const tags = new Set(this.defaultTags);
    this.notes.forEach(n => {
      if (n.tags) n.tags.forEach(t => tags.add(t));
    });
    return Array.from(tags);
  }

  // 按标签过滤
  filterByTag(tag) {
    if (!tag) return this.notes;
    return this.notes.filter(n => n.tags && n.tags.includes(tag));
  }

  // 搜索笔记（标题 + 内容）
  search(query) {
    if (!query) return this.notes;
    const q = query.toLowerCase();
    return this.notes.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q)
    );
  }

  // 渲染笔记卡片
  renderNotes(notes = this.notes) {
    const grid = document.getElementById('notesGrid');
    if (!grid) return;

    if (notes.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink3);padding:40px">没有找到相关笔记</div>';
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
            <button onclick="notesManager.deleteNote(${note.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer;font-size:16px">✕</button>
          </div>
          <div style="color:var(--ink2);font-size:13px;line-height:1.5;margin-bottom:8px;max-height:80px;overflow:hidden;text-overflow:ellipsis">
            ${escHtml(note.content).substring(0, 200)}${note.content.length > 200 ? '...' : ''}
          </div>
          ${tagHtml ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">${tagHtml}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // 渲染标签过滤器
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

function renderNoteTagButtons() {
  const container = document.getElementById('noteTags');
  container.innerHTML = ['知识', '想法', '摘录', '灵感'].map(tag =>
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
    showToast('✨ 笔记已保存');
    closeNoteModal();
    notesManager.renderNotes();
    notesManager.renderTagFilters();
  } else {
    showToast('⚠️ 标题和内容不能为空');
  }
}

function filterNotes() {
  if (!notesManager) return;
  const query = document.getElementById('noteSearch').value;
  notesManager.renderNotes(notesManager.search(query));
}

/* ═══════════════════════════════════════════════════════════════
   【项目记录模块】PROJECTS MANAGER
   功能：项目创建、进度追踪、技能标签、状态管理
═══════════════════════════════════════════════════════════════ */

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
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink3);padding:40px">没有找到相关项目</div>';
      return;
    }

    grid.innerHTML = projects.map(proj => {
      const statusIcon = { 'completed': '✓', 'in-progress': '⏳', 'planned': '📋' }[proj.status];
      const statusText = { 'completed': '已完成', 'in-progress': '进行中', 'planned': '计划' }[proj.status];
      const skillsHtml = proj.skills.map(s => 
        `<span style="display:inline-block;background:var(--blue-bg);color:var(--blue);padding:3px 8px;border-radius:4px;font-size:10px;margin-right:4px">${s}</span>`
      ).join('');
      const startStr = new Date(proj.startDate).toLocaleDateString('zh-CN', {month:'2-digit', day:'2-digit'});
      return `
        <div style="background:white;border:1px solid var(--border);border-radius:12px;padding:16px;position:relative">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <div style="font-weight:600;color:var(--ink)">${escHtml(proj.title)}</div>
            <button onclick="projectsManager.deleteProject(${proj.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer">✕</button>
          </div>
          <div style="font-size:11px;color:var(--ink3);margin-bottom:8px">${startStr} · ${statusIcon} ${statusText}</div>
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
    showToast('⚠️ 项目名称和描述不能为空');
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
  showToast('🎉 项目已创建');
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

/* ═══════════════════════════════════════════════════════════════
   【每日杂记模块】JOURNAL MANAGER
   功能：快速记录、心情标签、时间轴显示、搜索过滤
═══════════════════════════════════════════════════════════════ */

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
      mood: mood || '🙂',
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
      timeline.innerHTML = '<div style="text-align:center;color:var(--ink3);padding:40px">还没有日记，先在上面写下此刻的想法吧</div>';
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
              <button onclick="journalManager.deleteEntry(${entry.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer">✕</button>
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
    showToast('✏️ 请先写点什么');
    return;
  }
  if (journalManager && journalManager.createEntry(content, journalManager.currentMood || '🙂')) {
    showToast('📝 日记已保存');
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

/* ═══════════════════════════════════════════════════════════════
   【实习记录模块】WORK LOG MANAGER
   功能：日志记录、时间统计、心情标签、复盘笔记
═══════════════════════════════════════════════════════════════ */

class WorkLogManager {
  constructor() {
    this.logs = [];
    this.startDate = new Date('2026-01-15'); // 实习开始日期（可自定义）
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
      timeline.innerHTML = '<div style="text-align:center;color:var(--ink3);padding:40px">暂无日志</div>';
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
              <div style="font-weight:600;color:var(--ink)">${escHtml(log.title) || '工作日志'}</div>
              <div style="font-size:12px;color:var(--ink3)">1️⃣ ${dateStr} · ${log.mood || '😐'}</div>
            </div>
            <button onclick="workLogManager.deleteLog(${log.id})" style="background:none;border:none;color:var(--ink3);cursor:pointer">✕</button>
          </div>
          ${log.tasks.length > 0 ? `<div style="margin-bottom:8px"><div style="font-size:12px;font-weight:600;color:var(--ink2)">✓ 完成任务</div><ul style="margin:4px 0">${tasksHtml}</ul></div>` : ''}
          ${log.learnings.length > 0 ? `<div style="margin-bottom:8px"><div style="font-size:12px;font-weight:600;color:var(--ink2)">💡 学到的知识</div><ul style="margin:4px 0">${learningsHtml}</ul></div>` : ''}
          <div style="font-size:12px;color:var(--ink2)">⏰ 工作时数：${log.hours}h</div>
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
    showToast('⚠️ 请选择日期');
    return;
  }

  if (workLogManager && workLogManager.createLog(date, title, tasks, learnings, hours, '😐')) {
    showToast('📋 日志已保存');
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

/* ═══════════════════════════════════════════════════════════════
   【能量追踪模块】ENERGY TRACKER
   功能：日常能量记录、睡眠追踪、趋势分析
═══════════════════════════════════════════════════════════════ */

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
    document.getElementById('bestTime').textContent = '下午14:00-16:00';
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
    showToast('⚠️ 请选择能量值');
    return;
  }
  
  if (energyTracker) {
    energyTracker.createRecord(level, sleep, currentFocus);
    showToast('⚡ 能量记录已保存');
    currentEnergy = 0;
    currentFocus = 0;
    energyTracker.updateStats();
    energyTracker.renderChart();
  }
}

/* ═══════════════════════════════════════════════════════════════
   【个人档案模块】PROFILE MANAGER
   功能：个人信息编辑、技能管理、成就展示、档案导出
═══════════════════════════════════════════════════════════════ */

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
        //保持默认值
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
      skillsList.innerHTML = '<div style="font-size:12px;color:var(--ink3)">点击下方添加技能</div>';
    } else {
      skillsList.innerHTML = this.profile.skills.map((skill, i) => 
        `<div style="background:var(--surface2);padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px">
          ${skill}
          <button onclick="profileManager.deleteSkill(${i})" style="background:none;border:none;color:var(--ink3);cursor:pointer">✕</button>
        </div>`
      ).join('');
    }

    document.getElementById('linkGithub').value = this.profile.links.github || '';
    document.getElementById('linkPortfolio').value = this.profile.links.portfolio || '';
    document.getElementById('linkLinkedin').value = this.profile.links.linkedin || '';
    document.getElementById('linkEmail').value = this.profile.links.email || '';

    const achList = document.getElementById('achievementsList');
    if (this.profile.achievements.length === 0) {
      achList.innerHTML = '<div style="font-size:12px;color:var(--ink3)">还没有成就，赶快去创造吧</div>';
    } else {
      achList.innerHTML = this.profile.achievements.map((ach, i) =>
        `<div style="background:var(--warm-bg);color:var(--warm);padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px">
          🏆 ${ach}
          <button onclick="profileManager.deleteAchievement(${i})" style="background:none;border:none;color:var(--warm);cursor:pointer">✕</button>
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
    showToast('💾 信息已保存');
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
    showToast('✨ 技能已添加');
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
    showToast('🏆 成就已添加');
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
  showToast('🔗 链接已保存');
}

function exportProfile() {
  if (!profileManager) return;
  const profile = profileManager.profile;
  const content = `
PINKAEGIS 个人档案
================

👤 ${profile.name || '未命名'} · ${profile.title || '未设置'}
${profile.bio}

🌳 技能树
${profile.skills.map(s => '  ✓ ' + s).join('\n') || '  （暂无技能）'}

🏆 成就
${profile.achievements.map(a => '  🏆 ' + a).join('\n') || '  （暂无成就）'}

🔗 社交
${Object.entries(profile.links).filter(([k, v]) => v).map(([k, v]) => `  • ${k}: ${v}`).join('\n') || '  （暂无链接）'}

导出时间: ${new Date().toLocaleString('zh-CN')}
  `;
  
  const file = new Blob([content], {type: 'text/plain'});
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name || 'profile'}_${new Date().getTime()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📄 档案已导出');
}

/* ═══════════════════════════════════════════════════════════════
   【全局变量声明】GLOBAL VARIABLES
═══════════════════════════════════════════════════════════════ */
let notesManager = null;
let projectsManager = null;
let journalManager = null;
let workLogManager = null;
let energyTracker = null;
let profileManager = null;

/* ═══════════════════════════════════════════════════════════════
   【页面加载初始化】PAGE INITIALIZATION
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  try {
    // 初始化所有管理器
    notesManager = new NotesManager();
    console.log('✅ NotesManager 加载成功');
    
    projectsManager = new ProjectsManager();
    console.log('✅ ProjectsManager 加载成功');
    
    journalManager = new JournalManager();
    console.log('✅ JournalManager 加载成功');
    
    workLogManager = new WorkLogManager();
    console.log('✅ WorkLogManager 加载成功');
    
    energyTracker = new EnergyTracker();
    console.log('✅ EnergyTracker 加载成功');
    
    profileManager = new ProfileManager();
    console.log('✅ ProfileManager 加载成功');

    console.log('✅ 所有功能模块已加载');
  } catch (error) {
    console.error('❌ 模块加载失败:', error);
  }
});
