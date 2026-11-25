document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('hs_user');
  const nav = document.querySelector('nav');
  if (nav && currentUser) {
    const loginLink = nav.querySelector('a[href="login.html"]');
    if (loginLink) {
      loginLink.textContent = 'USER: ' + currentUser.toUpperCase();
      loginLink.href = '#';
      loginLink.title = 'Click to logout';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Logout from ' + currentUser + '?')) {
          localStorage.removeItem('hs_user');
          window.location.reload();
        }
      });
    }
  }

  const loginForm = document.querySelector('form[action="index.html"]');
  if (loginForm && document.getElementById('password') && !document.getElementById('name')) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const username = email.split('@')[0] || 'Hacker';
      localStorage.setItem('hs_user', username);
      window.location.href = 'index.html';
    });
  }

  const regForm = document.querySelector('form[action="login.html"]');
  if (regForm && document.getElementById('name')) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      localStorage.setItem('hs_user', name);
      alert('Account created for ' + name + '! Logging in...');
      window.location.href = 'index.html';
    });
  }

  const addForm = document.querySelector('form');
  if (addForm && document.getElementById('article-title')) {
    let tags = ['#community'];
    const plusBtn = document.querySelector('.plus-action');
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        const tag = prompt('Enter tag (e.g. linux, security, python):');
        if (tag) {
          const cleanTag = tag.startsWith('#') ? tag : '#' + tag.replace(/\s+/g, '');
          tags.push(cleanTag);
          plusBtn.textContent = '+   Add Tag (' + tags.join(' ') + ')';
        }
      });
    }

    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('article-title').value.trim();
      const author = localStorage.getItem('hs_user') || 'Anonymous';
      const saved = JSON.parse(localStorage.getItem('hs_articles') || '[]');
      saved.unshift({
        title: title,
        author: author,
        verified: !!localStorage.getItem('hs_user'),
        time: 'Just now',
        comments: '0 Comments',
        tag: tags.join(' ')
      });
      localStorage.setItem('hs_articles', JSON.stringify(saved));
      window.location.href = 'index.html';
    });
  }

  const searchInput = document.querySelector('.search-box input');
  if (searchInput && !document.getElementById('iso-search')) {
    const firstArticle = document.querySelector('.article');
    const saved = JSON.parse(localStorage.getItem('hs_articles') || '[]');
    if (firstArticle && saved.length > 0) {
      saved.reverse().forEach(art => {
        const div = document.createElement('div');
        div.className = 'article';
        div.innerHTML = '<a href="#" class="article-title">' + art.title + '</a>' +
          '<div class="article-meta">by <a href="#">' + art.author + '</a> ' +
          (art.verified ? '<span class="verified">&#10004;</span>' : '') + '<br>' +
          art.time + ' &bull; ' + art.comments + ' &bull; ' + art.tag + '</div>';
        firstArticle.parentNode.insertBefore(div, firstArticle);
      });
    }

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.article').forEach(art => {
        art.style.display = art.innerText.toLowerCase().includes(q) ? 'block' : 'none';
      });
    });
  }

  const terminalBox = document.querySelector('.terminal-box');
  if (terminalBox) {
    terminalBox.innerHTML = '<div>Terminal Hacking Studio Codespace IDE</div>' +
      '<div>[Hacking Studio 2026]</div>' +
      '<div>LTS (web) 2.8.1v &mdash; Type <b>help</b> for commands</div>' +
      '<div id="term-output" style="margin-top: 16px; color: #e0e0e0; font-size: 16px;"></div>' +
      '<div style="display:flex; align-items:center; margin-top: 12px; color: #ffffff;">' +
      '<span style="margin-right: 8px;">$&gt;</span>' +
      '<input type="text" id="term-input" autocomplete="off" spellcheck="false" style="background:transparent; border:none; color:#6aa84f; font-family:inherit; font-size:18px; width:100%; margin:0; padding:0; outline:none;">' +
      '</div>';

    const termInput = document.getElementById('term-input');
    const termOutput = document.getElementById('term-output');
    terminalBox.addEventListener('click', () => termInput.focus());
    termInput.focus();

    const commands = {
      help: 'Available commands: help, ls, whoami, neofetch, date, iso, clear',
      ls: 'index.html  login.html  createaccount.html  add.html  pages.html  studio.html  academy.html  legal.html  iso.html  404.html  app.js  manifest.json',
      whoami: () => localStorage.getItem('hs_user') || 'guest@hs-platform',
      date: () => new Date().toString(),
      iso: 'METAISO.net archive mounted at /iso.html (50 families, 100 releases, SHA-256 verified).',
      neofetch: 'OS: Hacking Studio WebOS 2.8.1 LTS | Kernel: Elephant Engine 2026 | Shell: hs-sh | Host: GitHub Pages'
    };

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = termInput.value.trim();
        const cmd = raw.toLowerCase();
        termInput.value = '';
        if (!raw) return;

        const line = document.createElement('div');
        line.innerHTML = '<span style="color:#b833b8;">$&gt; ' + raw + '</span>';
        termOutput.appendChild(line);

        if (cmd === 'clear') {
          termOutput.innerHTML = '';
          return;
        }

        const resp = document.createElement('div');
        resp.style.marginBottom = '8px';
        if (commands[cmd]) {
          resp.textContent = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
        } else {
          resp.textContent = 'hs-sh: command not found: ' + cmd + '. Type help.';
        }
        termOutput.appendChild(resp);
      }
    });
  }

  const academyInput = document.querySelector('input[placeholder="XXXX - XXXX"]');
  if (academyInput) {
    const form = academyInput.closest('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = academyInput.value.trim();
      if (code.length < 4) {
        alert('Please enter a valid group code (e.g. HS26 - 9012).');
        return;
      }
      localStorage.setItem('hs_academy', code);
      alert('Joined Academy Group: ' + code);
      window.location.reload();
    });
    const savedGroup = localStorage.getItem('hs_academy');
    const statusP = document.querySelector('p strong');
    if (savedGroup && statusP) {
      statusP.textContent = 'Assigned to Academy Group: ' + savedGroup;
      statusP.style.color = '#6aa84f';
    }
  }
});

