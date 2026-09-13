import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ICON_CLOSE from '../../assets/icons/student/lesson/close.svg';
import ICON_ATTACH from '../../assets/icons/student/lesson/attach-link.svg';
import styles from './LessonAskModal.module.css';

const QUESTION_MAX = 500;

type LessonAskModalProps = {
  lessonTitle: string;
  teacherName: string;
  onClose: () => void;
};

export function LessonAskModal({ lessonTitle, teacherName, onClose }: LessonAskModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [question, setQuestion] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-ask-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 id="lesson-ask-title" className={styles.title}>
              Вопрос преподавателю
            </h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
              <img src={ICON_CLOSE} alt="" width={17} height={17} />
            </button>
          </div>

          <div className={styles.meta}>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>Урок:</span>
              <span className={styles.metaValue}>{lessonTitle}</span>
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>Преподаватель:</span>
              <span className={styles.metaValue}>{teacherName}</span>
            </p>

            <div className={styles.form}>
              <p className={styles.hint}>
                Напишите вопрос по предстоящему уроку.
                <br />
                Преподаватель увидит его до начала урока.
              </p>
              <div className={styles.field}>
                <textarea
                  className={styles.textarea}
                  value={question}
                  maxLength={QUESTION_MAX}
                  placeholder="Например, можно ли заранее получить вопросы для фраз?"
                  onChange={(event) => setQuestion(event.target.value.slice(0, QUESTION_MAX))}
                />
                <p className={styles.counter}>
                  {question.length}/{QUESTION_MAX}
                </p>
              </div>
              <button
                type="button"
                className={styles.attach}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className={styles.attachIcon}>
                  <img src={ICON_ATTACH} alt="" width={14} height={14} />
                </span>
                <span className={styles.attachLabel}>
                  {fileName || 'Прикрепить файл (необязательно)'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className={styles.hiddenInput}
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={styles.btnSend} onClick={onClose}>
            Отправить вопрос
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
