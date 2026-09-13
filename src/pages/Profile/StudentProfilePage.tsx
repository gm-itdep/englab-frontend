import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAppRole, getSession } from '../../shared/auth/mockAuth';
import { StudentLayout } from '../Home/StudentLayout';
import ICON_PENCIL from '../../assets/icons/student/pencil.svg';
import ICON_ARROW from '../../assets/icons/student/arrow-lite.svg';
import ICON_EYE from '../../assets/icons/eye.svg';
import ICON_CLOSED_EYE from '../../assets/icons/student/profile/closed-eye.svg';
import {
  EDIT_PRESET,
  LESSON_TIMES,
  LEVELS,
  PROFILE_AVATAR_BY_ROLE,
  PROFILE_BY_ROLE,
  TIMEZONES,
  TIMEZONE_LABELS,
  isLessonTimeSelected,
  lessonTimeValue,
  type ProfileData,
} from './profileData';
import styles from './StudentProfilePage.module.css';

type MenuKey = 'tz' | 'level' | 'time' | null;

function FieldRow({
  label,
  children,
  bordered,
}: {
  label: string;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <div className={[styles.row, bordered ? styles.rowBordered : ''].filter(Boolean).join(' ')}>
      <div className={styles.rowInner}>
        <p className={styles.label}>{label}</p>
        {children}
      </div>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}

function FieldSelect({
  value,
  options,
  open,
  onToggle,
  onSelect,
  width,
  menuRef,
}: {
  value: string;
  options: { value: string; hint?: string }[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  width?: number;
  menuRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div
      className={styles.selectWrap}
      style={width ? { width } : undefined}
      ref={menuRef}
    >
      <button
        type="button"
        className={[styles.select, open ? styles.selectOpen : ''].filter(Boolean).join(' ')}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className={styles.selectValue}>{value}</span>
        <span className={[styles.selectChevron, open ? styles.selectChevronOpen : ''].join(' ')}>
          <img src={ICON_ARROW} alt="" width={14} height={14} />
        </span>
      </button>
      {open ? (
        <ul className={styles.dropdown} role="listbox">
          {options.map((option) => {
            const optionValue = lessonTimeValue(option);
            const selected = option.hint
              ? isLessonTimeSelected(value, option)
              : value === option.value;
            return (
              <li key={optionValue}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[styles.option, selected ? styles.optionSelected : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelect(option.hint ? optionValue : option.value)}
                >
                  {option.hint ? (
                    <>
                      {option.value}{' '}
                      <span className={styles.optionHint}>{option.hint}</span>
                    </>
                  ) : (
                    option.value
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function SwitchCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.switchCard}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span>{label}</span>
      <span className={[styles.toggle, checked ? styles.toggleOn : ''].filter(Boolean).join(' ')}>
        <span className={styles.toggleKnob} />
      </span>
    </button>
  );
}

export function StudentProfilePage() {
  const [searchParams] = useSearchParams();
  const session = getSession();
  const role = getAppRole(searchParams);
  const roleProfile = PROFILE_BY_ROLE[role];
  const roleAvatar = PROFILE_AVATAR_BY_ROLE[role];
  const initialProfile =
    session && role !== 'student'
      ? {
          ...roleProfile,
          displayName: session.name,
          name: session.name,
          email: session.email,
          googleEmail: session.email,
        }
      : roleProfile;
  const editPreset = searchParams.get('edit') === '1' || searchParams.get('menu') != null;
  const menuPreset = searchParams.get('menu');
  const initialMenu: MenuKey =
    menuPreset === 'tz' || menuPreset === 'level' || menuPreset === 'time' ? menuPreset : null;

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [draft, setDraft] = useState<ProfileData>(
    editPreset && role === 'student' ? EDIT_PRESET : initialProfile,
  );
  const [editing, setEditing] = useState(editPreset);
  const [openMenu, setOpenMenu] = useState<MenuKey>(editPreset ? initialMenu : null);
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(roleAvatar);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const tzRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const sessionName = session?.name;
  const sessionEmail = session?.email;

  useEffect(() => {
    const next =
      sessionName && sessionEmail && role !== 'student'
        ? {
            ...PROFILE_BY_ROLE[role],
            displayName: sessionName,
            name: sessionName,
            email: sessionEmail,
            googleEmail: sessionEmail,
          }
        : PROFILE_BY_ROLE[role];
    setProfile(next);
    setDraft(editPreset && role === 'student' ? EDIT_PRESET : next);
    setPhoto(PROFILE_AVATAR_BY_ROLE[role]);
  }, [editPreset, role, sessionEmail, sessionName]);

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const wrap =
        openMenu === 'tz' ? tzRef.current : openMenu === 'level' ? levelRef.current : timeRef.current;
      if (wrap && !wrap.contains(target)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  const startEdit = () => {
    setDraft({ ...profile });
    setEditing(true);
    setOpenMenu(null);
    setShowPassword(false);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
    setOpenMenu(null);
    setShowPassword(false);
  };

  const saveEdit = () => {
    setProfile({
      ...draft,
      timezoneLabel: TIMEZONE_LABELS[draft.timezone] ?? draft.timezoneLabel,
    });
    setEditing(false);
    setOpenMenu(null);
    setShowPassword(false);
  };

  const patch = (partial: Partial<ProfileData>) => {
    setDraft((current) => ({ ...current, ...partial }));
  };

  const data = editing ? draft : profile;

  return (
    <StudentLayout
      title="Профиль"
      subtitle="Личные данные и настройки"
      activeNav="profile"
      hideMobileSearch
    >
      <section className={styles.card}>
        <div className={[styles.header, editing ? styles.headerEdit : ''].join(' ')}>
          <div className={styles.headerLeft}>
            <div className={editing ? styles.photoEdit : styles.photoView}>
              <div className={styles.avatarWrap}>
                <img src={photo} alt="" className={styles.avatar} width={120} height={120} />
                {editing ? (
                  <button
                    type="button"
                    className={styles.photoBadge}
                    aria-label="Изменить фото"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <span className={styles.photoBadgeIcon}>
                      <img src={ICON_PENCIL} alt="" width={14} height={14} />
                    </span>
                  </button>
                ) : null}
              </div>
              {editing ? (
                <button
                  type="button"
                  className={styles.photoLink}
                  onClick={() => photoInputRef.current?.click()}
                >
                  Изменить фото
                </button>
              ) : null}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setPhoto(URL.createObjectURL(file));
                }}
              />
            </div>
            <div className={styles.headerText}>
              <p className={styles.displayName}>{data.displayName}</p>
              <p className={styles.bio}>{data.bio}</p>
            </div>
          </div>
          {editing ? (
            <div className={styles.headerActions}>
              <button type="button" className={styles.btnPrimary} onClick={saveEdit}>
                Сохранить изменения
              </button>
              <button type="button" className={styles.btnCancel} onClick={cancelEdit}>
                Отмена
              </button>
            </div>
          ) : (
            <button type="button" className={styles.btnEdit} onClick={startEdit}>
              <span className={styles.btnEditIcon}>
                <img src={ICON_PENCIL} alt="" width={17} height={17} />
              </span>
              Редактировать
            </button>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Личные данные</h2>
          <div className={styles.fields}>
            <FieldRow label="Имя" bordered={!editing}>
              {editing ? (
                <input
                  className={styles.fieldInput}
                  value={data.name}
                  onChange={(event) => patch({ name: event.target.value })}
                />
              ) : (
                <p className={styles.value}>{data.name}</p>
              )}
            </FieldRow>
            <FieldRow label="Email" bordered={!editing}>
              {editing ? (
                <>
                  <input className={[styles.fieldInput, styles.fieldDisabled].join(' ')} value={data.email} disabled />
                  <Badge>Подтвержден</Badge>
                </>
              ) : (
                <>
                  <p className={styles.valueNowrap}>{data.email}</p>
                  <Badge>Подтвержден</Badge>
                </>
              )}
            </FieldRow>
            <FieldRow label={editing ? 'Часовой пояс' : 'Часовой'} bordered={!editing}>
              {editing ? (
                <FieldSelect
                  value={data.timezone}
                  options={TIMEZONES.map((value) => ({ value }))}
                  open={openMenu === 'tz'}
                  onToggle={() => setOpenMenu((current) => (current === 'tz' ? null : 'tz'))}
                  onSelect={(value) => {
                    patch({ timezone: value, timezoneLabel: TIMEZONE_LABELS[value] ?? value });
                    setOpenMenu(null);
                  }}
                  width={240}
                  menuRef={(node) => {
                    tzRef.current = node;
                  }}
                />
              ) : (
                <p className={styles.value}>{data.timezoneLabel}</p>
              )}
            </FieldRow>
            <FieldRow label="Пароль" bordered={!editing}>
              {editing ? (
                <div className={styles.passwordField}>
                  <input
                    className={styles.passwordInput}
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(event) => patch({ password: event.target.value })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <img
                      src={showPassword ? ICON_EYE : ICON_CLOSED_EYE}
                      alt=""
                      width={17}
                      height={17}
                    />
                  </button>
                </div>
              ) : (
                <p className={styles.value}>{'*'.repeat(23)}</p>
              )}
            </FieldRow>
          </div>
        </div>

        {role !== 'admin' ? (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Обучение</h2>
          <div className={styles.fields}>
            <FieldRow label="Цель обучения" bordered={!editing}>
              {editing ? (
                <input
                  className={[styles.fieldInput, styles.goalInput].join(' ')}
                  value={data.goal}
                  onChange={(event) => patch({ goal: event.target.value })}
                />
              ) : (
                <p className={styles.value}>{data.goal}</p>
              )}
            </FieldRow>
            <FieldRow label="Уровень английского" bordered={!editing}>
              {editing ? (
                <FieldSelect
                  value={data.level}
                  options={LEVELS.map((value) => ({ value }))}
                  open={openMenu === 'level'}
                  onToggle={() => setOpenMenu((current) => (current === 'level' ? null : 'level'))}
                  onSelect={(value) => {
                    patch({ level: value });
                    setOpenMenu(null);
                  }}
                  width={234}
                  menuRef={(node) => {
                    levelRef.current = node;
                  }}
                />
              ) : (
                <p className={styles.value}>{data.level}</p>
              )}
            </FieldRow>
            <FieldRow label="Предпочтительное время урока" bordered={!editing}>
              {editing ? (
                <FieldSelect
                  value={data.lessonTime}
                  options={LESSON_TIMES}
                  open={openMenu === 'time'}
                  onToggle={() => setOpenMenu((current) => (current === 'time' ? null : 'time'))}
                  onSelect={(value) => {
                    patch({ lessonTime: value });
                    setOpenMenu(null);
                  }}
                  menuRef={(node) => {
                    timeRef.current = node;
                  }}
                />
              ) : (
                <p className={styles.value}>{data.lessonTime}</p>
              )}
            </FieldRow>
            <FieldRow label="Язык интерфейса" bordered={!editing}>
              {editing ? (
                <input
                  className={[styles.fieldInput, styles.fieldDisabled].join(' ')}
                  value={data.language}
                  disabled
                />
              ) : (
                <p className={styles.value}>{data.language}</p>
              )}
            </FieldRow>
          </div>
        </div>
        ) : null}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Уведомления и безопасность</h2>
          <div className={styles.fields}>
            <FieldRow label="Уведомления" bordered={!editing}>
              {editing ? (
                <div className={styles.switchRow}>
                  <SwitchCard
                    label="Email"
                    checked={data.emailNotify}
                    onChange={() => patch({ emailNotify: !data.emailNotify })}
                  />
                  <SwitchCard
                    label="Push"
                    checked={data.pushNotify}
                    onChange={() => patch({ pushNotify: !data.pushNotify })}
                  />
                </div>
              ) : (
                <p className={styles.value}>
                  Email: {data.emailNotify ? 'вкл' : 'выкл'}, Push: {data.pushNotify ? 'вкл' : 'выкл'}
                </p>
              )}
            </FieldRow>
            <FieldRow label="Безопасность аккаунта" bordered={!editing}>
              <p className={styles.value}>{data.securityNote}</p>
            </FieldRow>
            <FieldRow label="Google аккаунт" bordered={!editing}>
              <p className={styles.valueNowrap}>{data.googleEmail}</p>
              <Badge>Подключён</Badge>
            </FieldRow>
          </div>
        </div>
      </section>
    </StudentLayout>
  );
}
