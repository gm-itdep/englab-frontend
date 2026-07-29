import imgStudent from '../../assets/images/teacher/student-ivan.png';
import { t } from '../../shared/i18n';

export type StudentCard = {
  id: string;
  name: string;
  photo: string;
  badges: { level: string; course: string; time: string };
  levelKey: string;
  timeKey: string;
  lastLesson: string;
  nextLesson: string;
  lessonsCount: string;
};

const ts = t.teacherStudents;

const BASE: Omit<StudentCard, 'id'> = {
  name: ts.studentName,
  photo: imgStudent,
  badges: {
    level: ts.badgeLevel,
    course: ts.badgeCourse,
    time: ts.badgeTime,
  },
  levelKey: 'B1 (Ниже среднего)',
  timeKey: 'Вечер',
  lastLesson: ts.lastLessonValue,
  nextLesson: ts.nextLessonValue,
  lessonsCount: ts.lessonsCountValue,
};

export const STUDENTS: StudentCard[] = Array.from({ length: 24 }, (_, index) => ({
  ...BASE,
  id: `student-${index + 1}`,
}));

export function getStudents(empty = false): StudentCard[] {
  return empty ? [] : STUDENTS;
}

export const PAGE_SIZE = 6;

export const LEVEL_ALL = ts.levelOptions[0];
export const UPCOMING_ALL = ts.upcomingOptions[0].label;

export const LEVEL_OPTIONS = ts.levelOptions;
export const UPCOMING_OPTIONS = ts.upcomingOptions;
