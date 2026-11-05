import belyaev from "./assets/belyaev.jpg";
import kogut from "./assets/kogut.jpg";
import miroshnichenko from "./assets/miroshnichenko.jpg";
import female2 from "./assets/person-2.jpg";
import male3 from "./assets/person-3.jpg";
import male4 from "./assets/person-4.jpg";
import female5 from "./assets/person-5.jpg";
import male6 from "./assets/person-6.jpg";
import safonov from "./assets/safonov.jpg";
import {
  makeRights,
  type Assistant,
  type AssistantRole,
  type Employee,
} from "./my-assistants-model";

/** Фиксированная демо-дата, как в макетах (41301:181913). */
export const DEMO_TODAY = new Date(2026, 10, 5);

const WORKING = "Работает";

/** Десять сотрудников подразделения; без фото — Ахмедова, чтобы показать инициалы. */
export const employees: Employee[] = [
  {
    id: 1,
    name: "Когут Елена Васильевна",
    job: "Владелец продукта",
    tab: "56789454",
    department: "Управление маркетингом и связями с общественностью",
    status: WORKING,
    photo: kogut,
  },
  {
    id: 2,
    name: "Беляев Андрей Николаевич",
    job: "Руководитель направления",
    tab: "56781203",
    department: "Департамент цифровых продуктов",
    status: WORKING,
    photo: belyaev,
  },
  {
    id: 3,
    name: "Мирошниченко Ольга Игоревна",
    job: "Ведущий аналитик",
    tab: "56790817",
    department: "Управление клиентского опыта",
    status: "В командировке до 12.11.2026",
    photo: miroshnichenko,
  },
  {
    id: 4,
    name: "Сафонов Кирилл Дмитриевич",
    job: "Старший дизайнер интерфейсов",
    tab: "56793362",
    department: "Центр дизайна и исследований",
    status: "В отпуске 03–16.11.2026",
    photo: safonov,
  },
  {
    id: 5,
    name: "Гарипова Динара Рустемовна",
    job: "Руководитель проектного офиса",
    tab: "56784590",
    department: "Управление развития розничного бизнеса",
    status: WORKING,
    photo: female2,
  },
  {
    id: 6,
    name: "Лаптев Максим Сергеевич",
    job: "Тимлид разработки",
    tab: "56795148",
    department: "Департамент информационных технологий",
    status: WORKING,
    photo: male3,
  },
  {
    id: 7,
    name: "Воронцова Алина Павловна",
    job: "HR бизнес-партнёр",
    tab: "56782736",
    department: "Управление по работе с персоналом",
    status: "В отпуске 10–24.11.2026",
    photo: female5,
  },
  {
    id: 8,
    name: "Ткаченко Игорь Валерьевич",
    job: "Начальник отдела",
    tab: "56787021",
    department: "Управление корпоративного бизнеса",
    status: WORKING,
    photo: male4,
    dismissal: new Date(2026, 10, 20),
  },
  {
    id: 9,
    name: "Ахмедова Сабина Эльдаровна",
    job: "Менеджер по продукту",
    tab: "56791675",
    department: "Департамент цифровых продуктов",
    status: WORKING,
  },
  {
    id: 10,
    name: "Месниченко Святослав Сергеевич",
    job: "Главный специалист",
    tab: "56788459",
    department: "Группа г. Санкт-Петербург",
    status: "В командировке до 08.11.2026",
    photo: male6,
  },
];

export function seedAssistants(role: AssistantRole): Assistant[] {
  return [
    {
      id: "assistant-1",
      employeeId: 1,
      name: "Ассистент по отпускам",
      start: new Date(2026, 9, 20),
      end: new Date(2026, 10, 22),
      indefinite: false,
      paused: false,
      rights: makeRights(role, true),
    },
    // Срок заканчивается через 3 дня — бейдж «Истекает через 3 дня».
    {
      id: "assistant-2",
      employeeId: 6,
      name: "Ассистент по командировкам",
      start: new Date(2026, 9, 15),
      end: new Date(2026, 10, 8),
      indefinite: false,
      paused: false,
      rights: makeRights(role, true),
    },
    // Сотрудник увольняется 20.11 — пометка в карточке списка.
    {
      id: "assistant-3",
      employeeId: 8,
      name: "Ассистент по справкам",
      start: new Date(2026, 10, 1),
      end: new Date(2026, 11, 31),
      indefinite: false,
      paused: false,
      rights: makeRights(role, true),
    },
  ];
}
