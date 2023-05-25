import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { pixabayApi } from 'service/pixabay_api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [query, setQuery] = useState('');
  const [imgData, setImgData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const [active, setActive] = useState('');

  useEffect(() => {
    // если данные для запроса не ввели(пустая строка), то выходим
    if (query === '') {
      return;
    }
    // иначе если данные в query изменились или изменилась страница page, то делаем запрос
    async function getDataImage() {
      try {
        setIsLoading(true);

        const images = await pixabayApi(query, page);

        // достаем из пришедшего объекта данных массив объектов с данными изображений
        const { hits, totalHits } = images;

        // если на введенный запрос не существует данных, то выводим сообщение об этом
        if (hits.length === 0) {
          alert('Таких данных не существует, введите новый запрос');
          return;
        }

        // переберем массив и создадим новый только с "нужными" свойсвами объектов массива
        const newHits = hits.map(({ id, webformatURL, largeImageURL }) => {
          return { id, webformatURL, largeImageURL };
        });

        // записываем полученные данные в массив изображений imgData,
        // предварительно распыляя предыдущие данные(если они уже есть), а также
        // общее количество бесплатных картинок
        setImgData(prevState => [...prevState, ...newHits]);
        setTotalImages(totalHits);
      } catch (error) {
        setError('Что-то пошло не так!!!');
      } finally {
        setIsLoading(false);
      }
    }
    getDataImage();
  }, [query, page]);

  // при сабмите формы записываем в state новые значение свойств объекта
  // (учитывая, что при следующем сабмите приводим массив данных imgData к начальному -
  // пустому массиву и номерации страницы)
  const getQuery = valueInput => {
    if (valueInput === query) {
      alert('Введите новое значение для поиска');
      return;
    }
    setQuery(valueInput);
    setImgData([]);
    setPage(1);
    setTotalImages(0);
  };

  // при клике на кнопку загрузить еще увеличивает нумерацию страницы
  const btnLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const toggleModal = (largeImageURL = '') => {
    setIsModal(prevState => !prevState);
    setActive(largeImageURL);
  };

  return (
    <>
      <Searchbar onSubmit={getQuery} />
      {/* если картинки загружаются выводим сообщение о загрузке */}
      {isLoading && <Loader />}

      {/*  Если будет ошибка - выводим сообщение  */}
      {error && <p>{error}</p>}

      {/* Если данные в массиве с изображениями есть - рендерим */}
      {imgData.length > 0 && (
        <ImageGallery imagesData={imgData} onClick={toggleModal} />
      )}

      {/* пока не происходит загрузка изображений и длина массива с изображениями не равна суммарным пришедшие бесплатным 
        картинкам, то рендерем кнопку*/}
      {!isLoading && imgData.length !== totalImages && (
        <Button onClick={btnLoadMore} />
      )}

      {isModal && <Modal active={active} onClick={toggleModal} />}
    </>
  );
};
