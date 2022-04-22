import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const articlesPath = join(process.cwd(), '_articles');
const directoryPath = containingFolder =>
  `${articlesPath}${containingFolder ? `/${containingFolder}` : ''}`;

export const allContainingFolders = () =>
  ['', ...fs.readdirSync(articlesPath)].filter(file => file.slice(-3) !== '.md');

export const getArticleSlugs = containingFolder => {
  return fs.readdirSync(directoryPath(containingFolder));
};

export const getArticleBySlug = (slug, fields = [], containingFolder = '') => {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(directoryPath(containingFolder), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'section') {
      items[field] = containingFolder;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (field === 'minsToRead') {
      items[field] = Math.ceil(content.split(' ').length / 200);
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
};

const allArticles = (fields = []) => {
  let articlesArray = [];
  allContainingFolders().map(folder => {
    getArticleSlugs(folder).map(slug => {
      if (slug.slice(-3) === '.md') {
        articlesArray.push(getArticleBySlug(slug, fields, folder));
      }
    });
  });
  return articlesArray;
};

const articlesByFolder = (fields = [], folder) =>
  getArticleSlugs(folder).map(slug => getArticleBySlug(slug, fields, folder));

export const getArticles = (fields = [], containingFolder = '') => {
  let articles = containingFolder
    ? articlesByFolder(fields, containingFolder)
    : allArticles(fields);

  return articles.sort((article1, article2) => (article1.published > article2.published ? -1 : 1));
};
