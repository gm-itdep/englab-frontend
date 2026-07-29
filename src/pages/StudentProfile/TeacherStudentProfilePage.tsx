import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import iconLogoMark from '../../assets/icons/teacher/logo-mark.svg';
import iconHome from '../../assets/icons/teacher/home.svg';
import iconCalendar from '../../assets/icons/teacher/calendar.svg';
import iconBook from '../../assets/icons/teacher/book.svg';
import iconStudents from '../../assets/icons/teacher/students.svg';
import iconExit from '../../assets/icons/teacher/exit.svg';
import iconNotification from '../../assets/icons/teacher/notification.svg';
import iconChevron from '../../assets/icons/teacher/chevron.svg';
import iconTravel from '../../assets/icons/teacher/travel.svg';
import iconPencilNav from '../../assets/icons/teacher/pencil-nav.svg';
import iconDots from '../../assets/icons/teacher/dots.svg';
import iconEmptyPencil from '../../assets/icons/teacher/empty-pencil.svg';
import iconEmptyCoffee from '../../assets/icons/teacher/empty-coffee.svg';
import iconEmptyBook from '../../assets/icons/teacher/empty-book.svg';
import imgAvatarTeacher from '../../assets/images/teacher/avatar-teacher.png';
import imgAvatarMobile from '../../assets/images/teacher/avatar-mobile.png';
import imgStudent from '../../assets/images/teacher/student-ivan.png';
import logoEnglab from '../../assets/images/logo-englab.svg';
import { AskQuestionModal } from '../Lesson/AskQuestionModal';
import styles from './TeacherStudentProfilePage.module.css';

const th = t.teacherHome;
const tp = t.teacherStudentProfile;

type LessonStatus = 'soon' | 'confirmed' | 'cancelled';
type HomeworkStatus = 'done' | 'review' | 'notSent';

const LESSONS: { status: LessonStatus }[] = [
  { status: 'soon' },
  { status: 'confirmed' },
  { status: 'cancelled' },
];

const HOMEWORKS: { status: HomeworkStatus }[] = [
  { status: 'done' },
  { status: 'review' },
  { status: 'done' },
  { status: 'notSent' },
  { status: 'notSent' },
];

const LESSON_BADGE: Record<LessonStatus, { label: string; className: string }> = {
  soon: { label: tp.statusSoon, className: styles.badgeSoon },
  confirmed: { label: tp.statusConfirmed, className: styles.badgeConfirmed },
  cancelled: { label: tp.statusCancelled, className: styles.badgeCancelled },
};

const HOMEWORK_BADGE: Record<HomeworkStatus, { label: string; className: string }> = {
  done: { label: tp.homeworkDone, className: styles.badgeDone },
  review: { label: tp.homeworkReview, className: styles.badgeReview },
  notSent: { label: tp.homeworkNotSent, className: styles.badgeNotSent },
};

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

function Sidebar({
  expanded,
  onToggle,
  onLogout,
}: {
  expanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  const topItems = [
    { icon: iconHome, iconSize: 28, label: th.navHome, to: '/home', active: false },
    { icon: iconCalendar, iconSize: 22.4, label: th.navCalendar, to: '/schedule', active: false },
    { icon: iconBook, iconSize: 22.4, label: th.navBook, to: '/lesson', active: false },
    { icon: iconStudents, iconSize: 22.4, label: th.navStudents, to: '/students', active: true },
  ] as const;

  const bottomItems = [
    { icon: iconNotification, iconSize: 22.4, label: th.notifications, onClick: undefined },
    { icon: iconExit, iconSize: 22.4, label: th.logout, onClick: onLogout },
  ] as const;

  return (
    <aside
      className={[styles.sidebar, expanded ? styles.sidebarExpanded : ''].filter(Boolean).join(' ')}
      aria-label="Навигация"
    >
      <button
        type="button"
        className={styles.logoMark}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={expanded ? th.navCollapse : th.navExpand}
      >
        {expanded ? (
          <img src={logoEnglab} alt={t.common.brand} className={styles.logoFull} width={110} height={27} />
        ) : (
          <img src={iconLogoMark} alt={t.common.brand} className={styles.logoCompact} width={38} height={26} />
        )}
      </button>
      <div className={styles.sidebarMenu}>
        <nav className={styles.sidebarNav}>
          {topItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={[styles.navBtn, item.active ? styles.navBtnActive : ''].filter(Boolean).join(' ')}
              aria-current={item.active ? 'page' : undefined}
              aria-label={item.label}
            >
              <IconImg src={item.icon} box={32} size={item.iconSize} />
              {expanded ? <span className={styles.navLabel}>{item.label}</span> : null}
            </Link>
          ))}
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
              {expanded ? <span className={styles.navLabel}>{item.label}</span> : null}
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
        <h1 className={styles.title}>{tp.title}</h1>
        <p className={styles.subtitle}>{tp.subtitle}</p>
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

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <p className={styles.paramRow}>
      <span className={styles.paramLabel}>{label}:</span>
      <span className={styles.paramValue}>{value}</span>
    </p>
  );
}

function StudentSummaryCard({ onAsk }: { onAsk: () => void }) {
  return (
    <section className={styles.summaryCard}>
      <div className={styles.summaryBody}>
        <img src={imgStudent} alt="" className={styles.summaryPhoto} width={275} height={320} />
        <div className={styles.summaryInfo}>
          <h2 className={styles.summaryName}>{tp.studentName}</h2>
          <div className={styles.summaryParams}>
            <ParamRow label={tp.goalLabel} value={tp.goalValue} />
            <ParamRow label={tp.levelLabel} value={tp.levelValue} />
            <ParamRow label={tp.timeLabel} value={tp.timeValue} />
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <IconImg src={iconCalendar} box={40} size={22.4} />
              <div className={styles.statText}>
                <span className={styles.statLabel}>{tp.nextLessonLabel}</span>
                <span className={styles.statValue}>{tp.nextLessonValue}</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <IconImg src={iconTravel} box={40} size={22.4} />
              <div className={styles.statText}>
                <span className={styles.statLabel}>{tp.totalLessonsLabel}</span>
                <span className={styles.statValue}>{tp.totalLessonsValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.summaryActions}>
        <button type="button" className={styles.secondaryBtn} onClick={onAsk}>
          {tp.askQuestion}
        </button>
        <button type="button" className={styles.ghostBtn}>
          {tp.complain}
        </button>
      </div>
    </section>
  );
}

function EmptyBlock({
  icon,
  iconSize,
  boxSize,
  title,
  description,
}: {
  icon: string;
  iconSize: number;
  boxSize: number;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.emptyBlock}>
      <span className={styles.emptyIcon} style={{ width: boxSize, height: boxSize }}>
        <img src={icon} alt="" width={iconSize} height={iconSize} />
      </span>
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptyDesc}>{description}</p>
      </div>
    </div>
  );
}

function NotesCard({ empty }: { empty: boolean }) {
  if (empty) {
    return (
      <section className={`${styles.notesCard} ${styles.notesCardEmpty}`}>
        <div className={styles.notesTitles}>
          <h2 className={styles.cardTitle}>{tp.notesTitle}</h2>
          <p className={styles.notesSubtitle}>{tp.notesSubtitle}</p>
        </div>
        <EmptyBlock
          icon={iconEmptyPencil}
          iconSize={70}
          boxSize={100}
          title={tp.notesEmptyTitle}
          description={tp.notesEmptyDescription}
        />
        <button type="button" className={`${styles.secondaryBtn} ${styles.notesAddBtn}`}>
          {tp.notesAdd}
        </button>
      </section>
    );
  }

  return (
    <section className={styles.notesCard}>
      <div className={styles.notesHeader}>
        <div className={styles.notesTitles}>
          <h2 className={styles.cardTitle}>{tp.notesTitle}</h2>
          <p className={styles.notesSubtitle}>{tp.notesSubtitle}</p>
        </div>
        <button type="button" className={`${styles.secondaryBtn} ${styles.notesEditDesktop}`}>
          {tp.notesEdit}
        </button>
      </div>
      <div className={styles.notesBody}>
        <p className={styles.notesLabel}>{tp.notesLabel}</p>
        <p className={styles.notesText}>{tp.notesBody}</p>
      </div>
      <button type="button" className={`${styles.secondaryBtn} ${styles.notesEditMobile}`}>
        {tp.notesEdit}
      </button>
    </section>
  );
}

function LessonsCard({ empty }: { empty: boolean }) {
  if (empty) {
    return (
      <section className={`${styles.listCard} ${styles.listCardEmpty}`}>
        <h2 className={styles.cardTitle}>{tp.lessonsTitle}</h2>
        <EmptyBlock
          icon={iconEmptyCoffee}
          iconSize={70}
          boxSize={100}
          title={tp.lessonsEmptyTitle}
          description={tp.lessonsEmptyDescription}
        />
        <Link to="/schedule" className={`${styles.secondaryBtnWide} ${styles.secondaryBtnMuted}`}>
          {tp.goToSchedule}
        </Link>
      </section>
    );
  }

  return (
    <section className={`${styles.listCard} ${styles.listCardLessons}`}>
      <h2 className={styles.cardTitle}>{tp.lessonsTitle}</h2>
      <div className={styles.listStack}>
        {LESSONS.map((lesson) => {
          const badge = LESSON_BADGE[lesson.status];
          return (
            <article key={lesson.status} className={styles.lessonItem}>
              <div className={styles.lessonTop}>
                <span className={styles.lessonTime}>{tp.lessonTime}</span>
                <span className={`${styles.badge} ${badge.className}`}>{badge.label}</span>
              </div>
              <div className={styles.lessonBody}>
                <img src={imgAvatarTeacher} alt="" className={styles.lessonAvatar} width={32} height={32} />
                <div className={styles.lessonText}>
                  <span className={styles.lessonTeacher}>{tp.lessonTeacher}</span>
                  <span className={styles.lessonTopic}>{tp.lessonTopic}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Link to="/schedule" className={styles.secondaryBtnWide}>
        {tp.goToSchedule}
      </Link>
    </section>
  );
}

function HomeworkCard({ empty }: { empty: boolean }) {
  if (empty) {
    return (
      <section className={`${styles.listCard} ${styles.listCardEmpty} ${styles.homeworkEmpty}`}>
        <h2 className={styles.cardTitle}>{tp.homeworkTitle}</h2>
        <div className={styles.homeworkEmptyBody}>
          <EmptyBlock
            icon={iconEmptyBook}
            iconSize={56}
            boxSize={80}
            title={tp.homeworkEmptyTitle}
            description={tp.homeworkEmptyDescription}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.listCard} ${styles.listCardHomework}`}>
      <h2 className={styles.cardTitle}>{tp.homeworkTitle}</h2>
      <div className={styles.listStack}>
        {HOMEWORKS.map((item, index) => {
          const badge = HOMEWORK_BADGE[item.status];
          return (
            <article key={`${item.status}-${index}`} className={styles.homeworkItem}>
              <div className={styles.homeworkText}>
                <span className={styles.homeworkDate}>{tp.homeworkDate}</span>
                <span className={styles.homeworkName}>{tp.homeworkName}</span>
              </div>
              <span className={`${styles.badge} ${badge.className}`}>{badge.label}</span>
            </article>
          );
        })}
      </div>
    </section>
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
      <button type="button" className={`${styles.bottomNavItem} ${styles.bottomNavSlot}`}>
        <IconImg src={iconPencilNav} box={32} size={28} />
        <span>{th.mobileNavSlot}</span>
      </button>
      <Link to="/lesson" className={styles.bottomNavItem}>
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

export function TeacherStudentProfilePage() {
  const session = getSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const isEmpty = searchParams.get('empty') === '1';

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <main className={styles.page}>
      <div
        className={[styles.shell, sidebarExpanded ? styles.shellExpanded : ''].filter(Boolean).join(' ')}
      >
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((value) => !value)}
          onLogout={handleLogout}
        />
        <div className={styles.main}>
          <Topbar />
          <div className={styles.content}>
            <div className={styles.primaryCol}>
              <div className={styles.summaryMobile}>
                <StudentSummaryCard onAsk={() => setQuestionOpen(true)} />
              </div>
              <NotesCard empty={isEmpty} />
              <div className={styles.listsRow}>
                <LessonsCard empty={isEmpty} />
                <HomeworkCard empty={isEmpty} />
              </div>
            </div>
            <div className={styles.sideCol}>
              <StudentSummaryCard onAsk={() => setQuestionOpen(true)} />
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
      <AskQuestionModal open={questionOpen} onClose={() => setQuestionOpen(false)} />
    </main>
  );
}
