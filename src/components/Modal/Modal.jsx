import { useEffect } from 'react';
import css from './Modal.module.css';
import { createPortal } from 'react-dom';
const modalRootRef = document.getElementById('modal-root');

export const Modal = ({ active, onClick }) => {
  useEffect(() => {
    const handleESC = e => {
      if (e.code === 'Escape') {
        onClick();
      }
    };

    // вешаем слушателя события
    document.addEventListener('keydown', handleESC);

    // метод componentWillUnmount переписываем в useEffect в колбек фукнции return(снимаем слушателя события)
    return () => {
      document.removeEventListener('keydown', handleESC);
    };
  }, [onClick]);

  const handleClick = e => {
    if (e.target === e.currentTarget) {
      onClick();
    }
  };

  return createPortal(
    <div className={css.overlay} onClick={handleClick}>
      <div className={css.modal}>
        <img src={active} alt="phot" />
        <button
          className={css.modal_button}
          type="button"
          onClick={() => onClick()}
        >
          Close image
        </button>
      </div>
    </div>,
    modalRootRef
  );
};
