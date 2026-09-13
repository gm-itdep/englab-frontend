import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert, Button } from '../../components/ui';
import ICON_CLOSE from '../../assets/icons/modal-close.svg';
import ICON_CLOCK from '../../assets/icons/student/booking/confirm-clock.svg';
import ICON_ATTENTION from '../../assets/icons/student/booking/attention-lg.svg';
import ICON_CHECK from '../../assets/icons/student/booking/check-success.svg';
import ICON_CALENDAR from '../../assets/icons/student/booking/calendar-sm.svg';
import ICON_TIME from '../../assets/icons/student/booking/time-sm.svg';
import ICON_PERSON from '../../assets/icons/student/person-sm.svg';
import ICON_WALLET from '../../assets/icons/student/booking/wallet-sm.svg';
import ICON_LESSON from '../../assets/icons/student/lesson.svg';
import ICON_INFO from '../../assets/icons/student/booking/info-gray.svg';
import { SLOT_COST_LABEL, SLOT_TIME_ROWS } from './bookingData';
import { formatRelativeSelectionDate, type SlotSelection } from '../Schedule/scheduleData';
import styles from './BookingConfirmModal.module.css';

export type BookingConfirmView = 'confirm' | 'insufficient' | 'success';

type BookingConfirmModalProps = {
  teacherName: string;
  selection: SlotSelection;
  weekOffset: number;
  duration: string;
  type: string;
  missingCredits?: number;
  initialView?: BookingConfirmView;
  onClose: () => void;
  onTopUp: () => void;
  onSchedule: () => void;
};

const DETAILS: { key: string; icon: string; label: string }[] = [
  { key: 'date', icon: ICON_CALENDAR, label: 'Дата' },
  { key: 'time', icon: ICON_TIME, label: 'Время' },
  { key: 'teacher', icon: ICON_PERSON, label: 'Преподаватель' },
  { key: 'cost', icon: ICON_WALLET, label: 'Стоимость в кредитах' },
  { key: 'duration', icon: ICON_TIME, label: 'Длительность' },
  { key: 'type', icon: ICON_LESSON, label: 'Тип урока' },
];

function durationLabel(duration: string): string {
  return duration === 'Любая длительность' ? '60 минут' : duration;
}

function typeLabel(type: string): string {
  return type === 'Все типы' ? 'Индивидуально' : type;
}

export function BookingConfirmModal({
  teacherName,
  selection,
  weekOffset,
  duration,
  type,
  missingCredits = 0,
  initialView = 'confirm',
  onClose,
  onTopUp,
  onSchedule,
}: BookingConfirmModalProps) {
  const [view, setView] = useState<BookingConfirmView>(initialView);
  const isInsufficient = view === 'insufficient';
  const isSuccess = view === 'success';
  const timeRange = SLOT_TIME_ROWS[selection.timeIndex] ?? '—';
  const values: Record<string, string> = {
    date: formatRelativeSelectionDate(weekOffset, selection.dayIndex),
    time: `${timeRange} (UTC +3)`,
    teacher: teacherName,
    cost: SLOT_COST_LABEL,
    duration: durationLabel(duration),
    type: typeLabel(type),
  };

  const headerIcon = isSuccess ? ICON_CHECK : isInsufficient ? ICON_ATTENTION : ICON_CLOCK;
  const title = isSuccess
    ? 'Урок забронирован'
    : isInsufficient
      ? 'Недостаточно кредитов'
      : 'Подтвердите бронирование';
  const subtitle = isSuccess
    ? 'Бронирование успешно подтверждено.'
    : isInsufficient
      ? 'Недостаточно кредитов для оплаты урока. Пополните баланс, чтобы продолжить бронирование.'
      : 'Проверьте детали урока перед бронированием.';
  const primaryLabel = isSuccess
    ? 'Расписание'
    : isInsufficient
      ? 'Пополнить баланс'
      : 'Подтвердить';
  const secondaryLabel = isSuccess ? 'Закрыть' : 'Назад';

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

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

  const handlePrimary = () => {
    if (isInsufficient) {
      onTopUp();
      return;
    }
    if (isSuccess) {
      onSchedule();
      return;
    }
    if (missingCredits > 0) {
      setView('insufficient');
      return;
    }
    setView('success');
  };

  const handleSecondary = () => {
    if (isInsufficient) {
      setView('confirm');
      return;
    }
    onClose();
  };

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={[
            styles.header,
            isInsufficient ? styles.headerError : '',
            isSuccess ? styles.headerSuccess : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span
            className={[styles.iconWrap, isSuccess ? styles.iconWrapSuccess : '']
              .filter(Boolean)
              .join(' ')}
          >
            <img src={headerIcon} alt="" width={45} height={45} />
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            <img src={ICON_CLOSE} alt="" width={22} height={22} />
          </button>
          <div
            className={[
              styles.heading,
              isInsufficient || isSuccess ? styles.headingCompact : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <h2 id="booking-confirm-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.details}>
            {DETAILS.map((item) => (
              <div key={item.key} className={styles.row}>
                <span className={styles.rowIcon}>
                  <img src={item.icon} alt="" width={14} height={14} />
                </span>
                <div className={styles.rowText}>
                  <span className={styles.rowLabel}>{item.label}</span>
                  <span className={styles.rowValue}>{values[item.key]}</span>
                </div>
              </div>
            ))}
          </div>

          {isInsufficient ? (
            <Alert className={styles.alert}>
              {`Не хватает ${missingCredits} кредитов для оплаты урока.`}
            </Alert>
          ) : (
            <div className={styles.notice}>
              <span className={styles.noticeIcon}>
                <img src={ICON_INFO} alt="" width={14} height={14} />
              </span>
              <p className={styles.noticeText}>
                Отмена доступна не позднее чем за 12 часов до начала урока.
              </p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button className={styles.confirmBtn} onClick={handlePrimary}>
            {primaryLabel}
          </Button>
          <Button variant="outline" className={styles.backBtn} onClick={handleSecondary}>
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
