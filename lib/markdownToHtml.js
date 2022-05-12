import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';
import headingIds from 'remark-heading-id';

const markdownToHtml = async markdown => {
  const result = await remark()
    .use(html, { sanitize: false })
    .use(prism)
    .use(headingIds)
    .process(markdown);
  return result.toString();
};

export default markdownToHtml;
