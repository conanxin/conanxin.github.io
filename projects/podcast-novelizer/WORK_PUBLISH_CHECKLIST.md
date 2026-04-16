# 新增作品接入清单

## 一、生成作品页

1. 确认播客小说成品已在本地工作区完成（V2 修订、去风险处理）
2. 在 `/podcast/` 下创建作品目录：`/podcast/<slug>/`
3. 生成以下静态 HTML 文件：
   - `index.html` — 作品首页（标题、简介、导航）
   - `chapters.html` — 章节总览
   - `characters.html` — 人物设定表
   - `about.html` — 项目说明
   - 各章节 HTML（如 `preface.html`、`ch一.html`、`postscript.html`）

## 二、更新 works.json

编辑 `/projects/podcast-novelizer/works.json`，追加一条记录：

```json
{
  "title": "作品标题",
  "slug": "url-slug",
  "source": "播客名 EPxx",
  "updated": "YYYY-MM",
  "summary": "一句话简介",
  "entry_url": "/podcast/<slug>/",
  "status": "已完成 V2",
  "status_color": "#3fb950",
  "chapters": 14
}
```

注意事项：
- `slug` 需与作品目录名一致
- `entry_url` 需与实际路径一致，以 `/` 开头和结尾
- `chapters` 为作品页总数（含 index、章节、人物、说明等所有 HTML）
- works.json 中的作品按 `updated` 字段倒序排列（新的在前）

## 三、更新 projects/data.json（可选）

若希望作品在 projects 索引页也可被发现，可在 `/projects/data.json` 中新增条目。
当前策略：作品条目设 `featured: false`，通过 Podcast Novelizer 项目页进入。

## 四、发布前检查

- [ ] works.json 是合法 JSON（用 `python3 -m json.tool works.json` 验证）
- [ ] 作品目录下所有 HTML 文件可访问（本地 `python3 -m http.server` 测试）
- [ ] `entry_url` 路径与实际目录一致
- [ ] 作品内容已做去风险处理（人名/地名脱敏）
- [ ] 章节导航链接（上一章/下一章/目录）无死链
- [ ] 未改动与本次作品无关的文件

## 五、发布

```bash
cd /home/conanxin/conanxin.github.io
git add podcast/<slug>/ projects/podcast-novelizer/works.json
git commit -m 'feat(podcast): add new work "<作品标题>" from <播客名> EPxx'
git push origin main
```

## 六、验证

- [ ] GitHub Actions 构建成功
- [ ] 线上 `/projects/podcast-novelizer/` 显示新作品卡片
- [ ] 线上 `/podcast/<slug>/` 可正常访问
- [ ] 章节间导航无死链
