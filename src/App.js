import React, { useState, useEffect } from 'react';

import api from './service/Api';
import styles from './App.module.css';

import Searchbar from './Components/Searchbar/Searchbar';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import Button from './Components/Button/Button';
import SpinLoader from './Components/Loader/Loader';
import Modal from './Components/Modal/Modal';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [modalSrc, setModalSrc] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [newPageCords, setNewPageCords] = useState(0);

  useEffect(() => {
    if (!query) {
      return;
    }

    const scrollToNextPage = () => {
      window.scrollTo({
        top: newPageCords,
        behavior: 'smooth',
      });
    };

    const fetchData = async () => {
      try {
        const data = await api(query, pageNumber);
        setImages(prevImages => [...prevImages, ...data.hits]);
        scrollToNextPage();
        setNewPageCords(document.documentElement.scrollHeight - 170);
        setTotalPages(Math.ceil(data.totalHits / 12));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNumber, query]);

  /*   fetchData = async () => {
    const { query, pageNumber } = this.state;
    try {
      const data = await api(query, pageNumber);
      this.setState(prevState => ({
        images: [...prevState.images, ...data.hits],
        isLoading: false,
        totalPages:
          prevState.totalPages > 0
            ? prevState.totalPages
            : Math.ceil(data.totalHits / 12),
      }));
    } catch (error) {
      this.setState({
        error: true,
        isLoading: false,
      });
    }
  }; */

  /*   scrollToNextPage = () => {
    const { newPageCords } = this.state;
    window.scrollTo({
      top: newPageCords,
      behavior: 'smooth',
    });
  }; */

  const onSearch = newQuery => {
    setPage(1);
    setTotalPages(0);
    setQuery(newQuery);
    setLoading(true);
    setImages([]);
    setNewPageCords(0);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSearch={onSearch} />
      {images.length > 0 && (
        <ImageGallery
          images={images}
          onImageClick={({ target }) => setModalSrc(target.dataset.url)}
        />
      )}
      {isLoading && <SpinLoader />}
      {pageNumber < totalPages && <Button onClickHandler={loadMore} />}
      {modalSrc && (
        <Modal onCloseModal={() => setModalSrc('')}>
          <img src={modalSrc} alt="" />
        </Modal>
      )}
    </div>
  );
}

export default App;
