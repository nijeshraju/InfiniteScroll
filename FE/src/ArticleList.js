import React from 'react';

const ArticleList = ({ articles }) => {

  return (
    <div className="outer-section">
      {articles?.map((article) => (
        <div className="parent-section" key={article?.node?.nid}>
          <img src={article?.node?.field_photo_image_section} alt={article?.node?.title} />
          <div className='content'>
            <p className='title'>{article?.node?.title}</p>
            <p className='date'>Last Update: {article?.node?.last_update}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;