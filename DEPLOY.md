# PINKAEGIS 生活系统 — 阿里云部署完整指南

> **项目重命名说明**：此项目原名为 FOCUS，现已更新为 PINKAEGIS（匹配域名）

---

## 一、项目文件结构

```
pinkaegis/
├── app.py                  # Flask 后端主程序
├── requirements.txt        # Python 依赖清单
├── pinkaegis.db            # SQLite 数据库（首次运行自动创建）
├── nginx_pinkaegis.conf    # Nginx 反向代理配置（可选）
├── pinkaegis.service       # systemd 服务配置（开机自启）
├── logs/                   # 日志目录（需手动创建）
│   ├── access.log
│   └── error.log
├── templates/
│   └── index.html          # Flask Jinja2 HTML 模板
└── static/
    ├── css/
    │   └── style.css       # 全站样式
    └── js/
        └── app.js          # 前端交互逻辑
```

---

## 二、本地开发运行

```bash
# 1. 进入项目目录
cd pinkaegis-app

# 2. 创建虚拟环境（推荐，避免污染系统Python）
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 启动开发服务器
python app.py

# 5. 浏览器访问
# http://localhost:5000
```

---

## 三、阿里云服务器部署

### 3.1 前提条件

- 已购买阿里云 ECS 实例（Ubuntu 20.04 / 22.04）
- 已通过 SSH 连接到服务器
- 服务器已绑定弹性公网 IP

---

### 3.2 服务器初始化（首次配置）

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装 Python 3、pip、venv、Nginx
sudo apt install -y python3 python3-pip python3-venv nginx git

# 验证版本
python3 --version    # 应显示 3.8+
nginx -v
```

---

### 3.3 上传代码到服务器

**方式 A：使用 SCP 上传（从本地执行）**

```bash
# 将整个 pinkaegis-app 目录上传到服务器的 /home/ubuntu/
scp -r ./pinkaegis-app ubuntu@<你的服务器IP>:/home/ubuntu/
```

**方式 B：使用 Git（推荐，便于后续更新）**

```bash
# 在服务器上执行
cd /home/ubuntu
git clone https://github.com/你的用户名/pinkaegis-app.git
```

---

### 3.4 服务器端环境配置

```bash
# 进入项目目录
cd /home/ubuntu/pinkaegis-app

# 创建 Python 虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖（包含 gunicorn 生产服务器）
pip install -r requirements.txt

# 创建日志目录
mkdir -p logs

# 初始化数据库（会自动创建 pinkaegis.db 和 messages 表）
python app.py &
# 看到 "[DB] 数据库已就绪" 后按 Ctrl+C 停止

# 验证数据库创建成功
ls -la pinkaegis.db
```

---

### 3.5 配置阿里云安全组

在阿里云控制台操作：

1. 登录 **ECS 控制台** → 选择你的实例 → **安全组** → **配置规则**
2. 点击 **入方向** → **手动添加**：

| 优先级 | 协议 | 端口范围 | 授权对象 | 说明 |
|--------|------|----------|----------|------|
| 100 | TCP | 5000/5000 | 0.0.0.0/0 | Flask 直接访问（测试用）|
| 100 | TCP | 80/80 | 0.0.0.0/0 | Nginx HTTP（正式部署）|
| 100 | TCP | 443/443 | 0.0.0.0/0 | HTTPS（配置SSL后）|
| 100 | TCP | 22/22 | 你的本机IP | SSH 管理（建议限制IP）|

> ⚠️ 生产环境稳定后，可以关闭 5000 端口，只保留 80/443 通过 Nginx 访问。

---

### 3.6 测试直接运行

```bash
cd /home/ubuntu/pinkaegis-app
source venv/bin/activate

# 用 Gunicorn 启动（生产模式）
gunicorn --workers 2 --bind 0.0.0.0:5000 app:app

# 然后在浏览器访问：
# http://<你的服务器公网IP>:5000
```

---

### 3.7 配置 systemd 开机自启（推荐）

```bash
# 1. 将 pinkaegis.service 复制到 systemd 目录
sudo cp /home/ubuntu/pinkaegis-app/pinkaegis.service /etc/systemd/system/

# 2. 重载 systemd 配置
sudo systemctl daemon-reload

# 3. 启动服务
sudo systemctl start pinkaegis

# 4. 设置开机自启
sudo systemctl enable pinkaegis

# 5. 查看运行状态
sudo systemctl status pinkaegis

# 常用管理命令
sudo systemctl stop pinkaegis       # 停止服务
sudo systemctl restart pinkaegis    # 重启服务（更新代码后执行）
journalctl -u pinkaegis -f          # 实时查看日志
```

**验证 pinkaegis.service 内容**（确认路径与你的一致）：

```ini
[Unit]
Description=PINKAEGIS 生活系统 Flask 应用
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pinkaegis-app
ExecStart=/home/ubuntu/pinkaegis-app/venv/bin/gunicorn \
    --workers 2 \
    --bind 127.0.0.1:5000 \
    --access-logfile /home/ubuntu/pinkaegis-app/logs/access.log \
    --error-logfile  /home/ubuntu/pinkaegis-app/logs/error.log \
    app:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

---

### 3.8 配置 Nginx 反向代理（绑定域名，通过 80 端口访问）

```bash
# 1. 将 Nginx 配置复制到 sites-available
sudo cp /home/ubuntu/pinkaegis-app/nginx_pinkaegis.conf \
        /etc/nginx/sites-available/pinkaegis

# 2. 修改配置中的 server_name（替换为你的域名或IP）
sudo nano /etc/nginx/sites-available/pinkaegis
# 找到：server_name pinkaegis;
# 改为：server_name 你的域名或公网IP;（例如：pinkaegis.com）

# 3. 创建软链接（启用站点）
sudo ln -s /etc/nginx/sites-available/pinkaegis \
           /etc/nginx/sites-enabled/

# 4. 测试 Nginx 配置语法
sudo nginx -t

# 5. 重启 Nginx
sudo systemctl restart nginx

# 6. 设置 Nginx 开机自启
sudo systemctl enable nginx

# 现在可以通过 80 端口访问：
# http://你的域名或公网IP
```

---

### 3.9 （可选）配置 HTTPS / SSL 证书

使用 Certbot 免费获取 Let's Encrypt 证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 自动获取证书并配置 Nginx（替换为你的真实域名）
sudo certbot --nginx -d pinkaegis.com

# 证书自动续期（Certbot 已配置 cron，可验证）
sudo certbot renew --dry-run
```

---

## 四、代码更新流程

每次更新代码后，执行以下步骤：

```bash
# 1. 上传新代码（SCP 方式）
scp -r ./pinkaegis-app ubuntu@<IP>:/home/ubuntu/

# 或 Git 方式
cd /home/ubuntu/pinkaegis-app && git pull

# 2. 如有新依赖
source venv/bin/activate
pip install -r requirements.txt

# 3. 重启服务
sudo systemctl restart pinkaegis

# 4. 验证状态
sudo systemctl status pinkaegis
```

---

## 五、API 接口文档

### GET /api/messages

返回所有留言，按时间倒序排列。

**响应示例：**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "nickname": "小明",
      "content": "这个系统太好用了！",
      "created_at": "2026-03-04T10:30:00"
    },
    {
      "id": 1,
      "nickname": "匿名",
      "content": "给未来的自己加油",
      "created_at": "2026-03-04T09:15:00"
    }
  ]
}
```

### POST /api/messages

提交新留言。

**请求体（JSON）：**
```json
{
  "nickname": "小明",
  "content": "这个系统太好用了！"
}
```

**响应（成功 201）：**
```json
{
  "success": true,
  "message": "留言成功",
  "id": 3
}
```

**响应（失败 400）：**
```json
{
  "success": false,
  "message": "留言内容不能为空"
}
```

---

## 六、常见问题排查

| 问题 | 排查步骤 |
|------|----------|
| 浏览器无法访问 | 检查阿里云安全组端口是否开放 |
| 502 Bad Gateway | `sudo systemctl status pinkaegis` 查看 Flask 是否正常运行 |
| 静态资源 404 | 确认 `static/` 目录权限：`chmod -R 755 /home/ubuntu/pinkaegis-app/static` |
| 数据库锁错误 | 检查是否有多个进程访问同一 pinkaegis.db，重启服务 |
| 留言提交无反应 | 打开浏览器开发者工具 → Network，检查 `/api/messages` 请求状态码 |

```bash
# 查看 Flask 实时错误日志
tail -f /home/ubuntu/pinkaegis-app/logs/error.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```
