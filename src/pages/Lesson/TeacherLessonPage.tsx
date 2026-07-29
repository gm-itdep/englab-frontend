import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import { Button } from '../../components/ui';
import iconLogoMark from '../../assets/icons/teacher/logo-mark.svg';
import iconHome from '../../assets/icons/teacher/home.svg';
import iconCalendar from '../../assets/icons/teacher/calendar.svg';
import iconBook from '../../assets/icons/teacher/book.svg';
import iconStudents from '../../assets/icons/teacher/students.svg';
import iconExit from '../../assets/icons/teacher/exit.svg';
import iconNotification from '../../assets/icons/teacher/notification.svg';
import iconChevron from '../../assets/icons/teacher/chevron.svg';
import iconTime from '../../assets/icons/teacher/time.svg';
import iconCalendarSm from '../../assets/icons/teacher/calendar.svg';
import iconUpload from '../../assets/icons/teacher/upload.svg';
import iconFile from '../../assets/icons/teacher/file.svg';
import iconDownload from '../../assets/icons/teacher/download.svg';
import iconPencilNav from '../../assets/icons/teacher/pencil-nav.svg';
import iconDots from '../../assets/icons/teacher/dots.svg';
import iconEmptyMaterials from '../../assets/icons/teacher/empty-materials.svg';
import iconEmptyNote from '../../assets/icons/teacher/empty-note.svg';
import iconCheck from '../../assets/icons/checkmark.svg';
import imgAvatarTeacher from '../../assets/images/teacher/avatar-teacher.png';
import imgAvatarMobile from '../../assets/images/teacher/avatar-mobile.png';
import imgStudent from '../../assets/images/teacher/student-ivan.png';
import logoEnglab from '../../assets/images/logo-englab.svg';
import styles from './TeacherLessonPage.module.css';

const th = t.teacherHome;
const tl = t.teacherLesson;

type MaterialFile = {
  id: string;
  name: string;
  type: string;
  sizeLabel: string;
  blobUrl?: string;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} Кб`;
  }
  const mb = bytes / (1024 * 1024);
  const rounded = mb >= 10 ? mb.toFixed(0) : mb.toFixed(1).replace('.', ',');
  return `${rounded}Мб`;
}

function getFileType(name: string): string {
  const ext = name.includes('.') ? name.split('.').pop() : '';
  return (ext || 'FILE').toUpperCase();
}

function IconImg({
  src,
  size = 24,
  box,
}: {
  src: string;
  size?: number;
  box?: number;
}) {
  const boxSize = box ?? size;
  return (
    <span className={styles.iconBox} style={{ width: boxSize, height: boxSize }}>
      <img src={src} alt="" width={size} height={size} style={{ width: size, height: size }} />
    </span>
  );
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const topItems = [
    { icon: iconHome, iconSize: 28, label: th.navHome, to: '/home', active: false },
    { icon: iconCalendar, iconSize: 22.4, label: th.navCalendar, to: '/schedule', active: false },
    { icon: iconBook, iconSize: 22.4, label: th.navBook, to: '/lesson', active: true },
    { icon: iconStudents, iconSize: 22.4, label: th.navStudents, to: '/students', active: false },
  ] as const;

  const bottomItems = [
    { icon: iconNotification, iconSize: 22.4, label: th.notifications, onClick: undefined },
    { icon: iconExit, iconSize: 22.4, label: th.logout, onClick: onLogout },
  ] as const;

  return (
    <aside className={styles.sidebar} aria-label="Навигация">
      <div className={styles.logoMark}>
        <img src={logoEnglab} alt={t.common.brand} className={styles.logoFull} width={110} height={27} />
        <img src={iconLogoMark} alt="" className={styles.logoCompact} width={38} height={26} />
      </div>
      <div className={styles.sidebarMenu}>
        <nav className={styles.sidebarNav}>
          {topItems.map((item) => {
            const className = [styles.navBtn, item.active ? styles.navBtnActive : '']
              .filter(Boolean)
              .join(' ');
            return (
              <Link
                key={item.label}
                to={item.to}
                className={className}
                aria-current={item.active ? 'page' : undefined}
                aria-label={item.label}
              >
                <IconImg src={item.icon} box={32} size={item.iconSize} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarBottom}>
          {bottomItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={styles.navBtn}
              aria-label={item.label}
              onClick={item.onClick}
            >
              <IconImg src={item.icon} box={32} size={item.iconSize} />
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarTitles}>
        <h1 className={styles.title}>{tl.title}</h1>
        <p className={styles.subtitle}>{tl.subtitle}</p>
      </div>
      <div className={styles.topbarActions}>
        <button type="button" className={styles.iconButton} aria-label={th.notifications}>
          <IconImg src={iconNotification} box={32} size={22.4} />
        </button>
        <button type="button" className={styles.userChip}>
          <span className={styles.userChipProfile}>
            <img src={imgAvatarTeacher} alt="" className={styles.userAvatar} width={32} height={32} />
            <span className={styles.userName}>{th.teacherName}</span>
          </span>
          <span className={styles.userChevron}>
            <img src={iconChevron} alt="" width={9} height={5} />
          </span>
        </button>
        <button type="button" className={styles.mobileAvatarBtn} aria-label={th.teacherName}>
          <img src={imgAvatarMobile} alt="" width={32} height={32} />
        </button>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Мобильная навигация">
      <Link to="/home" className={styles.bottomNavItem}>
        <IconImg src={iconHome} box={32} size={22.4} />
        <span>{th.mobileNavHome}</span>
      </Link>
      <Link to="/schedule" className={styles.bottomNavItem}>
        <IconImg src={iconCalendar} box={32} size={22.4} />
        <span>{th.mobileNavSchedule}</span>
      </Link>
      <button type="button" className={styles.bottomNavItem}>
        <IconImg src={iconPencilNav} box={32} size={28} />
        <span>{th.mobileNavSlot}</span>
      </button>
      <Link
        to="/lesson"
        className={`${styles.bottomNavItem} ${styles.bottomNavActive}`}
        aria-current="page"
      >
        <IconImg src={iconBook} box={32} size={22.4} />
        <span>{th.mobileNavLessons}</span>
      </Link>
      <button type="button" className={styles.bottomNavItem}>
        <IconImg src={iconDots} box={32} size={22.4} />
        <span>{th.mobileNavMore}</span>
      </button>
    </nav>
  );
}

export function TeacherLessonPage() {
  const session = getSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEmptyLesson = searchParams.get('empty') === '1';
  const [lessonStatus, setLessonStatus] = useState<'new' | 'ready' | 'completed'>(
    isEmptyLesson ? 'new' : 'ready',
  );
  const [uploadedMaterials, setUploadedMaterials] = useState<MaterialFile[]>([]);
  const [noteAbout, setNoteAbout] = useState(isEmptyLesson ? '' : tl.noteAboutText);
  const [noteNext, setNoteNext] = useState(isEmptyLesson ? '' : tl.noteNextText);
  const noteAboutRef = useRef<HTMLTextAreaElement>(null);
  const noteNextRef = useRef<HTMLTextAreaElement>(null);
  const uploadedMaterialsRef = useRef(uploadedMaterials);
  uploadedMaterialsRef.current = uploadedMaterials;

  const resizeNoteInput = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const demoMaterials = useMemo<MaterialFile[]>(
    () =>
      tl.files.map((file, index) => ({
        id: `demo-${file.type}-${index}`,
        name: tl.fileName,
        type: file.type,
        sizeLabel: file.size,
      })),
    [],
  );

  useEffect(() => {
    const empty = searchParams.get('empty') === '1';
    setLessonStatus(empty ? 'new' : 'ready');
    setNoteAbout(empty ? '' : tl.noteAboutText);
    setNoteNext(empty ? '' : tl.noteNextText);
    setUploadedMaterials((prev) => {
      prev.forEach((item) => {
        if (item.blobUrl) URL.revokeObjectURL(item.blobUrl);
      });
      return [];
    });
  }, [searchParams]);

  useEffect(() => {
    resizeNoteInput(noteAboutRef.current);
  }, [noteAbout]);

  useEffect(() => {
    resizeNoteInput(noteNextRef.current);
  }, [noteNext]);

  useEffect(() => {
    return () => {
      uploadedMaterialsRef.current.forEach((item) => {
        if (item.blobUrl) URL.revokeObjectURL(item.blobUrl);
      });
    };
  }, []);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const isNew = lessonStatus === 'new';
  const isCompleted = lessonStatus === 'completed';
  const isPrimaryDisabled = isNew || isCompleted;
  const primaryActionLabel = isCompleted ? tl.statusCompleted : tl.enterLesson;
  const primaryActionClass = [
    styles.enterBtn,
    isPrimaryDisabled ? styles.enterBtnDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');
  const ghostBtnClass = [styles.ghostBtn, isNew ? styles.ghostBtnDisabled : '']
    .filter(Boolean)
    .join(' ');

  const materials = [...(isNew ? [] : demoMaterials), ...uploadedMaterials];
  const showMaterialsEmpty = materials.length === 0;
  const notesHaveContent = noteAbout.trim().length > 0 || noteNext.trim().length > 0;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected?.length) return;

    const next: MaterialFile[] = Array.from(selected).map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      type: getFileType(file.name),
      sizeLabel: formatFileSize(file.size),
      blobUrl: URL.createObjectURL(file),
    }));

    setUploadedMaterials((prev) => [...prev, ...next]);
    event.target.value = '';
  };

  const handleDownload = (file: MaterialFile) => {
    if (!file.blobUrl) return;
    const link = document.createElement('a');
    link.href = file.blobUrl;
    link.download = file.name;
    link.click();
  };

  const focusNotes = () => {
    noteAboutRef.current?.focus();
  };

  const uploadButton = (
    <Button
      type="button"
      variant="secondary"
      className={styles.uploadBtn}
      onClick={openFilePicker}
      startIcon={<img src={iconUpload} alt="" width={28} height={28} className={styles.uploadIcon} />}
    >
      {tl.uploadMaterials}
    </Button>
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Sidebar onLogout={handleLogout} />
        <div className={styles.main}>
          <Topbar />

          <div className={styles.content}>
            <div className={styles.primaryCol}>
              <section className={`${styles.lessonCard} ${styles.orderLesson}`}>
                <div className={styles.lessonHeader}>
                  <span className={styles.statusBadge}>
                    <img src={iconCheck} alt="" width={14} height={14} />
                    {tl.statusScheduled}
                  </span>
                  <button
                    type="button"
                    className={`${primaryActionClass} ${styles.enterBtnDesktop}`}
                    disabled={isPrimaryDisabled}
                  >
                    {primaryActionLabel}
                  </button>
                </div>
                <div className={styles.lessonBody}>
                  <div className={styles.lessonInfo}>
                    <h2 className={styles.lessonTopic}>{tl.topic}</h2>
                    <div className={styles.lessonMeta}>
                      <span className={styles.metaItem}>
                        <img src={iconCalendarSm} alt="" width={14} height={14} />
                        {tl.date}
                      </span>
                      <span className={styles.metaItem}>
                        <img src={iconTime} alt="" width={14} height={14} />
                        {tl.time}
                      </span>
                    </div>
                  </div>
                  <div className={styles.statusActions}>
                    <button
                      type="button"
                      className={ghostBtnClass}
                      disabled={isNew}
                      onClick={() => setLessonStatus('completed')}
                    >
                      {tl.markConducted}
                    </button>
                    <button type="button" className={ghostBtnClass} disabled={isNew}>
                      {tl.markCancelled}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${primaryActionClass} ${styles.enterBtnMobile}`}
                  disabled={isPrimaryDisabled}
                >
                  {primaryActionLabel}
                </button>
              </section>

              <section className={`${styles.card} ${styles.materialsCard} ${styles.orderMaterials}`}>
                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  className={styles.fileInput}
                  multiple
                  onChange={handleFilesSelected}
                />
                {showMaterialsEmpty ? (
                  <>
                    <div className={styles.emptyBlock}>
                      <h2 className={styles.cardTitle}>{tl.materials}</h2>
                      <div className={styles.emptyContent}>
                        <span className={styles.emptyIcon}>
                          <img src={iconEmptyMaterials} alt="" width={56} height={56} />
                        </span>
                        <div className={styles.emptyText}>
                          <p className={styles.emptyTitle}>{tl.materialsEmptyTitle}</p>
                          <p className={styles.emptySubtitle}>{tl.materialsEmptyText}</p>
                        </div>
                      </div>
                    </div>
                    {uploadButton}
                  </>
                ) : (
                  <>
                    <div className={styles.materialsBody}>
                      <div className={styles.materialsHead}>
                        <h2 className={styles.cardTitle}>{tl.materials}</h2>
                      </div>
                      <div className={styles.materialsSpacer} aria-hidden="true" />
                      <ul className={styles.fileList}>
                        {materials.map((file) => (
                          <li key={file.id} className={styles.fileItem}>
                            <div className={styles.fileIconsRow}>
                              <span className={styles.fileIcon}>
                                <img src={iconFile} alt="" width={28} height={28} />
                              </span>
                              <button
                                type="button"
                                className={styles.downloadBtn}
                                aria-label={tl.downloadFile}
                                onClick={() => handleDownload(file)}
                                disabled={!file.blobUrl}
                              >
                                <img src={iconDownload} alt="" width={28} height={28} />
                              </button>
                            </div>
                            <div className={styles.fileInfo}>
                              <span className={styles.fileIconDesktop}>
                                <img src={iconFile} alt="" width={28} height={28} />
                              </span>
                              <div className={styles.fileText}>
                                <span className={styles.fileName}>{file.name}</span>
                                <span className={styles.fileMeta}>
                                  <span>{file.type}</span>
                                  <span className={styles.fileDot} aria-hidden="true" />
                                  <span>{file.sizeLabel}</span>
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`${styles.downloadBtn} ${styles.downloadBtnDesktop}`}
                              aria-label={tl.downloadFile}
                              onClick={() => handleDownload(file)}
                              disabled={!file.blobUrl}
                            >
                              <img src={iconDownload} alt="" width={28} height={28} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {uploadButton}
                  </>
                )}
              </section>

              <section className={`${styles.card} ${styles.homeworkCard} ${styles.orderHomework}`}>
                {isNew ? (
                  <div className={styles.homeworkEmpty}>
                    <h2 className={styles.cardTitle}>{tl.homework}</h2>
                    <div className={styles.emptyContent}>
                      <span className={styles.emptyIcon}>
                        <img src={iconEmptyNote} alt="" width={56} height={56} />
                      </span>
                      <div className={styles.emptyText}>
                        <p className={styles.emptyTitle}>{tl.homeworkEmptyTitle}</p>
                        <p className={styles.emptySubtitle}>{tl.homeworkEmptyText}</p>
                      </div>
                    </div>
                    <Button type="button" variant="secondary" className={styles.homeworkBtn} fullWidth>
                      {tl.addHomework}
                    </Button>
                  </div>
                ) : (
                  <div className={styles.homeworkLayout}>
                    <span className={`${styles.deadlineBadge} ${styles.deadlineMobile}`}>{tl.homeworkDeadline}</span>
                    <div className={styles.homeworkContent}>
                      <div className={styles.homeworkTitles}>
                        <h2 className={styles.cardTitle}>{tl.homework}</h2>
                        <p className={styles.homeworkSubtitle}>{tl.homeworkTitle}</p>
                      </div>
                      <p className={styles.homeworkText}>{tl.homeworkText}</p>
                    </div>
                    <div className={styles.homeworkAside}>
                      <span className={`${styles.deadlineBadge} ${styles.deadlineDesktop}`}>{tl.homeworkDeadline}</span>
                      <Button type="button" variant="secondary" className={styles.homeworkBtn}>
                        {tl.addHomework}
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              <section className={`${styles.card} ${styles.noteCard} ${styles.orderNotes}`}>
                <div className={styles.noteHeader}>
                  <h2 className={styles.cardTitle}>{tl.noteTitle}</h2>
                  <Button
                    type="button"
                    variant="outline"
                    className={`${styles.noteEditBtn} ${styles.noteEditDesktop}`}
                    onClick={focusNotes}
                  >
                    <span className={styles.noteEditLabel}>{notesHaveContent ? tl.noteEdit : tl.noteAdd}</span>
                  </Button>
                </div>
                <div className={styles.noteGrid}>
                  <label className={styles.noteBlock}>
                    <span className={styles.noteLabel}>{tl.noteAboutLabel}</span>
                    <textarea
                      ref={noteAboutRef}
                      className={styles.noteInput}
                      value={noteAbout}
                      onChange={(event) => setNoteAbout(event.target.value)}
                      placeholder={tl.noteAboutPlaceholder}
                      rows={1}
                    />
                  </label>
                  <label className={styles.noteBlock}>
                    <span className={styles.noteLabel}>{tl.noteNextLabel}</span>
                    <textarea
                      ref={noteNextRef}
                      className={styles.noteInput}
                      value={noteNext}
                      onChange={(event) => setNoteNext(event.target.value)}
                      placeholder={tl.noteNextPlaceholder}
                      rows={1}
                    />
                  </label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className={`${styles.noteEditBtn} ${styles.noteEditMobile}`}
                  fullWidth
                  onClick={focusNotes}
                >
                  {notesHaveContent ? tl.noteEdit : tl.noteAdd}
                </Button>
              </section>
            </div>

            <aside className={styles.sideCol}>
              <section className={`${styles.studentCard} ${styles.orderStudent}`}>
                <img src={imgStudent} alt="" className={styles.studentPhoto} />
                <div className={styles.studentBody}>
                  <h2 className={styles.studentName}>{tl.studentName}</h2>
                  <div className={styles.studentParams}>
                    <p className={styles.paramRow}>
                      <span className={styles.paramLabel}>{tl.studentGoalLabel}:</span>
                      <span className={styles.paramValue}>{tl.studentGoal}</span>
                    </p>
                    <p className={styles.paramRow}>
                      <span className={styles.paramLabel}>{tl.studentLevelLabel}:</span>
                      <span className={styles.paramValue}>{tl.studentLevel}</span>
                    </p>
                    <p className={styles.paramRow}>
                      <span className={styles.paramLabel}>{tl.studentTimeLabel}:</span>
                      <span className={styles.paramValue}>{tl.studentTime}</span>
                    </p>
                  </div>
                </div>
              </section>

              <section className={`${styles.connectionCard} ${styles.orderConnection}`}>
                <h2 className={styles.cardTitle}>{tl.connection}</h2>
                <div className={styles.connectionBody}>
                  <p className={styles.connectionText}>{tl.connectionPlatform}</p>
                  <p className={styles.connectionText}>{tl.connectionLink}</p>
                  <p className={styles.connectionText}>{tl.connectionHint}</p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </main>
  );
}

export default TeacherLessonPage;
