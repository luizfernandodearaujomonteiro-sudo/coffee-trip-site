# CLAUDE.md — Guia do Projeto Coffee Trip

Site estático (HTML/CSS/JS puro, sem framework/build) da **Coffee Trip**, empresa de
**coffee break corporativo no Rio de Janeiro**. Hospedado na Vercel (deploy automático via
push no GitHub). Domínio: `https://coffeetrip.com.br`.

> Este arquivo é o **guia de estilo** que os agentes do blog (`.claude/agents/`) seguem para
> produzir conteúdo consistente. Idioma de todo conteúdo e dos prompts: **PT-BR**.

## Estrutura

- `index.html` — homepage (single page: Sobre, Serviços, Galeria, Contato).
- `blog/` — blog. `blog/index.html` lista os posts lendo `blog/posts.json` via fetch (JS).
- `blog/posts.json` — **fonte da verdade** dos posts (ver schema abaixo).
- `blog/<slug>.html` — uma página por post. Use `blog/_template.html` como base.
- `assets/img/` — imagens `.jpeg` (capas e corpo). Inventário abaixo.
- `style.css` — estilos globais (variáveis: `--black`, `--gold`, `--white`, `--gray`, etc.).
- `sitemap.xml`, `robots.txt` — SEO. O sitemap é **gerado automaticamente**, não edite à mão.
- `scripts/publish-scheduled-posts.js` + `.github/workflows/publish-posts.yml` — automação
  que publica posts agendados (ver "Fluxo de publicação").

## Schema do `posts.json`

Array de objetos. Cada post:

```json
{
  "slug": "coffee-break-exemplo-bairro",   // = nome do arquivo .html (sem extensão)
  "title": "Título do post",                // ≤ 60 caracteres (cabe no Google)
  "excerpt": "Resumo de 1–2 frases.",        // 120–160 caracteres; vira a meta description
  "cover": "mesa-elegante.jpeg",             // arquivo em assets/img/
  "tag": "Local",                            // Dicas | Tendências | Eventos | Delivery | Local
  "date": "2026-07-15",                      // YYYY-MM-DD; data de publicação (pode ser futura)
  "status": "draft",                         // "draft" | "published"
  "readTime": "6",                           // minutos de leitura (string)
  "content": ""                              // NÃO é usado pelo site; pode deixar "" (o texto
                                             // real fica no .html). Manter por consistência.
}
```

## Fluxo de publicação (NÃO quebrar)

1. Post novo nasce com `status: "draft"`, `date` **futura**, e no HTML
   `<meta name="robots" content="noindex, nofollow">`.
2. O dono revisa e confirma a data.
3. Na data, a automação (`publish-scheduled-posts.js`, roda 9h BRT via GitHub Actions):
   - muda `status` para `"published"` no `posts.json`;
   - troca o robots do HTML para `index, follow`;
   - regenera o `sitemap.xml`;
   - dá commit e push.
4. A Vercel publica sozinha.

**Regra:** o texto exato `<meta name="robots" content="noindex, nofollow">` precisa existir
no HTML do rascunho — é o que a automação procura para trocar. Sem ele, o post não é indexado.

### Passo manual pós-publicação (Google Search Console)

A automação NÃO avisa o Google (o endpoint de ping de sitemap foi desativado em 2023). Para o
post aparecer rápido na busca, faça manualmente no Search Console após a publicação:

1. **Reenviar o sitemap** (aba *Sitemaps* → `https://coffeetrip.com.br/sitemap.xml`) para o
   Google redescobrir todas as URLs de uma vez.
2. **Solicitar indexação** do post novo: *Inspecionar URL* → cole
   `https://coffeetrip.com.br/blog/<slug>.html` → *Solicitar indexação*.

Site novo demora a indexar e o Google tem limite diário de solicitações — é normal precisar
continuar no dia seguinte. Priorize home, `/blog/` e os posts de maior intenção comercial.

## Anatomia do post (`blog/<slug>.html`)

Use **`blog/_template.html`** como ponto de partida — ele já tem o boilerplate correto.
Substitua os placeholders `{{...}}`. Todo post deve ter, na ordem:

1. **`<head>`**: charset, gtag (GA `G-6EQNXVVWDD`), viewport, `title` (`{título} | Coffee Trip`,
   ≤60 chars), `meta description` (120–160), `meta keywords`, `meta robots`, `author`,
   Open Graph (title/description/image/type=article/url), `link canonical`, favicon, fonts
   (Playfair Display + Poppins), `link` para `../style.css`, **schema.org Article** (JSON-LD
   com `headline`, `description`, `image`, `author`/`publisher` = Coffee Trip, `datePublished`,
   `dateModified`, `url`), e o bloco `<style>` do post.
2. **`<header>`** com a navegação e ícones sociais.
3. **`post-hero`**: breadcrumb (`Home → Blog → {tag}`), `span.post-tag`, `h1`, `post-meta`
   (data por extenso, "Por Coffee Trip", tempo de leitura).
4. **Capa**: `<img class="post-cover" loading="eager">`.
5. **`article.post-body`**: o conteúdo — `h2` (seções), `h3` (subseções), `p`, `ul`/`ol`,
   `div.post-highlight` (citação/destaque), e **2 a 3 imagens no corpo** (`img.post-img`,
   `loading="lazy"`, com `alt` descritivo). Sempre terminar com:
   - seção **"Leia também"** com 2–3 links internos para posts relacionados (`/blog/<slug>.html`);
   - `div.post-cta` com botão de WhatsApp.
6. **`<footer>`** completo + botão flutuante `whatsapp-float`.

### Convenções de SEO e conteúdo

- `title` ≤ 60 chars; `meta description` 120–160 chars; um único `<h1>` por página.
- `alt` descritivo em **todas** as imagens.
- `dateModified` = data da última edição real (atualizar quando revisar um post antigo).
- Schema.org, OG `url` e `canonical` sempre apontam para a URL final do post.
- **Links internos:** todo post linka para 2–3 outros posts (essencial para SEO).
- Texto com profundidade: dados concretos, listas, exemplos do RJ. Evitar texto raso.

### ⚠️ Regras de conteúdo OBRIGATÓRIAS (nunca violar)

Estas regras valem para TODOS os posts (novos e existentes). Ferem confiança/legalidade se
quebradas:

1. **Nunca informar preços ou valores nos posts.** Nada de "R$", faixas de preço, "valor por
   pessoa", tabela de pacotes. O orçamento é sempre **personalizado e feito só pelo WhatsApp**.
   Pode-se explicar *o que influencia o valor* e os *níveis de cardápio* (Básico/Intermediário/
   Premium descritos pelo que incluem), mas **sem nenhum número**.
2. **A fotografia profissional é serviço PAGO À PARTE (opcional) — NÃO é inclusa.** (A empresa
   NÃO oferece filmagem — não mencionar filmagem.) É PROIBIDO escrever que a fotografia é
   "inclusa", "sem custo adicional", "incluída", "cortesia" ou "em todos os pacotes". Se
   mencionar, descreva como **serviço opcional, contratado à parte**. Nunca em listas de "o
   que está incluso".

### Conversão (sempre presente)

- CTA de WhatsApp: `https://wa.me/5521996377004` (com `?text=` pré-preenchido e contextual).
- Diferenciais VERDADEIROS que podem ser citados: cardápio personalizado, montagem e
  desmontagem completas, pontualidade, louças/utensílios inclusos, atendimento em todo o RJ.
  (Fotografia: só como serviço **opcional à parte** — ver regra 2 acima. Não há filmagem.)
- Contatos: WhatsApp (21) 99637-7004 · Instagram @cof.feetrip · TikTok @_coffeetripsim.

## Inventário de imagens (`assets/img/`)

Escolha a capa/imagens pelo tema. Categorias:

- **Mesas (montagem/ambiente):** `mesa-completa`, `mesa-premium`, `mesa-elegante`,
  `mesa-sofisticada`, `mesa-classica`, `mesa-corporativa-preta`, `mesa-preta-moderna`,
  `mesa-grande-evento`, `mesa-grande`, `mesa-redonda`, `mesa-rustica`, `mesa-industrial`,
  `mesa-floral`, `mesa-tropical`, `mesa-verde`, `mesa-azul`, `mesa-evento-azul`,
  `mesa-evento-verde`, `mesa-externa`, `mesa-noturna`, `mesa-lanternas`, `mesa-decorada`,
  `mesa-abundante`, `mesa-perspectiva`, `mesa-frutas`, `mesa-salgados`, `mesa-bolos-doces`,
  `mesa-vitrine-bolos`, `mesa-nova-1/2/3`, `mesa-piraque-wide`.
- **Detalhes (close-ups):** `detalhe-frutas-coloridas`, `detalhe-canapes-tomate`,
  `detalhe-doces-aerea`, `detalhe-bolo-salgado`, `detalhe-bolos-duplo`, `detalhe-xicaras`,
  `detalhe-infusao`, `detalhe-sucos-cristal`, `detalhe-guardanapos`, `detalhe-lanternas-velas`,
  `detalhe-novo-1/2`, `salgados-closeup`, `canapes`, `bolos-sucos`.
- **Estações/eventos:** `estacao-cafe`, `estacao-bebidas`, `evento-corporativo`,
  `evento-estufa`, `evento-piraque`, `box-evento`.
- **Delivery:** `delivery-box-premium`, `delivery-caixas`, `delivery-bolo`, `delivery-novo-1`.
- **Outros (não usar como capa de post):** `logo`, `banner-contato`, `icon-*`, `perfil-tiktok`.

Sufixo sempre `.jpeg`. No HTML do post, o caminho é `../assets/img/<nome>.jpeg`.

## Posts existentes (para evitar repetição e linkar entre si)

`como-montar-coffee-break-corporativo` (Dicas) · `quanto-custa-coffee-break-corporativo-rj`
(Dicas) · `tendencias-coffee-break-corporativo-2026` (Tendências) ·
`coffee-break-treinamentos-workshops-corporativos` (Eventos) ·
`coffee-break-delivery-home-office` (Delivery) · `coffee-break-reunioes-corporativas` (Eventos)
· `coffee-break-eventos-empresariais-rj` (Eventos) · `coffee-break-corporativo-centro-rj`
(Local) · `coffee-break-corporativo-barra-da-tijuca` (Local) ·
`coffee-break-corporativo-zona-sul-rj` (Local).
