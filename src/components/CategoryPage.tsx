import React from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  return (
    <div className="category-page">
      <h1>Category: {categoryName}</h1>
      <p>This is the categories page implementation.</p>
    </div>
  );
};

export default CategoryPage;
