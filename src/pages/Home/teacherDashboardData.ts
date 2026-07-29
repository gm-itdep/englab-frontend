import iconUpload from '../../assets/icons/teacher/upload.svg';
import iconPencil from '../../assets/icons/teacher/pencil.svg';
import iconNote from '../../assets/icons/teacher/note.svg';
import iconMessage from '../../assets/icons/teacher/message.svg';
import imgAvatarStudent from '../../assets/images/teacher/avatar-student.png';
import imgAvatarStudent2 from '../../assets/images/teacher/avatar-student-2.png';
import { t } from '../../shared/i18n';

const th = t.teacherHome;

export type LessonStatus = 'soon' | 'confirmed' | 'cancelled';

export type ActionItemData = {
  icon: string;
  title: string;
  meta: string;
};

export type LessonItemData = {
  date?: string;
  time: string;
  status: LessonStatus;
  student: string;
  topic: string;
  avatar: string;
};

export type TeacherDashboardData = {
  nearestLesson: boolean;
  actions: ActionItemData[];
  todayLessons: LessonItemData[];
  todayLessonsMobile: LessonItemData[];
  calendarHasPlans: boolean;
  statsHasChartHistory: boolean;
};

const ACTIONS: ActionItemData[] = [
  { icon: iconUpload, title: th.actionUploadHw, meta: th.actionMeta },
  { icon: iconPencil, title: th.actionAddNotes, meta: th.actionMeta },
  { icon: iconNote, title: th.actionCheckHw, meta: th.actionMeta },
  { icon: iconMessage, title: th.actionAnswerQuestion, meta: th.actionMeta },
  { icon: iconMessage, title: th.actionAnswerQuestion, meta: th.actionMeta },
];

const TODAY_LESSONS: LessonItemData[] = [
  {
    date: th.lessonDate,
    time: th.lessonSlot,
    status: 'soon',
    student: th.lessonStudent,
    topic: th.lessonTopicDesktop,
    avatar: imgAvatarStudent,
  },
  {
    date: th.lessonDate,
    time: th.lessonSlot,
    status: 'confirmed',
    student: th.lessonStudent,
    topic: th.lessonTopicDesktop,
    avatar: imgAvatarStudent2,
  },
];

const TODAY_LESSONS_MOBILE: LessonItemData[] = [
  {
    time: th.lessonSlotMobile,
    status: 'soon',
    student: th.lessonStudent,
    topic: th.lessonTopicMobile,
    avatar: imgAvatarStudent,
  },
  {
    time: th.lessonSlotMobile,
    status: 'confirmed',
    student: th.lessonStudent,
    topic: th.lessonTopicMobile,
    avatar: imgAvatarStudent2,
  },
  {
    time: th.lessonSlotMobile,
    status: 'cancelled',
    student: th.lessonStudent,
    topic: th.lessonTopicMobile,
    avatar: imgAvatarStudent,
  },
];

export const TEACHER_DASHBOARD_WITH_DATA: TeacherDashboardData = {
  nearestLesson: true,
  actions: ACTIONS,
  todayLessons: TODAY_LESSONS,
  todayLessonsMobile: TODAY_LESSONS_MOBILE,
  calendarHasPlans: true,
  statsHasChartHistory: true,
};

export const TEACHER_DASHBOARD_EMPTY: TeacherDashboardData = {
  nearestLesson: false,
  actions: [],
  todayLessons: [],
  todayLessonsMobile: [],
  calendarHasPlans: false,
  statsHasChartHistory: false,
};

export function getTeacherDashboardData(isEmpty: boolean): TeacherDashboardData {
  return isEmpty ? TEACHER_DASHBOARD_EMPTY : TEACHER_DASHBOARD_WITH_DATA;
}
