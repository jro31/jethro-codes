// TODO - Add a 'tags' section to the headers of markdown files
// These should be used to 1) Be displayed at the top of the page, and potentially on the cards, to easily see the topics covered
// 2) As the 'keywords' in the meta tag in the header

import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const articlesPath = join(process.cwd(), '_articles');
const directoryPath = containingFolder =>
  `${articlesPath}${containingFolder ? `/${containingFolder}` : ''}`;

export const getArticleSlugs = containingFolder => {
  return fs.readdirSync(directoryPath(containingFolder));
};

export const getArticleBySlug = (slug, fields = [], containingFolder) => {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(directoryPath(containingFolder), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
};

export const getArticles = (fields = [], containingFolder) => {
  const slugs = getArticleSlugs(containingFolder);
  const articles = slugs
    .map(slug => getArticleBySlug(slug, fields, containingFolder))
    // sort posts by date in descending order
    .sort((article1, article2) => (article1.date > article2.date ? -1 : 1));
  return articles;
};
