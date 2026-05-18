// Time Will Tell Archive - Catalog Renderer

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
    
    // Update summary stats
    updateStats(catalog.length, groups.length, featured.length);
  } catch (e) {
    console.error('Failed to load data', e);
    const container = document.getElementById('catalog-list');
    if (container) {
      container.innerHTML = '<p style="color:#c00">数据加载失败，请稍后重试或查看原始 GitHub 仓库。</p>';
    }
  }
}

function updateStats(postCount, groupCount, featuredCount) {
  const statsEl = document.getElementById('catalog-stats');
  if (statsEl) {
    statsEl.textContent = `${postCount} posts · ${groupCount} groups · ${featuredCount} featured entries`;
  }
}

function renderFeatured(featured, catalog) {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  container.innerHTML = '';
  
  featured.forEach(item => {
    const post = catalog.find(p => p.id === item.post_id) || {};
    const div = document.createElement('div');
    div.className = 'featured-card';
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p class="date">${item.date}</p>
      <p class="summary">${item.summary_cn}</p>
      <div class="meta">
        <a href="${item.original_github_url}" target="_blank" class="source-link">View on GitHub →</a>
        <span class="risk-badge ${item.risk_note}">${item.risk_note}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderGroups(groups) {
  const container = document.getElementById('groups-grid');
  if (!container) return;
  container.innerHTML = '';
  
  groups.forEach(g => {
    const div = document.createElement('div');
    div.className = 'group-card';
    div.innerHTML = `
      <h4>${g.title_cn}</h4>
      <p>${g.description}</p>
      <div class="group-meta">
        <span class="count">${g.count} posts</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderCatalog(posts) {
  const container = document.getElementById('catalog-list');
  if (!container) return;
  container.innerHTML = '';
  
  const list = document.createElement('div');
  list.className = 'catalog-list';
  
  posts.forEach(post => {
    const item = document.createElement('div');
    item.className = `catalog-item ${post.content_type || ''}`;
    item.innerHTML = `
      <div class="meta">
        <span class="date">${post.date}</span>
        <span class="type">${post.content_group || post.content_type}</span>
      </div>
      <div class="title">${post.title}</div>
      <div class="summary">${post.summary_cn}</div>
      <div class="meta">
        <a href="${post.original_github_url}" target="_blank" class="source-link">原始 GitHub 链接 →</a>
        <span class="risk-badge low">历史档案</span>
      </div>
    `;
    list.appendChild(item);
  });
  
  container.appendChild(list);
}

function filterPosts(type) {
  const items = document.querySelectorAll('.catalog-item');
  let visibleCount = 0;
  
  items.forEach(item => {
    if (type === 'all') {
      item.style.display = '';
      visibleCount++;
    } else {
      if (item.classList.contains(type)) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    }
  });
  
  // Update result count if element exists
  const countEl = document.getElementById('filter-result-count');
  if (countEl) countEl.textContent = `显示 ${visibleCount} 篇`;
}

document.addEventListener('DOMContentLoaded', loadData);