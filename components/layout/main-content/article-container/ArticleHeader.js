// TODO - Add 'coverImage' (if included)
// TODO - Add 'lastUpdated' date

import useHumanizedDate from '../../../../hooks/useHumanizedDate';
import Title from '../../../ui/text/Title';
import StringDivider from '../../../ui/StringDivider';

const ArticleHeader = props => {
  const humanizedDate = useHumanizedDate();

  return (
    <div className='bg-gray-800 text-center'>
      <div className='max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8'>
        {props.type && (
          <div className='text-base font-semibold text-indigo-700 tracking-wide uppercase'>
            {props.type}
          </div>
        )}
        <Title>{props.title}</Title>
        {props.description && (
          <p className='max-w-xl my-5 mx-auto text-xl text-gray-400'>{props.description}</p>
        )}
        {props.tagsArray.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2'>
            {props.tagsArray.map(tag => (
              <span
                key={`${tag}-tag`}
                className='inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className='text-gray-400 mt-5 flex justify-center'>
          {props.published && <div>{humanizedDate(props.published)}</div>}
          {props.published && props.minsToRead && <StringDivider />}
          {props.minsToRead && <div>{props.minsToRead} min read</div>}
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
