"""
app.py — FOCUS 生活系统 Flask 后端
====================================
功能：
  1. 渲染前端单页应用 (GET /)
  2. 留言板 RESTful API
       GET  /api/messages   — 返回全部留言（时间倒序）
       POST /api/messages   — 新增留言

数据库：SQLite（本地文件 focus.db，自动创建）
依赖：Flask, flask-cors
安装：pip install flask flask-cors
"""

import sqlite3
import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, g
from flask_cors import CORS

# ──────────────────────────────────────────────
# 初始化 Flask 应用
# ──────────────────────────────────────────────
app = Flask(
    __name__,
    template_folder='templates',   # HTML 模板目录
    static_folder='static'         # 静态资源目录（CSS/JS/图片）
)

# 允许跨域请求（开发阶段放行所有来源；生产环境建议改为指定域名）
# 例如：CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
CORS(app)

# SQLite 数据库文件路径（与 app.py 同目录）
DB_PATH = os.path.join(os.path.dirname(__file__), 'focus.db')


# ──────────────────────────────────────────────
# 数据库工具函数
# ──────────────────────────────────────────────

def get_db():
    """
    获取当前请求上下文中的数据库连接。
    使用 Flask 的 g 对象确保同一请求内复用同一连接。
    """
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row   # 让查询结果支持字典式访问
    return g.db


@app.teardown_appcontext
def close_db(error):
    """每次请求结束后自动关闭数据库连接，防止连接泄漏。"""
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    """
    初始化数据库：创建 messages 表（如果不存在）。
    字段说明：
      id          — 自增主键
      nickname    — 留言者昵称（最长 50 字符）
      content     — 留言内容（最长 500 字符）
      created_at  — 创建时间（ISO 格式字符串，UTC）
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname   TEXT    NOT NULL DEFAULT '匿名',
                content    TEXT    NOT NULL,
                created_at TEXT    NOT NULL
            )
        ''')
        conn.commit()
    print(f"[DB] 数据库已就绪：{DB_PATH}")


# ──────────────────────────────────────────────
# 页面路由
# ──────────────────────────────────────────────

@app.route('/')
def index():
    """渲染主页面（单页应用入口）。"""
    return render_template('index.html')


# ──────────────────────────────────────────────
# RESTful API — 留言板
# ──────────────────────────────────────────────

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """
    GET /api/messages
    返回所有留言，按创建时间倒序排列（最新在前）。

    响应格式：
    {
        "success": true,
        "count": 3,
        "data": [
            {
                "id": 3,
                "nickname": "小明",
                "content": "这个系统真好用！",
                "created_at": "2026-03-04T10:30:00"
            },
            ...
        ]
    }
    """
    db = get_db()
    rows = db.execute(
        'SELECT id, nickname, content, created_at FROM messages ORDER BY id DESC'
    ).fetchall()

    messages = [
        {
            'id':         row['id'],
            'nickname':   row['nickname'],
            'content':    row['content'],
            'created_at': row['created_at'],
        }
        for row in rows
    ]

    return jsonify({
        'success': True,
        'count':   len(messages),
        'data':    messages
    })


@app.route('/api/messages', methods=['POST'])
def post_message():
    """
    POST /api/messages
    接收前端提交的留言，写入数据库。

    请求体（JSON 或 form-data 均支持）：
    {
        "nickname": "小明",     （可选，默认"匿名"）
        "content":  "你好！"    （必填）
    }

    响应格式（成功）：
    {
        "success": true,
        "message": "留言成功",
        "id": 4
    }

    响应格式（失败）：
    {
        "success": false,
        "message": "留言内容不能为空"
    }
    """
    # 同时兼容 JSON 和 form-data 提交方式
    if request.is_json:
        data = request.get_json(silent=True) or {}
    else:
        data = request.form.to_dict()

    # 提取并验证字段
    nickname = str(data.get('nickname', '') or '匿名').strip()[:50]   # 最长50字
    content  = str(data.get('content',  '') or '').strip()[:500]      # 最长500字

    if not content:
        return jsonify({'success': False, 'message': '留言内容不能为空'}), 400

    if not nickname:
        nickname = '匿名'

    # 写入数据库
    created_at = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S')
    db = get_db()
    cursor = db.execute(
        'INSERT INTO messages (nickname, content, created_at) VALUES (?, ?, ?)',
        (nickname, content, created_at)
    )
    db.commit()

    return jsonify({
        'success': True,
        'message': '留言成功',
        'id':      cursor.lastrowid
    }), 201


# ──────────────────────────────────────────────
# 错误处理
# ──────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'message': '接口不存在'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'success': False, 'message': '服务器内部错误'}), 500


# ──────────────────────────────────────────────
# 启动入口
# ──────────────────────────────────────────────

if __name__ == '__main__':
    # 启动前初始化数据库
    init_db()

    # debug=False 适用于生产环境；开发时可改为 True
    # host='0.0.0.0' 允许外部访问（阿里云服务器必须）
    # port=5000 与安全组开放端口对应
    app.run(host='0.0.0.0', port=5000, debug=False)
