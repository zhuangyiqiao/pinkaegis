"""
app.py 鈥?PINKAEGIS 鐢熸椿绯荤粺 Flask 鍚庣
=====================================
椤圭洰鍚嶇О宸蹭慨鏀癸細FOCUS 鈫?PINKAEGIS锛坢atch with domain: pinkaegis锛?

鍔熻兘锛?
  1. 娓叉煋鍓嶇鍗曢〉搴旂敤 (GET /)
  2. 鐣欒█鏉?RESTful API
       GET  /api/messages   鈥?杩斿洖鍏ㄩ儴鐣欒█锛堟椂闂村€掑簭锛?
       POST /api/messages   鈥?鏂板鐣欒█

鏁版嵁搴擄細SQLite锛堟湰鍦版枃浠?pinkaegis.db锛岃嚜鍔ㄥ垱寤猴級
渚濊禆锛欶lask, flask-cors
瀹夎锛歱ip install flask flask-cors
"""

import sqlite3
import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, g
from flask_cors import CORS

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 鍒濆鍖?Flask 搴旂敤
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
app = Flask(
    __name__,
    template_folder='templates',   # HTML 妯℃澘鐩綍
    static_folder='static'         # 闈欐€佽祫婧愮洰褰曪紙CSS/JS/鍥剧墖锛?)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # [Fix] 绂佺敤闈欐€佹枃浠剁紦瀛?
# 鍏佽璺ㄥ煙璇锋眰锛堝紑鍙戦樁娈垫斁琛屾墍鏈夋潵婧愶紱鐢熶骇鐜寤鸿鏀逛负鎸囧畾鍩熷悕锛?
# 渚嬪锛欳ORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
CORS(app)

# SQLite 鏁版嵁搴撴枃浠惰矾寰勶紙涓?app.py 鍚岀洰褰曪級
# 鏁版嵁搴撴枃浠跺凡浠?focus.db 鏀逛负 pinkaegis.db
DB_PATH = os.path.join(os.path.dirname(__file__), 'pinkaegis.db')


def get_asset_version():
    """Return a cache-busting version derived from static file mtimes."""
    static_files = [
        os.path.join(app.root_path, 'static', 'css', 'style.css'),
        os.path.join(app.root_path, 'static', 'js', 'app.js'),
        os.path.join(app.root_path, 'static', 'js', 'modules.js'),
    ]
    mtimes = []
    for path in static_files:
        try:
            mtimes.append(int(os.path.getmtime(path)))
        except OSError:
            continue
    return max(mtimes) if mtimes else int(datetime.now().timestamp())


@app.context_processor
def inject_asset_version():
    """Inject static asset version for template cache busting."""
    return {'asset_version': get_asset_version()}


# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 鏁版嵁搴撳伐鍏峰嚱鏁?
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

def get_db():
    """
    鑾峰彇褰撳墠璇锋眰涓婁笅鏂囦腑鐨勬暟鎹簱杩炴帴銆?
    浣跨敤 Flask 鐨?g 瀵硅薄纭繚鍚屼竴璇锋眰鍐呭鐢ㄥ悓涓€杩炴帴銆?
    """
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row   # 璁╂煡璇㈢粨鏋滄敮鎸佸瓧鍏稿紡璁块棶
    return g.db


@app.teardown_appcontext
def close_db(error):
    """姣忔璇锋眰缁撴潫鍚庤嚜鍔ㄥ叧闂暟鎹簱杩炴帴锛岄槻姝㈣繛鎺ユ硠婕忋€?""
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    """
    鍒濆鍖栨暟鎹簱锛氬垱寤?messages 琛紙濡傛灉涓嶅瓨鍦級銆?
    瀛楁璇存槑锛?
      id          鈥?鑷涓婚敭
      nickname    鈥?鐣欒█鑰呮樀绉帮紙鏈€闀?50 瀛楃锛?
      content     鈥?鐣欒█鍐呭锛堟渶闀?500 瀛楃锛?
      created_at  鈥?鍒涘缓鏃堕棿锛圛SO 鏍煎紡瀛楃涓诧紝UTC锛?
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname   TEXT    NOT NULL DEFAULT '鍖垮悕',
                content    TEXT    NOT NULL,
                created_at TEXT    NOT NULL
            )
        ''')
        conn.commit()
    print(f"[DB] 鏁版嵁搴撳凡灏辩华锛歿DB_PATH}")


# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 椤甸潰璺敱
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

@app.route('/')
def index():
    """娓叉煋涓婚〉闈紙鍗曢〉搴旂敤鍏ュ彛锛夈€?""
    return render_template('index.html')


@app.after_request
def add_no_cache_headers(resp):
    """[Fix] 寮哄埗娴忚鍣ㄥ拰浠ｇ悊姣忔鑾峰彇鏈€鏂伴〉闈?闈欐€佽祫婧愩€?""
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# RESTful API 鈥?鐣欒█鏉?
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """
    GET /api/messages
    杩斿洖鎵€鏈夌暀瑷€锛屾寜鍒涘缓鏃堕棿鍊掑簭鎺掑垪锛堟渶鏂板湪鍓嶏級銆?

    鍝嶅簲鏍煎紡锛?
    {
        "success": true,
        "count": 3,
        "data": [
            {
                "id": 3,
                "nickname": "灏忔槑",
                "content": "杩欎釜绯荤粺鐪熷ソ鐢紒",
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
    鎺ユ敹鍓嶇鎻愪氦鐨勭暀瑷€锛屽啓鍏ユ暟鎹簱銆?

    璇锋眰浣擄紙JSON 鎴?form-data 鍧囨敮鎸侊級锛?
    {
        "nickname": "灏忔槑",     锛堝彲閫夛紝榛樿"鍖垮悕"锛?
        "content":  "浣犲ソ锛?    锛堝繀濉級
    }

    鍝嶅簲鏍煎紡锛堟垚鍔燂級锛?
    {
        "success": true,
        "message": "鐣欒█鎴愬姛",
        "id": 4
    }

    鍝嶅簲鏍煎紡锛堝け璐ワ級锛?
    {
        "success": false,
        "message": "鐣欒█鍐呭涓嶈兘涓虹┖"
    }
    """
    # 鍚屾椂鍏煎 JSON 鍜?form-data 鎻愪氦鏂瑰紡
    if request.is_json:
        data = request.get_json(silent=True) or {}
    else:
        data = request.form.to_dict()

    # 鎻愬彇骞堕獙璇佸瓧娈?
    nickname = str(data.get('nickname', '') or '鍖垮悕').strip()[:50]   # 鏈€闀?0瀛?
    content  = str(data.get('content',  '') or '').strip()[:500]      # 鏈€闀?00瀛?

    if not content:
        return jsonify({'success': False, 'message': '鐣欒█鍐呭涓嶈兘涓虹┖'}), 400

    if not nickname:
        nickname = '鍖垮悕'

    # 鍐欏叆鏁版嵁搴?
    created_at = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S')
    db = get_db()
    cursor = db.execute(
        'INSERT INTO messages (nickname, content, created_at) VALUES (?, ?, ?)',
        (nickname, content, created_at)
    )
    db.commit()

    return jsonify({
        'success': True,
        'message': '鐣欒█鎴愬姛',
        'id':      cursor.lastrowid
    }), 201


# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 閿欒澶勭悊
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'message': '鎺ュ彛涓嶅瓨鍦?}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'success': False, 'message': '鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?}), 500


# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 鍚姩鍏ュ彛
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

if __name__ == '__main__':
    # 鍚姩鍓嶅垵濮嬪寲鏁版嵁搴?
    init_db()

    # debug=False 閫傜敤浜庣敓浜х幆澧冿紱寮€鍙戞椂鍙敼涓?True
    # host='0.0.0.0' 鍏佽澶栭儴璁块棶锛堥樋閲屼簯鏈嶅姟鍣ㄥ繀椤伙級
    # port=5000 涓庡畨鍏ㄧ粍寮€鏀剧鍙ｅ搴?
    app.run(host='0.0.0.0', port=5000, debug=False)


