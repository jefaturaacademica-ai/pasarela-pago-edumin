import fs from 'fs';

const content = fs.readFileSync('C:/Users/USER/.gemini/antigravity/brain/63e30e6b-ab34-4a65-bc63-b7e24f2379f7/.system_generated/steps/1941/content.md', 'utf8');

const articleRegex = /<article class="daem-explorer-card"[\s\S]*?<\/article>/g;
const articles = content.match(articleRegex) || [];

const catalog = [];

articles.forEach((art, idx) => {
  const titleM = art.match(/<h3>([^<]+)<\/h3>/);
  const imgM = art.match(/src="([^"]+)"/);
  const tagM = art.match(/<span class="tag">([^<]+)<\/span>/);
  const objM = art.match(/Objetivo<\/strong><span>([^<]+)<\/span>/);
  const dirM = art.match(/Dirigido a<\/strong><span>([^<]+)<\/span>/);
  const aprM = art.match(/aprenderás<\/strong><span>([^<]+)<\/span>/);

  catalog.push({
    id: 'daem-' + (idx + 1),
    title: titleM ? titleM[1].trim() : '',
    category: tagM ? tagM[1].trim() : 'Especialización Minera',
    img: imgM ? `https://www.edumin.pe${imgM[1]}` : 'https://www.edumin.pe/assets/images/empresas-hero.webp',
    objetivo: objM ? objM[1].trim() : 'Formación aplicada con certificación de alta especialización.',
    dirigido: dirM ? dirM[1].trim() : 'Profesionales, egresados y técnicos del sector minero e industrial.',
    aprenderas: aprM ? aprM[1].trim() : 'Módulos prácticos, normativa aplicable y herramientas de gestión minera.'
  });
});

console.log('Parsed Catalog Count:', catalog.length);
fs.writeFileSync('src/utils/daemCatalogData.js', `export const DAEM_FULL_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`);
console.log('Saved to src/utils/daemCatalogData.js!');
