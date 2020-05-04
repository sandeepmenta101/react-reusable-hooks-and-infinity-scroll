import React, { useState, useRef, useCallback } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import './style.css';
import useBookSearch from './reusableHooks/useBookSearch';

export default function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const lastBookRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log(entries[0]);
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
    console.log(node);
  }, [loading, hasMore]);

  let handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  let handleClose = (e) => {
    setQuery('');
  }
  return (
    <div>
      <div className="search-field-wrapper">
        <span className="material-icons search">search</span>
        <input type="text" onChange={handleSearch} value={query} className="search-field" placeholder="Search for books..." />
        {query && <span className="material-icons close" onClick={handleClose}>close</span>}
      </div>
      <div className="books-wrapper">
        {books && books.map((book, i) => {
          if (books.length === i + 1) {
            return (<div key={i} ref={lastBookRef} className="book">{book.title}</div>);
          } else {
            return (<div key={i} className="book">{book.title}</div>);
          }
        })}
      </div>
      {loading && <div className="loading-shimmer">
        Loading...
      </div>}
      <div>{error && 'Error'}</div>
    </div>
  );
}

render(<App />, document.getElementById('root'));
