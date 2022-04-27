// TODO - Find a way to add an ID to headings
// One possible solution: https://www.npmjs.com/package/remark-heading-id

import { remark } from 'remark';
import html from 'remark-html';

const markdownToHtml = async markdown => {
  const result = await remark().use(html).process(markdown);
  return result.toString();
};

export default markdownToHtml;
