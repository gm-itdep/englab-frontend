import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession, getAppRole, getSession } from '../../shared/auth/mockAuth';
import styles from './StudentDashboard.module.css';

import LOGO_COMPACT from '../../assets/icons/student/logo.svg';
import LOGO_FULL from '../../assets/icons/student/logo-full.svg';
import ICON_HOME from '../../assets/icons/student/home.svg';
import ICON_CALENDAR from '../../assets/icons/student/calendar.svg';
import ICON_PENCIL from '../../assets/icons/student/pencil.svg';
import ICON_MATERIALS from '../../assets/icons/student/materials.svg';
import ICON_WALLET from '../../assets/icons/student/wallet.svg';
import ICON_PROGRESS from '../../assets/icons/student/progress.svg';
import ICON_NOTIFICATION from '../../assets/icons/student/notification.svg';
import ICON_PERSON from '../../assets/icons/student/person.svg';
import ICON_EXIT from '../../assets/icons/student/exit.svg';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_NOTIFICATION_TOP from '../../assets/icons/student/notification-top.svg';
import ICON_CHEVRON from '../../assets/icons/student/chevron.svg';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_DOTS from '../../assets/icons/student/dots.svg';
import ICON_NOTIF_CALENDAR from '../../assets/icons/student/notif-calendar.svg';
import ICON_NOTIF_MESSAGE from '../../assets/icons/student/notif-message.svg';
import ICON_NOTIF_NOTE from '../../assets/icons/student/notif-note.svg';
import ICON_UNREAD_DOT from '../../assets/icons/student/unread-dot.svg';
import STUDENT_AVATAR from '../../assets/images/student/avatar.png';
import TEACHER_AVATAR from '../../assets/images/teacher/avatar-teacher.png';
import ADMIN_AVATAR from '../../assets/images/admin/da13fe3f-3c26-4838-9f87-50e819b11e60.png';
import { NOTIFICATIONS_BY_ROLE, type NotifKind } from '../Notifications/notificationsData';

const ROLE_CHROME = {
  student: { name: 'Иван Васильев', avatar: STUDENT_AVATAR, badge: 'B1+' },
  teacher: { name: 'Пётр Васильев', avatar: TEACHER_AVATAR, badge: '' },
  admin: { name: 'Пётр Васильев', avatar: ADMIN_AVATAR, badge: '' },
} as const;

export type StudentNavKey =
  | 'home'
  | 'schedule'
  | 'booking'
  | 'materials'
  | 'balance'
  | 'progress'
  | 'profile'
  | 'notifications';

const NAV_TOP: { icon: string; label: string; to: string; key: StudentNavKey }[] = [
  { icon: ICON_HOME, label: 'Главная', to: '/home', key: 'home' },
  { icon: ICON_CALENDAR, label: 'Расписание', to: '/schedule', key: 'schedule' },
  { icon: ICON_PENCIL, label: 'Запись', to: '/booking', key: 'booking' },
  { icon: ICON_MATERIALS, label: 'Материалы', to: '/materials', key: 'materials' },
  { icon: ICON_WALLET, label: 'Баланс', to: '/balance', key: 'balance' },
  { icon: ICON_PROGRESS, label: 'Прогресс', to: '/progress', key: 'progress' },
];

type NotifTone = 'lesson' | 'comment' | 'homework';

function dropdownTone(kind: NotifKind): NotifTone {
  if (kind === 'comment') return 'comment';
  if (kind === 'homework') return 'homework';
  return 'lesson';
}

function notifIcon(tone: NotifTone): string {
  if (tone === 'lesson') return ICON_NOTIF_CALENDAR;
  if (tone === 'comment') return ICON_NOTIF_MESSAGE;
  return ICON_NOTIF_NOTE;
}

function notifIconClass(tone: NotifTone): string {
  if (tone === 'lesson') return styles.notifIconLesson;
  if (tone === 'comment') return styles.notifIconComment;
  return styles.notifIconHomework;
}

function SearchField({ className }: { className?: string }) {
  return (
    <label className={[styles.search, className].filter(Boolean).join(' ')}>
      <img src={ICON_SEARCH} alt="" width={20} height={20} />
      <input type="search" placeholder="Поиск по материалам и урокам" />
    </label>
  );
}

function withPreviewQuery(path: string, search: string): string {
  return search ? `${path}?${search}` : path;
}

type StudentLayoutProps = {
  title: string;
  titleMobile?: string;
  subtitle: string;
  activeNav: StudentNavKey;
  showBack?: boolean;
  onBack?: () => void;
  hideMobileSearch?: boolean;
  hideSearch?: boolean;
  bellBadge?: number;
  titleSize?: 'default' | 'lg';
  children: ReactNode;
};

export function StudentLayout({
  title,
  titleMobile,
  subtitle,
  activeNav,
  showBack = false,
  onBack,
  hideMobileSearch = false,
  hideSearch = false,
  bellBadge,
  titleSize = 'default',
  children,
}: StudentLayoutProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();
  const role = getAppRole(searchParams);
  const chrome = ROLE_CHROME[role];
  const name = session?.name || chrome.name;
  const avatar = chrome.avatar;
  const badge = chrome.badge;
  const previewSearch = searchParams.toString();
  const dropdownNotifs = NOTIFICATIONS_BY_ROLE[role].slice(0, 3);

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen && !userMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifOpen && notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [notifOpen, userMenuOpen]);

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Навигация">
          <div className={styles.logoWrap}>
            <img src={LOGO_COMPACT} alt="" className={styles.logoCompact} width={38} height={26} />
            <img src={LOGO_FULL} alt="EngLab" className={styles.logoFull} width={110} height={27} />
          </div>
          <div className={styles.sidebarBody}>
            <nav className={styles.sidebarTop} aria-label="Основное меню">
              {NAV_TOP.map((item) => {
                const className = [
                  styles.sidebarItem,
                  item.key === activeNav ? styles.sidebarItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <Link
                    key={item.label}
                    to={withPreviewQuery(item.to, previewSearch)}
                    className={className}
                  >
                    <span className={styles.sidebarIconWrap}>
                      <img src={item.icon} alt="" />
                    </span>
                    <span className={styles.sidebarLabel}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className={styles.sidebarBottom}>
              <Link
                to={withPreviewQuery('/notifications', previewSearch)}
                className={[
                  styles.sidebarItem,
                  activeNav === 'notifications' ? styles.sidebarItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={styles.sidebarIconWrap}>
                  <img src={ICON_NOTIFICATION} alt="" />
                </span>
                <span className={styles.sidebarLabel}>Уведомления</span>
              </Link>
              <Link
                to={withPreviewQuery('/profile', previewSearch)}
                className={[
                  styles.sidebarItem,
                  activeNav === 'profile' ? styles.sidebarItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={styles.sidebarIconWrap}>
                  <img src={ICON_PERSON} alt="" />
                </span>
                <span className={styles.sidebarLabel}>Профиль</span>
              </Link>
              <button type="button" className={styles.sidebarItem} onClick={handleLogout}>
                <span className={styles.sidebarIconWrap}>
                  <img src={ICON_EXIT} alt="" />
                </span>
                <span className={styles.sidebarLabel}>Выход</span>
              </button>
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div
              className={[
                styles.headingWrap,
                titleMobile ? '' : styles.headingWrapWide,
                showBack ? styles.headingWithBack : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {showBack ? (
                <button
                  type="button"
                  className={styles.backBtn}
                  aria-label="Назад"
                  onClick={onBack}
                >
                  <img src={ICON_ARROW_LITE} alt="" className={styles.backIcon} width={17} height={17} />
                </button>
              ) : null}
              <div className={styles.headingText}>
                <h1
                  className={[
                    styles.pageTitle,
                    titleSize === 'lg' ? styles.pageTitleLg : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className={styles.pageTitleDesktop}>{title}</span>
                  <span className={styles.pageTitleMobile}>{titleMobile || title}</span>
                </h1>
                <p className={styles.pageSubtitle}>{subtitle}</p>
              </div>
            </div>
            <div
              className={[
                styles.topbarActions,
                hideSearch ? styles.topbarActionsEnd : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {hideSearch ? null : <SearchField className={styles.searchDesktop} />}
              <div className={styles.notificationWrap} ref={notifRef}>
                <button
                  type="button"
                  className={styles.notificationBtn}
                  aria-label="Уведомления"
                  aria-expanded={notifOpen}
                  onClick={() => {
                    setUserMenuOpen(false);
                    setNotifOpen((open) => !open);
                  }}
                >
                  <img src={ICON_NOTIFICATION_TOP} alt="" width={24} height={24} />
                  {bellBadge ? <span className={styles.bellBadge}>{bellBadge}</span> : null}
                </button>
                {notifOpen ? (
                  <div className={styles.notifPanel} role="dialog" aria-label="Уведомления">
                    <div className={styles.notifHeader}>
                      <p className={styles.notifTitle}>Уведомления</p>
                      <button type="button" className={styles.notifReadAll}>
                        Прочитать все
                      </button>
                    </div>
                    <div className={styles.notifList}>
                      {dropdownNotifs.map((item) => {
                        const tone = dropdownTone(item.kind);
                        return (
                        <div
                          key={item.id}
                          className={[
                            styles.notifItem,
                            item.unread ? styles.notifItemUnread : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <div className={styles.notifItemBody}>
                            <span className={`${styles.notifIcon} ${notifIconClass(tone)}`}>
                              <img src={notifIcon(tone)} alt="" />
                            </span>
                            <div className={styles.notifText}>
                              <p className={styles.notifItemTitle}>{item.title}</p>
                              <p className={styles.notifItemDesc}>{item.desc}</p>
                              <p className={styles.notifItemTime}>{item.time}</p>
                            </div>
                            {item.unread ? (
                              <img src={ICON_UNREAD_DOT} alt="" className={styles.notifUnreadDot} />
                            ) : null}
                          </div>
                          <span className={styles.notifDots}>
                            <img src={ICON_DOTS} alt="" />
                          </span>
                        </div>
                        );
                      })}
                    </div>
                    <Link
                      to={withPreviewQuery('/notifications', previewSearch)}
                      className={styles.btnSecondary}
                      onClick={() => setNotifOpen(false)}
                    >
                      Смотреть все уведомления
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className={styles.userChipWrap} ref={userMenuRef}>
                <button
                  type="button"
                  className={styles.userChip}
                  aria-expanded={userMenuOpen}
                  onClick={() => {
                    setNotifOpen(false);
                    setUserMenuOpen((open) => !open);
                  }}
                >
                  <span className={styles.userChipProfile}>
                    <img src={avatar} alt="" className={styles.userAvatar} width={32} height={32} />
                    <span className={styles.userChipText}>
                      <span className={styles.userName}>{name}</span>
                      {badge ? <span className={styles.levelBadge}>{badge}</span> : null}
                    </span>
                  </span>
                  <span className={styles.chevronWrap}>
                    <img src={ICON_CHEVRON} alt="" width={9} height={5} />
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.mobileAvatarBtn}
                  aria-label={name}
                  onClick={() => {
                    setNotifOpen(false);
                    setUserMenuOpen((open) => !open);
                  }}
                >
                  <img src={avatar} alt="" className={styles.userAvatar} width={32} height={32} />
                </button>
                {userMenuOpen ? (
                  <div className={styles.userMenu} role="menu">
                    <button
                      type="button"
                      className={styles.userMenuItem}
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate(withPreviewQuery('/profile', previewSearch));
                      }}
                    >
                      Профиль
                      <img src={ICON_ARROW_LITE} alt="" width={24} height={24} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.userMenuItem} ${styles.userMenuItemLogout}`}
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Выйти
                      <img src={ICON_EXIT} alt="" width={20} height={20} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          {hideSearch || hideMobileSearch ? null : <SearchField className={styles.searchMobile} />}
          {children}
        </div>
      </div>

      <nav className={styles.bottomNav} aria-label="Мобильная навигация">
        <Link
          to={withPreviewQuery('/home', previewSearch)}
          className={[
            styles.bottomNavItem,
            activeNav === 'home' ? styles.bottomNavActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-current={activeNav === 'home' ? 'page' : undefined}
        >
          <img src={ICON_HOME} alt="" />
          <span>Главная</span>
        </Link>
        <Link
          to={withPreviewQuery('/schedule', previewSearch)}
          className={[
            styles.bottomNavItem,
            activeNav === 'schedule' ? styles.bottomNavActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-current={activeNav === 'schedule' ? 'page' : undefined}
        >
          <img src={ICON_CALENDAR} alt="" />
          <span>Расписание</span>
        </Link>
        <Link
          to={withPreviewQuery('/booking', previewSearch)}
          className={[
            styles.bottomNavItem,
            activeNav === 'booking' ? styles.bottomNavActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-current={activeNav === 'booking' ? 'page' : undefined}
        >
          <img src={ICON_PENCIL} alt="" />
          <span>Запись</span>
        </Link>
        <Link
          to={withPreviewQuery('/materials', previewSearch)}
          className={[
            styles.bottomNavItem,
            activeNav === 'materials' ? styles.bottomNavActive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-current={activeNav === 'materials' ? 'page' : undefined}
        >
          <img src={ICON_MATERIALS} alt="" />
          <span>Материалы</span>
        </Link>
        <button type="button" className={styles.bottomNavItem}>
          <img src={ICON_DOTS} alt="" />
          <span>Ещё</span>
        </button>
      </nav>
    </div>
  );
}
