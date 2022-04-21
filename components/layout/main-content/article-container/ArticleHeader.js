// TODO - Add 'coverImage' (if included)

import useHumanizedDate from '../../../../hooks/useHumanizedDate';
import Title from '../../../ui/text/Title';
import StringDivider from '../../../ui/StringDivider';
import PageHeader from '../PageHeader';
import Tags from '../../../ui/Tags';

const ArticleHeader = props => {
  const humanizedDate = useHumanizedDate();

  return (
    <PageHeader heroImage={props.coverImage}>
      <div className='relative text-center max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8'>
        {props.type && (
          <div className='text-base font-semibold text-indigo-700 tracking-wide uppercase'>
            {props.type}
          </div>
        )}
        <Title>{props.title}</Title>
        {props.description && (
          <p className='max-w-xl my-5 mx-auto text-xl text-gray-400'>{props.description}</p>
        )}
        {props.tagsArray.length > 0 && <Tags tagsArray={props.tagsArray} />}
        <div className='text-gray-400 mt-5 flex justify-center'>
          {props.published && <div>{humanizedDate(props.published)}</div>}
          {props.published && props.minsToRead && <StringDivider />}
          {props.minsToRead && <div>{props.minsToRead} min read</div>}
        </div>
      </div>
    </PageHeader>
  );
};

export default ArticleHeader;
