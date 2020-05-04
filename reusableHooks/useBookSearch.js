import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHashMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query])

  useEffect(() => {
    setLoading(true);
    setError(false);

    let cancel;
    axios({
      method: 'GET',
      url: 'https://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c),
    }).then((res) => {
      setBooks(prevBooks => {
        return [...prevBooks, ...res.data.docs.map(book => {
          const { title, first_publish_year, language, publish_place, publisher } = book;
          return {title, first_publish_year, language, publish_place, publisher};

          // return {
          //   title: b.title,
          //   firstPublishYear: b.first_publish_year,
          //   language: b.language[0], publishPlace: b.publish_place[0], publisher: b.publisher[0]
          // }
        })]
      });
      setHashMore(res.data.docs.length > 0);
      setLoading(false);
    }).catch((err) => {
      if (axios.isCancel(err)) return;
      setError(true);
    });
    return () => cancel()
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}