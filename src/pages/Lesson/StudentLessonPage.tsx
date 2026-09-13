import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import PHOTO_PETR from '../../assets/images/student/teachers/petr.png';
import ICON_CHECK from '../../assets/icons/student/topup/check.svg';
import ICON_CALENDAR from '../../assets/icons/student/booking/calendar-sm.svg';
import ICON_TIME from '../../assets/icons/student/booking/time-sm.svg';
import ICON_FILE from '../../assets/icons/student/file.svg';
import ICON_DOWNLOAD from '../../assets/icons/student/lesson/download.svg';
import ICON_STAR from '../../assets/icons/student/booking/star.svg';
import ICON_EMPTY_MATERIALS from '../../assets/icons/student/lesson/empty-materials.svg';
import ICON_EMPTY_HOMEWORK from '../../assets/icons/student/empty-homework.svg';
import { LessonAskModal } from './LessonAskModal';
import { LessonHomeworkModal } from './LessonHomeworkModal';
import styles from './StudentLessonPage.module.css';

const FILES = [
  { id: '1', name: 'Название файла', meta: ['Параметр файла', 'Параметр файла'] },
  { id: '2', name: 'Название файла', meta: ['Параметр файла', 'Параметр файла'] },
  { id: '3', name: 'Название файла', meta: ['Параметр файла', 'Параметр файла'] },
];

const NOTE_DEFAULT =
  'Подготовьте 5 коротких ответов на возражения по теме урока.\nИспользуйте фразы из материалов и лексику из урока.';

const NOTE_PLACEHOLDER = 'Сохраните важные фразы, выводы и мысли по занятию';

function FileItem({ name, meta }: { name: string; meta: string[] }) {
  return (
    <div className={styles.fileItem}>
      <span className={styles.fileIcon}>
        <img src={ICON_FILE} alt="" width={28} height={28} />
      </span>
      <div className={styles.fileBody}>
        <p className={styles.fileName}>{name}</p>
        <p className={styles.fileMeta}>
          {meta[0]}
          <span className={styles.fileDot} aria-hidden="true">
            •
          </span>
          {meta[1]}
        </p>
      </div>
      <button type="button" className={styles.downloadBtn} aria-label="Скачать">
        <img src={ICON_DOWNLOAD} alt="" width={28} height={28} />
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: ReactNode;
}) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>
        <img src={icon} alt="" width={56} height={56} />
      </span>
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptyDesc}>{description}</p>
      </div>
    </div>
  );
}

export function StudentLessonPage() {
  const [searchParams] = useSearchParams();
  const isEmpty = searchParams.get('empty') === '1';
  const [note, setNote] = useState(isEmpty ? '' : NOTE_DEFAULT);
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(isEmpty ? '' : NOTE_DEFAULT);
  const [askOpen, setAskOpen] = useState(searchParams.get('ask') === '1');
  const [homeworkOpen, setHomeworkOpen] = useState(searchParams.get('hw') === '1');
  const hasNote = note.trim().length > 0;

  return (
    <StudentLayout
      title="Страница урока"
      subtitle="Рабочая сессия и материалы"
      activeNav="schedule"
      hideMobileSearch
    >
      <div className={styles.layout}>
        <section className={styles.lessonCard} aria-label="Урок">
          <div className={styles.lessonTop}>
            <span className={styles.statusBadge}>
              <span className={styles.statusIcon}>
                <img src={ICON_CHECK} alt="" width={14} height={14} />
              </span>
              Запланирован
            </span>
            <button type="button" className={styles.btnJoin} disabled={isEmpty}>
              Войти в урок
            </button>
          </div>
          <div className={styles.lessonBody}>
            <h2 className={styles.lessonTitle}>Грамматика</h2>
            <div className={styles.lessonMeta}>
              <p className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <img src={ICON_CALENDAR} alt="" width={14} height={14} />
                </span>
                8 июля 2026, понедельник
              </p>
              <p className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <img src={ICON_TIME} alt="" width={14} height={14} />
                </span>
                19:00 - 20:00 (UTC +3, Москва)
              </p>
            </div>
            <div className={styles.mobileStatusActions}>
              <button type="button" className={styles.btnOutline}>
                Проведён
              </button>
              <button type="button" className={styles.btnOutline}>
                Не состоялся
              </button>
            </div>
          </div>
          <button type="button" className={styles.btnJoinMobile} disabled={isEmpty}>
            Войти в урок
          </button>
        </section>

        <aside className={styles.side}>
          <section className={styles.teacherCard} aria-label="Преподаватель">
            <img src={PHOTO_PETR} alt="" className={styles.teacherPhoto} width={275} height={320} />
            <div className={styles.teacherInfo}>
              <div className={styles.teacherNameBlock}>
                <h2 className={styles.teacherName}>Пётр Васильев</h2>
                <p className={styles.teacherRating}>
                  <span className={styles.starIcon}>
                    <img src={ICON_STAR} alt="" width={17} height={17} />
                  </span>
                  4,9
                </p>
              </div>
              <div className={styles.teacherParams}>
                <p className={styles.teacherLang}>
                  Английский
                  <span className={styles.fileDot} aria-hidden="true">
                    •
                  </span>
                  Британский акцент
                </p>
                <div className={styles.tagRow}>
                  <span className={styles.tag}>Business</span>
                  <span className={styles.tag}>Speaking</span>
                  <span className={styles.tag}>Interview</span>
                </div>
                <p className={styles.teacherLevels}>
                  <span className={styles.levelsLabel}>Уровни:</span>
                  <span>A2-C1</span>
                </p>
              </div>
            </div>
            <div className={styles.teacherActions}>
              <button type="button" className={styles.btnOutline} onClick={() => setAskOpen(true)}>
                Задать вопрос
              </button>
              <button type="button" className={styles.btnGhost}>
                Пожаловаться
              </button>
            </div>
          </section>

          <section className={styles.hintCard} aria-label="Подключение">
            <h2 className={styles.cardTitle}>Подключение</h2>
            <div className={styles.hintText}>
              <p>Платформа: Яндекс Телемост</p>
              <p>Ссылка откроется в отдельной вкладке браузера</p>
              <p>Перед уроком проверьте камеру, микрофон и стабильность интернета</p>
            </div>
          </section>
        </aside>

        <section
          className={[styles.filesCard, isEmpty ? styles.filesCardEmpty : ''].filter(Boolean).join(' ')}
          aria-label="Материалы"
        >
          <h2 className={styles.cardTitle}>Материалы</h2>
          {isEmpty ? (
            <EmptyState
              icon={ICON_EMPTY_MATERIALS}
              title="Материалы пока не добавлены"
              description="Преподаватель сможет прикрепить файлы и ссылки ближе к занятию."
            />
          ) : (
            <div className={styles.fileList}>
              {FILES.map((file) => (
                <FileItem key={file.id} name={file.name} meta={file.meta} />
              ))}
            </div>
          )}
        </section>

        <section
          className={[styles.homeworkCard, isEmpty ? styles.homeworkCardEmpty : '']
            .filter(Boolean)
            .join(' ')}
          aria-label="Домашнее задание"
        >
          {isEmpty ? (
            <>
              <h2 className={styles.cardTitle}>Домашнее задание</h2>
              <EmptyState
                icon={ICON_EMPTY_HOMEWORK}
                title="Домашнее задание пока не задано"
                description="После урока задание появится здесь, если преподаватель его добавит."
              />
            </>
          ) : (
            <>
              <div className={styles.homeworkBadges}>
                <span className={styles.badgeInfo}>Дедлайн: 12 июля 2026</span>
                <span className={styles.badgeError}>Не отправлено</span>
              </div>
              <div className={styles.homeworkContent}>
                <div className={styles.homeworkHead}>
                  <h2 className={styles.cardTitle}>Домашнее задание</h2>
                  <p className={styles.homeworkSubtitle}>Практика: ответы на возражения</p>
                </div>
                <p className={styles.homeworkDesc}>
                  Подготовьте 5 коротких ответов на возражения по теме урока.
                  <br />
                  Используйте фразы из материалов и лексику из урока.
                </p>
              </div>
              <button
                type="button"
                className={styles.btnOutline}
                onClick={() => setHomeworkOpen(true)}
              >
                Прикрепить домашнее задание
              </button>
            </>
          )}
        </section>

        <section
          className={[styles.noteCard, !hasNote && !editingNote ? styles.noteCardEmpty : '']
            .filter(Boolean)
            .join(' ')}
          aria-label="Личная заметка"
        >
          <div className={styles.noteText}>
            <h2 className={styles.cardTitle}>Личная заметка к уроку</h2>
            {editingNote ? (
              <textarea
                className={styles.noteInput}
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                rows={3}
              />
            ) : (
              <p className={hasNote ? styles.noteBody : styles.notePlaceholder}>
                {hasNote
                  ? note.split('\n').map((line, index) => (
                      <span key={`note-${index}`}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))
                  : NOTE_PLACEHOLDER}
              </p>
            )}
          </div>
          <button
            type="button"
            className={editingNote ? styles.btnPrimary : styles.btnCancel}
            onClick={() => {
              if (editingNote) {
                setNote(draftNote);
                setEditingNote(false);
                return;
              }
              setDraftNote(note);
              setEditingNote(true);
            }}
          >
            {editingNote ? 'Сохранить' : hasNote ? 'Изменить' : 'Добавить заметку'}
          </button>
        </section>
      </div>

      {askOpen ? (
        <LessonAskModal
          lessonTitle="Business Small Talk"
          teacherName="Пётр Васильев"
          onClose={() => setAskOpen(false)}
        />
      ) : null}
      {homeworkOpen ? (
        <LessonHomeworkModal
          lessonTitle="Business Small Talk"
          teacherName="Пётр Васильев"
          deadline="13 июля 2026"
          onClose={() => setHomeworkOpen(false)}
        />
      ) : null}
    </StudentLayout>
  );
}
