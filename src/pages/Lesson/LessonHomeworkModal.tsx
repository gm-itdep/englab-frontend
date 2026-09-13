import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ICON_CLOSE from '../../assets/icons/student/lesson/close.svg';
import ICON_TIME from '../../assets/icons/student/lesson/time-warning.svg';
import ICON_ATTACH from '../../assets/icons/student/lesson/attach-files.svg';
import styles from './LessonHomeworkModal.module.css';

const TEXT_MAX = 500;
const FILE_MAX_BYTES = 10 * 1024 * 1024;

type LessonHomeworkModalProps = {
  lessonTitle: string;
  teacherName: string;
  deadline: string;
  onClose: () => void;
};

export function LessonHomeworkModal({
  lessonTitle,
  teacherName,
  deadline,
  onClose,
}: LessonHomeworkModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [answer, setAnswer] = useState('');
  const [comment, setComment] = useState('');
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
        aria-labelledby="lesson-homework-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.body}>
          <div className={styles.header}>
            <h2 id="lesson-homework-title" className={styles.title}>
              Отправить домашнее задание
            </h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
              <img src={ICON_CLOSE} alt="" width={17} height={17} />
            </button>
          </div>

          <div className={styles.content}>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>Преподаватель:</span>
              <span className={styles.metaValue}>{teacherName}</span>
            </p>
            <p className={styles.metaRow}>
              <span className={styles.metaLabel}>Урок:</span>
              <span className={styles.metaValue}>{lessonTitle}</span>
            </p>

            <div className={styles.fields}>
              <div className={styles.fieldsInner}>
                <span className={styles.deadline}>
                  <span className={styles.deadlineIcon}>
                    <img src={ICON_TIME} alt="" width={14} height={14} />
                  </span>
                  Дедлайн: {deadline}
                </span>

                <div className={styles.field}>
                  <p className={styles.label}>Текст ответа</p>
                  <div className={styles.box}>
                    <textarea
                      className={styles.textarea}
                      value={answer}
                      maxLength={TEXT_MAX}
                      placeholder="Введите текст вашего ответа...."
                      onChange={(event) => setAnswer(event.target.value.slice(0, TEXT_MAX))}
                    />
                    <p className={styles.counter}>
                      {answer.length}/{TEXT_MAX}
                    </p>
                  </div>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Файл</p>
                  <div className={styles.dropzone}>
                    <button
                      type="button"
                      className={styles.attachBtn}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className={styles.attachIcon}>
                        <img src={ICON_ATTACH} alt="" width={17} height={17} />
                      </span>
                      Прикрепить файлы
                    </button>
                    <p className={styles.fileHint}>{fileName || 'Поддерживается до 10 Мб'}</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className={styles.hiddenInput}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        setFileName('');
                        return;
                      }
                      if (file.size > FILE_MAX_BYTES) {
                        setFileName('');
                        event.target.value = '';
                        return;
                      }
                      setFileName(file.name);
                    }}
                  />
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>
                    Комментарий преподавателю <span className={styles.optional}>(необязательно)</span>
                  </p>
                  <div className={styles.box}>
                    <textarea
                      className={styles.textarea}
                      value={comment}
                      maxLength={TEXT_MAX}
                      placeholder="Напишите комментарий...."
                      onChange={(event) => setComment(event.target.value.slice(0, TEXT_MAX))}
                    />
                    <p className={styles.counter}>
                      {comment.length}/{TEXT_MAX}
                    </p>
                  </div>
                </div>
              </div>

              <p className={styles.note}>Можно отправить текс, файл или оба варианта.</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={styles.btnSend} onClick={onClose}>
            Отправить
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
