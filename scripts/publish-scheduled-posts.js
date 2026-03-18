/**
 * Automação: Publica posts agendados e atualiza sitemap
 *
 * Roda via GitHub Actions todo dia às 6h (horário de Brasília).
 * - Verifica posts.json por drafts com date <= hoje
 * - Muda status para "published"
 * - Troca meta robots de "noindex, nofollow" para "index, follow" no HTML
 * - Regenera sitemap.xml com todos os posts publicados
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_JSON = path.join(ROOT, 'blog', 'posts.json');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITE_URL = 'https://coffeetrip.com.br';

function getToday() {
    // Usa horário de Brasília (UTC-3)
    const now = new Date();
    const brasiliaOffset = -3 * 60;
    const local = new Date(now.getTime() + (brasiliaOffset - now.getTimezoneOffset()) * 60000);
    return local.toISOString().split('T')[0];
}

function publishPosts() {
    const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
    const today = getToday();
    let changed = false;

    console.log(`Data atual (Brasília): ${today}`);

    for (const post of posts) {
        if (post.status === 'draft' && post.date <= today) {
            console.log(`Publicando: "${post.title}" (agendado para ${post.date})`);

            // 1. Atualiza status no JSON
            post.status = 'published';
            changed = true;

            // 2. Atualiza meta robots no HTML do post
            const htmlPath = path.join(BLOG_DIR, `${post.slug}.html`);
            if (fs.existsSync(htmlPath)) {
                let html = fs.readFileSync(htmlPath, 'utf-8');
                html = html.replace(
                    '<meta name="robots" content="noindex, nofollow">',
                    '<meta name="robots" content="index, follow">'
                );
                fs.writeFileSync(htmlPath, html, 'utf-8');
                console.log(`  → Meta robots atualizado em ${post.slug}.html`);
            }
        }
    }

    if (changed) {
        // Salva posts.json atualizado
        fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 2) + '\n', 'utf-8');
        console.log('posts.json atualizado.');
    } else {
        console.log('Nenhum post para publicar hoje.');
    }

    // Sempre regenera o sitemap pra garantir que está sincronizado
    generateSitemap(posts);

    return changed;
}

function generateSitemap(posts) {
    const today = getToday();
    const published = posts.filter(p => p.status === 'published');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    for (const post of published) {
        xml += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}.html</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    xml += '\n</urlset>\n';

    fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
    console.log(`Sitemap atualizado com ${published.length} posts publicados.`);
}

// Executa
const changed = publishPosts();
process.exit(changed ? 0 : 0);
