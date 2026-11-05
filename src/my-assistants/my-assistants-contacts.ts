/** Контакты для превью профиля (макет 41296:136052), по id сотрудника из my-assistants-fixtures. */
export type EmployeeContacts = {
  /** Местное время и город на демо-момент. */
  localTime: string;
  phone: string;
  ext: string;
  email: string;
  office: string;
};

const MOSCOW = "18:07 г. Москва";
const KLARA = "БЦ Клары Цеткин";

export const contacts: Record<number, EmployeeContacts> = {
  1: {
    localTime: MOSCOW,
    phone: "+7 900 222-33-44",
    ext: "1345",
    email: "e.kogut@otpbank.ru",
    office: `${KLARA}, каб. 505, 503а`,
  },
  2: {
    localTime: MOSCOW,
    phone: "+7 903 418-27-90",
    ext: "1218",
    email: "a.belyaev@otpbank.ru",
    office: `${KLARA}, каб. 412`,
  },
  3: {
    localTime: "20:07 г. Екатеринбург",
    phone: "+7 912 605-14-38",
    ext: "2107",
    email: "o.miroshnichenko@otpbank.ru",
    office: `${KLARA}, каб. 318`,
  },
  4: {
    localTime: MOSCOW,
    phone: "+7 926 731-08-52",
    ext: "1462",
    email: "k.safonov@otpbank.ru",
    office: `${KLARA}, каб. 507`,
  },
  5: {
    localTime: MOSCOW,
    phone: "+7 915 240-66-19",
    ext: "1133",
    email: "d.garipova@otpbank.ru",
    office: `${KLARA}, каб. 301`,
  },
  6: {
    localTime: MOSCOW,
    phone: "+7 977 512-43-07",
    ext: "1590",
    email: "m.laptev@otpbank.ru",
    office: "БЦ Ривер Сити, каб. 8.14",
  },
  7: {
    localTime: MOSCOW,
    phone: "+7 905 377-21-64",
    ext: "1076",
    email: "a.vorontsova@otpbank.ru",
    office: `${KLARA}, каб. 209`,
  },
  8: {
    localTime: MOSCOW,
    phone: "+7 916 820-59-31",
    ext: "1384",
    email: "i.tkachenko@otpbank.ru",
    office: `${KLARA}, каб. 604`,
  },
  9: {
    localTime: MOSCOW,
    phone: "+7 985 143-70-26",
    ext: "1227",
    email: "s.akhmedova@otpbank.ru",
    office: `${KLARA}, каб. 412`,
  },
  10: {
    localTime: "18:07 г. Санкт-Петербург",
    phone: "+7 921 664-38-15",
    ext: "3041",
    email: "s.mesnichenko@otpbank.ru",
    office: "Невский пр., 47, каб. 12",
  },
};
