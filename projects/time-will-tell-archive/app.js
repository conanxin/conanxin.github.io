// Simple dynamic loader for Time Will Tell archive

async function loadData() {
  try {
    const [catalog, groups, featured] = await Promise.all([
      fetch('data/posts-catalog.json').then(r => r.json()),
      fetch('data/content-groups.json').then(r => r.json()),
      fetch('data/featured-entries.json').then(r => r.json())
    ]);

    renderFeatured(featured, catalog);
    renderGroups(groups);
    renderCatalog(catalog);
    window.allPosts = catalog;
  } catch (e) {
    console.error('Failed to load data', e);
    document.getElementById('catalog-list').innerHTML = '<p>数据加载失败，请查看原始仓库。</p>';
  }
}

function renderFeatured(featured, catalog) {
  const container = document.getElementById('featured-grid');
  container.innerHTML = '';
  featured.forEach(item => {
    const post = catalog.find(p => p.id === item.post_id) || {};
    const div = document.createElement('div');
    div.className = 'featured-card';
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p class="date">${item.date}</p>
      <p>${item.summary_cn}</p>
      <a href="${item.original_github_url}" target="_blank" class="source-link">View on GitHub →</a>
      <span class="risk-badge ${item.risk_note}">${item.risk_note}</span>
    `;
    container.appendChild(div);
  });
}

function renderGroups(groups) {
  const container = document.getElementById('groups-grid');
  container.innerHTML = '';
  groups.forEach(g => {
    const div = document.createElement('div');
    div.className = 'group-card';
    div.innerHTML = `
      <h4>${g.title_cn}</h4>
      <p>${g.description}</p>
      <span class="count">${g.count} posts</span>
    `;
    container.appendChild(div);
  });
}

function renderCatalog(posts) {
  const container = document.getElementById('catalog-list');
  container.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'catalog-list';
  posts.forEach(post => {
    const item = document.createElement('div');
    item.className = `catalog-item ${post.content_type}`;
    item.innerHTML = `
      <div class="meta">
        <span class="date">${post.date}</span>
        <span class="type">${post.content_group}</span>
      </div>
      <div class="title">${post.title}</div>
      <div class="summary">${post.summary_cn}</div>
      <a href="${post.original_github_url}" target="_blank" class="source-link">原始 GitHub 链接 →</a>
    `;
    list.appendChild(item);
  });
  container.appendChild(list);
}

function filterPosts(type) {
  const items = document.querySelectorAll('.catalog-item');
  items.forEach(item => {
    if (type === 'all') {
      item.style.display = '';
    } else {
      item.style.display = item.classList.contains(type) ? '' : 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', loadData);