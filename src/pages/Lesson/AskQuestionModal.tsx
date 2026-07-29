import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { Button } from '../../components/ui';
import { t } from '../../shared/i18n';
import iconClose from '../../assets/icons/modal-close.svg';
import iconLink from '../../assets/icons/teacher/link.svg';
import styles from './AskQuestionModal.module.css';

const tm = t.teacherLesson.questionModal;
const MAX_LENGTH = 500;

type AskQuestionModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AskQuestionModal({ open, onClose }: AskQuestionModalProps) {
  const titleId = useId();
  const fileInputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setText('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    onClose();
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAttachedFile(file);
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {tm.title}
            </h2>
            <button type="button" className={styles.closeBtn} aria-label={tm.close} onClick={onClose}>
              <img src={iconClose} alt="" width={22} height={22} />
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.metaList}>
              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>{tm.lessonLabel}:</span>
                <span className={styles.metaValue}>{tm.lessonValue}</span>
              </p>
              <p className={styles.metaRow}>
                <span className={styles.metaLabel}>{tm.studentLabel}:</span>
                <span className={styles.metaValue}>{tm.studentValue}</span>
              </p>
            </div>

            <div className={styles.formBlock}>
              <p className={styles.hint}>{tm.hint}</p>
              <label className={styles.textareaWrap}>
                <textarea
                  ref={textareaRef}
                  className={styles.textarea}
                  value={text}
                  maxLength={MAX_LENGTH}
                  placeholder={tm.placeholder}
                  onChange={(event) => setText(event.target.value)}
                  aria-label={tm.placeholder}
                />
                <span className={styles.counter}>
                  {tm.counter.replace('{count}', String(text.length))}
                </span>
              </label>
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                className={styles.fileInput}
                onChange={handleFileSelected}
              />
              <button type="button" className={styles.attachBtn} onClick={openFilePicker}>
                <span className={styles.attachIcon}>
                  <img src={iconLink} alt="" width={14} height={14} />
                </span>
                <span className={styles.attachLabel}>
                  {attachedFile ? attachedFile.name : tm.attachFile}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="outline" className={styles.cancelBtn} onClick={onClose}>
            {tm.cancel}
          </Button>
          <Button type="button" variant="primary" className={styles.submitBtn} onClick={handleSubmit}>
            {tm.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
