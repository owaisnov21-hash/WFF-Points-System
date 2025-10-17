import { User, Activity, PointsEntry, Country, LandingPageContent, VotingSettings, Student, PublicVote, BonusPoint, VotingSession, DirectorScore } from './types';

// FIX: Removed the explicit type annotation `readonly CriteriaKey[]` and added `as const`.
// This breaks the circular dependency between this constant and the `CriteriaKey` type in `types.ts`.
// TypeScript now infers a narrow, readonly tuple type, which allows `CriteriaKey` to be correctly
// derived as a union of string literals, fixing all related type errors.
export const CRITERIA_KEYS = [
  'creativity',
  'recycling',
  'synchronization',
  'mentor_performance',
  'leader_action',
  'boys_performance',
  'props',
  'rally',
  'discipline',
  'mentors_teamwork'
] as const;

export const INITIAL_HEADER_LOGO_URL = 'https://drive.google.com/uc?export=view&id=1_NJedj9Rpcxl_iB5z03zMCJKB7ET_hOk';

export const INITIAL_LANDING_PAGE_CONTENT: LandingPageContent = {
    mainHeading: "ILMA World Fusion Fest 3.0",
    description: "Celebrate Unity in Diversity. Track the Scores Live.",
    mainLogoUrl: 'https://drive.google.com/uc?export=view&id=1cijnLzqCtSsBquGIydivKFBGCL7ahSV_',
    backgroundUrl: 'https://drive.google.com/uc?export=view&id=1gF-gZT6hBzihT2UEs-xCiXEk-GL3fkZr',
};

export const INITIAL_COUNTRIES_DATA: Country[] = [
    { name: "Malaysia", flag: "🇲🇾", imageUrl: null, leaderNames: ["Aliza", "Musaddiq"], assignedMentors: ["Abdullah"], courseName: "POM", color: "#ffc72c", players: [
        { id: 'BB-9485', name: 'SHAHZAIB SHAHZAD' }, { id: 'BB-9489', name: 'MUHAMMAD SAHIL' },
        { id: 'BB-9548', name: 'MUSADDIQ HUSSAIN' }, { id: 'BB-9583', name: 'SYEDA UMM E HABIBA' },
        { id: 'BB-9684', name: 'ANDLEEB ZAFAR' }, { id: 'BB-9688', name: 'ALIZA .' },
        { id: 'BB-9705', name: 'HOOR FATIMA' }, { id: 'BB-9765', name: 'MANAHIL FATIMA' },
        { id: 'BB-9772', name: 'PAWISH KHAN' }, { id: 'BB-9777', name: 'DURRISHAM DURRISHAM' },
        { id: 'BB-9795', name: 'RAYYAN ARSHAD' }
    ]},
    { name: "Spain", flag: "🇪🇸", imageUrl: null, leaderNames: ["Rimna", "Anmol"], assignedMentors: ["Abdullah"], courseName: "EGL M", color: "#c60b1e", players: [
        { id: 'ADM/569', name: 'SYED MUHAMMAD ZARB E ABBAS' }, { id: 'ADM/589', name: 'RIMNA ASIF' },
        { id: 'ADM/600', name: 'UNZILA RAHIM' }, { id: 'ADM/606', name: 'ANMOL .' },
        { id: 'ADM/607', name: 'JANNAT .' }, { id: 'BB-10240', name: 'SHIZZA ANFAL' },
        { id: 'BB-10249', name: 'ABDUL REHMAN' }, { id: 'BB-10269', name: 'SAMIA HUMNA' },
        { id: 'BB-10276', name: 'HASSAM FAROOQ' }, { id: 'BB-10337', name: 'MAHA IRSHAD' },
        { id: 'BB-10414', name: 'MUHAMMAD HUZAIMA MAQBOOL' }
    ]},
    { name: "Turkey", flag: "🇹🇷", imageUrl: null, leaderNames: ["Affan", "Faiza"], assignedMentors: ["Bilal", "Ibtesam"], courseName: "EGL M", color: "#e30a17", players: [
        { id: 'ADM/571', name: 'ABDUL REHMAN' }, { id: 'ADM/585', name: 'WARDAH NAZ' },
        { id: 'BB-10187', name: 'MAHEEN RASHEED' }, { id: 'BB-10188', name: 'MEHWISH .' },
        { id: 'BB-10202', name: 'FAIZA .' }, { id: 'BB-10209', name: 'MUHAMMAD ONAIS' },
        { id: 'BB-10210', name: 'MIRZA SHARJEEL BAIG' }, { id: 'BB-10227', name: 'MUHAMMAD ZAKARIYA' },
        { id: 'BB-10243', name: 'MANAHIL AZEEM WARSI' }, { id: 'BB-10253', name: 'ZAHIRA .' },
        { id: 'BB-10296', name: 'MUHAMMAD AFFAN SIDDIQUI' }, { id: 'BB-10323', name: 'AYESHA SHAH' }
    ]},
    { name: "Italy", flag: "🇮🇹", imageUrl: null, leaderNames: ["Tazmeen", "Haseeb"], assignedMentors: ["Bilal", "Ibtesam"], courseName: "EGL E", color: "#009246", players: [
        { id: 'ADM/605', name: 'MUHAMMAD SUBHAN SIDDIQUI' }, { id: 'BB-10515', name: 'ABDUL BASIT' },
        { id: 'BB-10532', name: 'AHSAN ALI' }, { id: 'BB-10538', name: 'MISBAH SYED' },
        { id: 'BB-10597', name: 'MUHAMMAD ZAYAN' }, { id: 'BB-10610', name: 'MUHAMMAD ANFAL' },
        { id: 'BB-10669', name: 'HASSAN KHAN' }, { id: 'BB-10714', name: 'TAZMEEN AKBAR' },
        { id: 'BB-9634', name: 'ABDUL HASEEB SHEIKH' }, { id: 'BB-9831', name: 'MUHAMMAD MOHSIN ALI ASIF' }
    ]},
    { name: "Austria", flag: "🇦🇹", imageUrl: null, leaderNames: ["Shahroz", "Bisma"], assignedMentors: ["Bisma"], courseName: "EGL M", color: "#ed2939", players: [
        { id: 'ADM/584', name: 'BISMA NAZ KHALIDI' }, { id: 'BB-10037', name: 'SIBGHA ASIF' },
        { id: 'BB-10126', name: 'ANUS REHAN' }, { id: 'BB-10142', name: 'SHEHROZ KHAN' },
        { id: 'BB-10189', name: 'FARHAN AKHTAR' }, { id: 'BB-10214', name: 'IQRA LATIF' },
        { id: 'BB-10297', name: 'MUHAMMAD HARIS ISLMAIL' }, { id: 'BB-10388', name: 'MUHAMMAD ABDULLAH' },
        { id: 'BB-10389', name: 'KASHAF IKRAM' }, { id: 'BB-10430', name: 'ABDUL AHAD' },
        { id: 'BB-10574', name: 'KANZUL DUA' }
    ]},
    { name: "Russia", flag: "🇷🇺", imageUrl: null, leaderNames: ["Tabish", "Ayesha"], assignedMentors: ["Bisma"], courseName: "POM", color: "#0039a6", players: [
        { id: 'BB-10172', name: 'SIFNA NISAR' }, { id: 'BB-9345', name: 'AYESHA NAZ SHAIKH' },
        { id: 'BB-9373', name: 'MUHAMMAD ALIYAN KHAN' }, { id: 'BB-9412', name: 'MOIN UD DIN' },
        { id: 'BB-9488', name: 'KALEEMULLAH KALEEMULLAH' }, { id: 'BB-9590', name: 'MUHAMMAD TABISH KHAN' },
        { id: 'BB-9677', name: 'MAHAM MANSOOR' }, { id: 'BB-9683', name: 'MERAB SHEIKH' },
        { id: 'BB-9753', name: 'MUHAMMAD IBRAHIM ANSARI' }, { id: 'BB-9793', name: 'HASSAN SHAH' },
        { id: 'BB-9801', name: 'SHEEZA HASSAN MIR' }
    ]},
    { name: "Indonesia", flag: "🇮🇩", imageUrl: null, leaderNames: ["Salman", "Tooba"], assignedMentors: ["Faisal"], courseName: "EGL M", color: "#ce1126", players: [
        { id: 'ADM/577', name: 'TOOBA MUSHTAQ' }, { id: 'ADM/587', name: 'ASIFA .' },
        { id: 'BB-10179', name: 'AFROZ AHMED' }, { id: 'BB-10203', name: 'FAHEEM ABBAS' },
        { id: 'BB-10204', name: 'MUHAMMAD SALMAN' }, { id: 'BB-10232', name: 'NASHRA .' },
        { id: 'BB-10251', name: 'ALINA KHAN' }, { id: 'BB-10307', name: 'SHAHVAIZ ALI' },
        { id: 'BB-10312', name: 'SYED AHSAN RAZA HAQ SHAH' }, { id: 'BB-10631', name: 'MUHAMMAD UMAR' }
    ]},
    { name: "Egypt", flag: "🇪🇬", imageUrl: null, leaderNames: ["Maheen", "Danish"], assignedMentors: ["Faisal"], courseName: "EGL E", color: "#ce1126", players: [
        { id: 'ADM/601', name: 'ABDUL SAMAD' }, { id: 'ADM/602', name: 'ABDUL WASAY' },
        { id: 'BB-10004', name: 'ABDUL REHMAN BUTT' }, { id: 'BB-10019', name: 'MUHAMMAD AEZAZ UDDIN TAWAKUL' },
        { id: 'BB-10392', name: 'MAHEEN KHAN' }, { id: 'BB-10444', name: 'ABDUL WASEH' },
        { id: 'BB-10478', name: 'SAAD .' }, { id: 'BB-8190', name: 'ABU BAKAR FAROOQ' },
        { id: 'BB-9789', name: 'MIR ABDUL HANNAN AWAN' }, { id: 'BB-9799', name: 'DANISH .' }
    ]},
    { name: "Thailand", flag: "🇹🇭", imageUrl: null, leaderNames: ["Maham", "Areez"], assignedMentors: ["Furqan", "Aiman"], courseName: "EGL E", color: "#00247d", players: [
        { id: 'BB-10437', name: 'BASHARAT AYAZ' }, { id: 'BB-10446', name: 'RAHMAN SAEED' },
        { id: 'BB-10517', name: 'MAHAM .' }, { id: 'BB-10540', name: 'MUHAMMAD MOEEZ SAMI' },
        { id: 'BB-10549', name: 'AREESHA KHALID' }, { id: 'BB-10606', name: 'MUHAMMAD SHOAIB' },
        { id: 'BB-10659', name: 'MUHAMMAD SHAYAN YASEEN' }, { id: 'BB-10667', name: 'AREEZ AHMED USMANI' },
        { id: 'BB-10709', name: 'RAMEESHA WASEEM' }, { id: 'BB-9821', name: 'NOMAN AIJAZ HUSSAIN' },
        { id: 'BB-9855', name: 'AHMED YASEEN' }
    ]},
    { name: "Japan", flag: "🇯🇵", imageUrl: null, leaderNames: ["Shoaib", "Fariha"], assignedMentors: ["Furqan", "Aiman"], courseName: "POM", color: "#bc002d", players: [
        { id: 'BB-9354', name: 'MUHAMMAD SHOAIB' }, { id: 'BB-9378', name: 'AMNA HUSSAIN' },
        { id: 'BB-9428', name: 'ARMISH KHAN' }, { id: 'BB-9446', name: 'MUHAMMAD RAVEEL SIDDIQUI' },
        { id: 'BB-9491', name: 'QIRAT KHAN' }, { id: 'BB-9562', name: 'INSHAL KANWAL' },
        { id: 'BB-9712', name: 'WARISHA RASHID' }, { id: 'BB-9713', name: 'BISMA RASHID' },
        { id: 'BB-9724', name: 'KASHAN FAYYAZ' }, { id: 'BB-9755', name: 'RABIL .' },
        { id: 'BB-9759', name: 'FARIHA ALI' }
    ]},
    { name: "China", flag: "🇨🇳", imageUrl: null, leaderNames: ["Aashir", "adeeba"], assignedMentors: ["Kashaf", "Faiz"], courseName: "EGL E", color: "#ee1c25", players: [
        { id: 'BB-10421', name: 'ABDUL MOHIB' }, { id: 'BB-10441', name: 'MUHAMMAD ASHIR UMER' },
        { id: 'BB-10523', name: 'SUMAIR =.' }, { id: 'BB-9668', name: 'NIDA .' },
        { id: 'BB-9717', name: 'ADEEBA ADIL' }, { id: 'BB-9745', name: 'RAFAY KHAN' },
        { id: 'BB-9761', name: 'MUHAMMAD FAIZ SIDDIQUI' }, { id: 'BB-9771', name: 'PARVEEN .' },
        { id: 'BB-9809', name: 'TAIMOOR AZIZ' }, { id: 'BB-9820', name: 'KHUSHBAKHT .' },
        { id: 'BB-9846', name: 'SARIM AHSAN' }
    ]},
    { name: "Palestine", flag: "🇵🇸", imageUrl: null, leaderNames: ["Bilal", "Farah"], assignedMentors: ["Kashaf", "Faiz"], courseName: "EGL M", color: "#009736", players: [
        { id: 'ADM/575', name: 'RANA MOOSA KALEEM' }, { id: 'ADM/586', name: 'FATIMA JAHANGIR' },
        { id: 'BB-10156', name: 'ZOYA EJAZ' }, { id: 'BB-10158', name: 'FARAH TUL AIN' },
        { id: 'BB-10173', name: 'SHAHBAZ SALEEM' }, { id: 'BB-10175', name: 'HAFIZA AREEFA ATHAR' },
        { id: 'BB-10196', name: 'MAHA JAVED' }, { id: 'BB-10219', name: 'MUHAMMAD BILAL KHAN' },
        { id: 'BB-10397', name: 'MUHAMMAD USMAN GHANI' }, { id: 'BB-10439', name: 'UMM E FARWA' }
    ]},
    { name: "Mexico", flag: "🇲🇽", imageUrl: null, leaderNames: ["Esha", "Mahnoor"], assignedMentors: ["Mohiuddin"], courseName: "ECOM", color: "#006847", players: [
        { id: 'BB-8030', name: 'MUSHAHID ISMAIL' }, { id: 'BB-8375', name: 'MOHSIN ALI' },
        { id: 'BB-8410', name: 'ALIZAH ZAIDI' }, { id: 'BB-8429', name: 'AYESHA ZAWWAR' },
        { id: 'BB-8502', name: 'ESHA NASEER' }, { id: 'BB-8526', name: 'UMME KULSOOM' },
        { id: 'BB-8537', name: 'TASMIA ALI' }, { id: 'BB-8575', name: 'MAHANOR NAZ' },
        { id: 'BB-8594', name: 'MASFA FATIMA' }, { id: 'BB-8626', name: 'MARIA AAMIR' }
    ]},
    { name: "France", flag: "🇫🇷", imageUrl: null, leaderNames: ["Haris", "Manahil"], assignedMentors: ["Muhiuddin"], courseName: "POM", color: "#0055a4", players: [
        { id: 'BB-9242', name: 'MUHAMMAD SARIM QAISER' }, { id: 'BB-9332', name: 'KAINAT EMAN' },
        { id: 'BB-9350', name: 'AYESHA ARIF' }, { id: 'BB-9447', name: 'ABIHA ZEHRA' },
        { id: 'BB-9462', name: 'ELSA ELSA' }, { id: 'BB-9464', name: 'MANAHIL TAHIR' },
        { id: 'BB-9475', name: 'ALISHBA NASEEM' }, { id: 'BB-9599', name: 'SAIM KHAN' },
        { id: 'BB-9662', name: 'MUHAMMAD HARIS' }, { id: 'BB-9743', name: 'JAWERIA .' },
        { id: 'BB-9779', name: 'HIBA ANWAR' }, { id: 'BB-9838', name: 'MALAIKA IFTEKHAR' }
    ]},
    { name: "Sri Lanka", flag: "🇱🇰", imageUrl: null, leaderNames: ["Hasan", "Hooriya"], assignedMentors: ["Muskaan", "Samie"], courseName: "EGL M", color: "#ff5700", players: [
        { id: 'ADM/582', name: 'EANEY MEHTAB' }, { id: 'ADM/591', name: 'HOORIA .' },
        { id: 'ADM/595', name: 'MUHAMMAD ALI' }, { id: 'ADM/596', name: 'MUHAMMAD HASAN RASHEED PARACHA' },
        { id: 'ADM/604', name: 'HUZAIFA ALI' }, { id: 'BB-10186', name: 'MUHAMMAD FURQAN RAFIQ' },
        { id: 'BB-10197', name: 'MAIRA AQIL' }, { id: 'BB-10215', name: 'FIZA .' },
        { id: 'BB-10244', name: 'MALAIKA .' }, { id: 'BB-10280', name: 'MUHAMMAD SALMAN' },
        { id: 'BB-10322', name: 'SYED AZHAN ABDULLAH' }, { id: 'BB-10381', name: 'MUHAMMAD HARIS' },
        { id: 'BB-10451', name: 'TASBEEHA WAHEED' }, { id: 'BB-10452', name: 'HOORIYA AMIR' }
    ]},
    { name: "Korea", flag: "🇰🇷", imageUrl: null, leaderNames: ["Wajahat", "Maryam"], assignedMentors: ["Muskaan", "Samie"], courseName: "EGL E", color: "#cd2e3a", players: [
        { id: 'ADM/583', name: 'AREEBA NAVEED' }, { id: 'ADM/594', name: 'WAJAHAT AHMED USMANI' },
        { id: 'ADM/599', name: 'SOBIA .' }, { id: 'BB-10008', name: 'KARAL FALAK SHAIR' },
        { id: 'BB-10040', name: 'MUHAMMAD RAZA' }, { id: 'BB-10459', name: 'MUSPIRA AKMAL' },
        { id: 'BB-10545', name: 'CARRAL .' }, { id: 'BB-10555', name: 'MARYAM .' },
        { id: 'BB-10624', name: 'SEERAT ALI' }, { id: 'BB-10672', name: 'SAJID ALI ALIAS BABER ALI' },
        { id: 'BB-10707', name: 'SYED MUHAMMAD HUSSAIN RAZA JAFRI' }
    ]},
    { name: "Germany", flag: "🇩🇪", imageUrl: null, leaderNames: ["Anosha", "Basit"], assignedMentors: ["Usama", "Ayesha"], courseName: "EGL M", color: "#dd0000", players: [
        { id: 'BB-10112', name: 'SAKINA SAQLAIN' }, { id: 'BB-10118', name: 'Muhammad Maahe' },
        { id: 'BB-10200', name: 'WAJID ALI' }, { id: 'BB-10216', name: 'NAFEES AHMED KHAN' },
        { id: 'BB-10340', name: 'MUHAMMAD HASNAIN SHAHID' }, { id: 'BB-10341', name: 'WALEED GUL' },
        { id: 'BB-10342', name: 'SYED AHSAN HUSSAIN SHAH' }, { id: 'BB-10382', name: 'ANOSHA .' },
        { id: 'BB-10434', name: 'NABIA .' }, { id: 'BB-10440', name: 'SAMIA AZHAR' },
        { id: 'BB-10448', name: 'ABDUL BASIT KHAN' }
    ]},
    { name: "Brazil", flag: "🇧🇷", imageUrl: null, leaderNames: ["Laiba", "Arsalan"], assignedMentors: ["Usama", "Ayesha"], courseName: "EGL E", color: "#009c3b", players: [
        { id: 'BB-10399', name: 'LAIBA FARRUKH KHAN' }, { id: 'BB-10417', name: 'ABDUL SAQIB' },
        { id: 'BB-10484', name: 'MUHAMMAD ASHER' }, { id: 'BB-10531', name: 'SAMEEN .' },
        { id: 'BB-10570', name: 'MALIKH TAHIR NAWAZ' }, { id: 'BB-10636', name: 'MUHAMMAD AHTISHAM' },
        { id: 'BB-10637', name: 'ARSALAN .' }, { id: 'BB-10705', name: 'UMAIR KHAN' },
        { id: 'BB-9310', name: 'MUHAMMAD MUDDASIR AHMED' }, { id: 'BB-9815', name: 'WALEED .' },
        { id: 'BB-9823', name: 'MUHAMMAD SAMI' }
    ]},
    { name: "UAE", flag: "🇦🇪", imageUrl: null, leaderNames: ["Kishwar", "Adeel"], assignedMentors: ["Wajid"], courseName: "POM", color: "#00732f", players: [
        { id: 'BB-9264', name: 'MUHAMMAD MUBASHIR' }, { id: 'BB-9273', name: 'MUHAMMAD USMAN' },
        { id: 'BB-9308', name: 'ROMAN ZAMAN' }, { id: 'BB-9380', name: 'ADEEL AHMED' },
        { id: 'BB-9424', name: 'HAMZA ANWAR' }, { id: 'BB-9451', name: 'MUHAMMAD DANIYAL' },
        { id: 'BB-9603', name: 'KISHWAR YOUSUF' }, { id: 'BB-9723', name: 'MANAHIL QURESHI' },
        { id: 'BB-9773', name: 'UJALA UJALA' }, { id: 'BB-9792', name: 'RAMEESHA FATIMA' },
        { id: 'BB-9794', name: 'AYESHA NOOR' }
    ]},
    { name: "Iran", flag: "🇮🇷", imageUrl: null, leaderNames: ["Zahid", "Esha"], assignedMentors: ["Wajid"], courseName: "EGL E", color: "#239f40", players: [
        { id: 'ADM/579', name: 'ZAKIYA ASLAM' }, { id: 'BB-10460', name: 'AREEBA .' },
        { id: 'BB-10461', name: 'KAHAF HABIB' }, { id: 'BB-10495', name: 'ESHA BATOOL' },
        { id: 'BB-10548', name: 'NASEER AHMED KHAN' }, { id: 'BB-10657', name: 'MUHAMMAD ANUS RAZA' },
        { id: 'BB-10723', name: 'SYED AMMAR UDDIN AHMED' }, { id: 'BB-10733', name: 'SYED MUHIBUDDN AHMED' },
        { id: 'BB-6501', name: 'MUHAMMAD AHSAN IQBAL' }, { id: 'BB-9483', name: 'MUHAMMAD ARSHAN' },
        { id: 'BB-9593', name: 'MUHAMMAD ZAHID' }, { id: 'BB-9605', name: 'MUHAMMAD NOMAN' }
    ]}
];



// --- NEW DATA FOR ROLE-BASED SYSTEM ---

export const INITIAL_USERS: User[] = [
    // Admins & Directors
    { id: 1, username: 'Admin', password: '123', role: 'admin' },
    { id: 2, username: 'Director', password: '123', role: 'director' },
    { id: 3, username: 'Smentor', password: '123', role: 'director' },
    { id: 4, username: 'Judge', password: '123', role: 'judge' },

    // Mentors
    { id: 101, username: 'Bisma', password: '123', role: 'mentor' },
    { id: 102, username: 'Usama', password: '123', role: 'mentor' },
    { id: 103, username: 'Kashaf', password: '123', role: 'mentor' },
    { id: 104, username: 'Faisal', password: '123', role: 'mentor' },
    { id: 105, username: 'Muhiuddin', password: '123', role: 'mentor' },
    { id: 106, username: 'Wajid', password: '123', role: 'mentor' },
    { id: 107, username: 'Bilal', password: '123', role: 'mentor' },
    { id: 108, username: 'Furqan', password: '123', role: 'mentor' },
    { id: 109, username: 'Muskaan', password: '123', role: 'mentor' },
    { id: 110, username: 'Abdullah', password: '123', role: 'mentor' },
    { id: 111, username: 'Mohiuddin', password: '123', role: 'mentor' },
    { id: 112, username: 'Aiman', password: '123', role: 'mentor' },
    { id: 113, username: 'Ayesha', password: '123', role: 'mentor' },
    { id: 114, username: 'Faiz', password: '123', role: 'mentor' },
    { id: 115, username: 'Ibtesam', password: '123', role: 'mentor' },
    { id: 116, username: 'Samie', password: '123', role: 'mentor' },

    // Country Logins
    { id: 201, username: 'Japan', password: '123', role: 'country', country: 'Japan' },
    { id: 202, username: 'Thailand', password: '123', role: 'country', country: 'Thailand' },
    { id: 203, username: 'Brazil', password: '123', role: 'country', country: 'Brazil' },
    { id: 204, username: 'Germany', password: '123', role: 'country', country: 'Germany' },
    { id: 205, username: 'China', password: '123', role: 'country', country: 'China' },
    { id: 206, username: 'Palestine', password: '123', role: 'country', country: 'Palestine' },
    { id: 207, username: 'Italy', password: '123', role: 'country', country: 'Italy' },
    { id: 208, username: 'Turkey', password: '123', role: 'country', country: 'Turkey' },
    { id: 209, username: 'Korea', password: '123', role: 'country', country: 'Korea' },
    { id: 210, username: 'Sri Lanka', password: '123', role: 'country', country: 'Sri Lanka' },
    { id: 211, username: 'Austria', password: '123', role: 'country', country: 'Austria' },
    { id: 212, username: 'Egypt', password: '123', role: 'country', country: 'Egypt' },
    { id: 213, username: 'France', password: '123', role: 'country', country: 'France' },
    { id: 214, username: 'Indonesia', password: '123', role: 'country', country: 'Indonesia' },
    { id: 215, username: 'Iran', password: '123', role: 'country', country: 'Iran' },
    { id: 216, username: 'Malaysia', password: '123', role: 'country', country: 'Malaysia' },
    { id: 217, username: 'Mexico', password: '123', role: 'country', country: 'Mexico' },
    { id: 218, username: 'Russia', password: '123', role: 'country', country: 'Russia' },
    { id: 219, username: 'Spain', password: '123', role: 'country', country: 'Spain' },
    { id: 220, username: 'UAE', password: '123', role: 'country', country: 'UAE' },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { 
    id: 'wff-2024-main', 
    name: 'World Fusion Fest 2024 - Main Performance',
    type: 'judged',
    createdBy: 'admin',
    criteria: [
      { id: 'c1', name: 'Creativity', maxPoints: 10 },
      { id: 'c2', name: 'Recycling', maxPoints: 10 },
      { id: 'c3', name: 'Synchronization', maxPoints: 10 },
      { id: 'c4', name: 'Mentor Performance', maxPoints: 5 },
      { id: 'c5', name: 'Leader Action', maxPoints: 5 },
      { id: 'c6', name: 'Boys Performance', maxPoints: 5 },
      { id: 'c7', name: 'Props', maxPoints: 5 },
      { id: 'c8', name: 'Rally', maxPoints: 30 },
      { id: 'c9', name: 'Discipline', maxPoints: 10 },
      { id: 'c10', name: 'Mentors Team Work', maxPoints: 20 },
    ],
  },
  {
    id: 'booth-award-1',
    name: 'Best Booth Decoration',
    type: 'direct',
    maxPoints: 50,
    createdBy: 'director_wff'
  },
  { id: 'direct-logo', name: 'Logo Creation', type: 'direct', maxPoints: 30, createdBy: 'admin' },
  { id: 'direct-country-select', name: 'Country Selection', type: 'direct', maxPoints: 5, createdBy: 'admin' },
  { id: 'direct-insta', name: 'Insta Follow task', type: 'direct', maxPoints: 15, createdBy: 'admin' },
  { id: 'direct-flag', name: 'Flag', type: 'direct', maxPoints: 15, createdBy: 'admin' },
  { id: 'direct-team-collect', name: 'Team collection', type: 'direct', maxPoints: 15, createdBy: 'admin' },
  { id: 'direct-quiz', name: 'Online Quiz', type: 'direct', maxPoints: 150, createdBy: 'admin' },
];

// Data from CSV is now loaded into INITIAL_DIRECTOR_SCORES and INITIAL_VOTING_SESSIONS
export const INITIAL_MENTOR_SCORES: PointsEntry[] = [];

const now = new Date().toISOString();

export const INITIAL_BONUS_POINTS: BonusPoint[] = [
    { id: 58, team_country: 'Egypt', points: 5, reason: 'Misc Bonus', awardedBy: 'admin', timestamp: now, status: 'approved' },
    { id: 64, team_country: 'France', points: 5, reason: 'Misc Bonus', awardedBy: 'admin', timestamp: now, status: 'approved' },
    { id: 88, team_country: 'Mexico', points: 5, reason: 'Misc Bonus', awardedBy: 'admin', timestamp: now, status: 'approved' },
];

export const INITIAL_DIRECTOR_SCORES: DirectorScore[] = [
    { id: 1, activityId: 'direct-logo', team_country: 'Japan', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 2, activityId: 'direct-country-select', team_country: 'Japan', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 3, activityId: 'direct-insta', team_country: 'Japan', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 4, activityId: 'direct-flag', team_country: 'Japan', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 5, activityId: 'direct-quiz', team_country: 'Japan', points: 33, awardedBy: 'admin', timestamp: now },
    { id: 6, activityId: 'direct-logo', team_country: 'Thailand', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 7, activityId: 'direct-country-select', team_country: 'Thailand', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 8, activityId: 'direct-insta', team_country: 'Thailand', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 9, activityId: 'direct-flag', team_country: 'Thailand', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 10, activityId: 'direct-quiz', team_country: 'Thailand', points: 11, awardedBy: 'admin', timestamp: now },
    { id: 11, activityId: 'direct-logo', team_country: 'Brazil', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 12, activityId: 'direct-country-select', team_country: 'Brazil', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 13, activityId: 'direct-insta', team_country: 'Brazil', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 14, activityId: 'direct-flag', team_country: 'Brazil', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 15, activityId: 'direct-quiz', team_country: 'Brazil', points: 22, awardedBy: 'admin', timestamp: now },
    { id: 16, activityId: 'direct-logo', team_country: 'Germany', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 17, activityId: 'direct-country-select', team_country: 'Germany', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 18, activityId: 'direct-insta', team_country: 'Germany', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 19, activityId: 'direct-flag', team_country: 'Germany', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 20, activityId: 'direct-quiz', team_country: 'Germany', points: 22, awardedBy: 'admin', timestamp: now },
    { id: 21, activityId: 'direct-logo', team_country: 'China', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 22, activityId: 'direct-country-select', team_country: 'China', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 23, activityId: 'direct-insta', team_country: 'China', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 24, activityId: 'direct-flag', team_country: 'China', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 25, activityId: 'direct-team-collect', team_country: 'China', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 26, activityId: 'direct-quiz', team_country: 'China', points: 26, awardedBy: 'admin', timestamp: now },
    { id: 27, activityId: 'direct-logo', team_country: 'Palestine', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 28, activityId: 'direct-country-select', team_country: 'Palestine', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 29, activityId: 'direct-insta', team_country: 'Palestine', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 30, activityId: 'direct-flag', team_country: 'Palestine', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 31, activityId: 'direct-team-collect', team_country: 'Palestine', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 32, activityId: 'direct-quiz', team_country: 'Palestine', points: 11, awardedBy: 'admin', timestamp: now },
    { id: 33, activityId: 'direct-logo', team_country: 'Italy', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 34, activityId: 'direct-country-select', team_country: 'Italy', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 35, activityId: 'direct-insta', team_country: 'Italy', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 36, activityId: 'direct-flag', team_country: 'Italy', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 37, activityId: 'direct-quiz', team_country: 'Italy', points: 26, awardedBy: 'admin', timestamp: now },
    { id: 38, activityId: 'direct-logo', team_country: 'Turkey', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 39, activityId: 'direct-country-select', team_country: 'Turkey', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 40, activityId: 'direct-insta', team_country: 'Turkey', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 41, activityId: 'direct-flag', team_country: 'Turkey', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 42, activityId: 'direct-quiz', team_country: 'Turkey', points: 38, awardedBy: 'admin', timestamp: now },
    { id: 43, activityId: 'direct-logo', team_country: 'Korea', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 44, activityId: 'direct-country-select', team_country: 'Korea', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 45, activityId: 'direct-insta', team_country: 'Korea', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 46, activityId: 'direct-flag', team_country: 'Korea', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 47, activityId: 'direct-quiz', team_country: 'Korea', points: 66, awardedBy: 'admin', timestamp: now },
    { id: 48, activityId: 'direct-logo', team_country: 'Sri Lanka', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 49, activityId: 'direct-country-select', team_country: 'Sri Lanka', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 50, activityId: 'direct-insta', team_country: 'Sri Lanka', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 51, activityId: 'direct-flag', team_country: 'Sri Lanka', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 52, activityId: 'direct-quiz', team_country: 'Sri Lanka', points: 76, awardedBy: 'admin', timestamp: now },
    { id: 53, activityId: 'direct-logo', team_country: 'Austria', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 54, activityId: 'direct-country-select', team_country: 'Austria', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 55, activityId: 'direct-insta', team_country: 'Austria', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 56, activityId: 'direct-flag', team_country: 'Austria', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 57, activityId: 'direct-quiz', team_country: 'Austria', points: 56, awardedBy: 'admin', timestamp: now },
    { id: 59, activityId: 'direct-logo', team_country: 'Egypt', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 60, activityId: 'direct-country-select', team_country: 'Egypt', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 61, activityId: 'direct-insta', team_country: 'Egypt', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 62, activityId: 'direct-flag', team_country: 'Egypt', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 63, activityId: 'direct-quiz', team_country: 'Egypt', points: 49, awardedBy: 'admin', timestamp: now },
    { id: 65, activityId: 'direct-logo', team_country: 'France', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 66, activityId: 'direct-country-select', team_country: 'France', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 67, activityId: 'direct-insta', team_country: 'France', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 68, activityId: 'direct-flag', team_country: 'France', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 69, activityId: 'direct-team-collect', team_country: 'France', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 70, activityId: 'direct-quiz', team_country: 'France', points: 108, awardedBy: 'admin', timestamp: now },
    { id: 71, activityId: 'direct-logo', team_country: 'Indonesia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 72, activityId: 'direct-country-select', team_country: 'Indonesia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 73, activityId: 'direct-insta', team_country: 'Indonesia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 74, activityId: 'direct-flag', team_country: 'Indonesia', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 75, activityId: 'direct-team-collect', team_country: 'Indonesia', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 76, activityId: 'direct-quiz', team_country: 'Indonesia', points: 76, awardedBy: 'admin', timestamp: now },
    { id: 77, activityId: 'direct-logo', team_country: 'Iran', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 78, activityId: 'direct-country-select', team_country: 'Iran', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 79, activityId: 'direct-insta', team_country: 'Iran', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 80, activityId: 'direct-flag', team_country: 'Iran', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 81, activityId: 'direct-quiz', team_country: 'Iran', points: 48, awardedBy: 'admin', timestamp: now },
    { id: 82, activityId: 'direct-logo', team_country: 'Malaysia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 83, activityId: 'direct-country-select', team_country: 'Malaysia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 84, activityId: 'direct-insta', team_country: 'Malaysia', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 85, activityId: 'direct-flag', team_country: 'Malaysia', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 86, activityId: 'direct-team-collect', team_country: 'Malaysia', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 87, activityId: 'direct-quiz', team_country: 'Malaysia', points: 83, awardedBy: 'admin', timestamp: now },
    { id: 89, activityId: 'direct-logo', team_country: 'Mexico', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 90, activityId: 'direct-country-select', team_country: 'Mexico', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 91, activityId: 'direct-insta', team_country: 'Mexico', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 92, activityId: 'direct-flag', team_country: 'Mexico', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 93, activityId: 'direct-quiz', team_country: 'Mexico', points: 108, awardedBy: 'admin', timestamp: now },
    { id: 94, activityId: 'direct-logo', team_country: 'Russia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 95, activityId: 'direct-country-select', team_country: 'Russia', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 96, activityId: 'direct-insta', team_country: 'Russia', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 97, activityId: 'direct-flag', team_country: 'Russia', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 98, activityId: 'direct-quiz', team_country: 'Russia', points: 38, awardedBy: 'admin', timestamp: now },
    { id: 99, activityId: 'direct-logo', team_country: 'Spain', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 100, activityId: 'direct-country-select', team_country: 'Spain', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 101, activityId: 'direct-insta', team_country: 'Spain', points: 10, awardedBy: 'admin', timestamp: now },
    { id: 102, activityId: 'direct-flag', team_country: 'Spain', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 103, activityId: 'direct-team-collect', team_country: 'Spain', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 104, activityId: 'direct-quiz', team_country: 'Spain', points: 51, awardedBy: 'admin', timestamp: now },
    { id: 105, activityId: 'direct-logo', team_country: 'UAE', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 106, activityId: 'direct-country-select', team_country: 'UAE', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 107, activityId: 'direct-insta', team_country: 'UAE', points: 5, awardedBy: 'admin', timestamp: now },
    { id: 108, activityId: 'direct-flag', team_country: 'UAE', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 109, activityId: 'direct-team-collect', team_country: 'UAE', points: 15, awardedBy: 'admin', timestamp: now },
    { id: 110, activityId: 'direct-quiz', team_country: 'UAE', points: 22, awardedBy: 'admin', timestamp: now },
];

export const INITIAL_VOTING_SESSIONS: VotingSession[] = [
    { id: 1, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Japan', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 2, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Thailand', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 3, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Brazil', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 4, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Germany', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 5, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'China', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 6, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Palestine', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 7, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Korea', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 8, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Sri Lanka', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 9, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Austria', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 10, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'France', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 11, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Malaysia', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 12, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Mexico', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 13, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Russia', points: 30, awardedBy: 'admin', timestamp: now },
    { id: 14, name: 'Pre-event Voting', date: now.split('T')[0], team_country: 'Spain', points: 30, awardedBy: 'admin', timestamp: now },
];


// --- NEW DATA FOR PUBLIC VOTING SYSTEM ---
export const INITIAL_VOTING_SETTINGS: VotingSettings = {
    id: null,
    isOpen: false,
    type: 'public',
    name: 'Public Favorite Team Vote',
    deadline: null,
    pointsForWinner: 100,
};
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_PUBLIC_VOTES: PublicVote[] = [];