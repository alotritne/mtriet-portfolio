import type { Locale, Project } from "./types";

export const profile = {
  name: "Nguyễn Ngọc Minh Triết",
  nameLines: ["Nguyễn Ngọc", "Minh Triết"] as const,
  major: { vi: "Công nghệ thông tin", en: "Information Technology" },
  studentYear: 2,
  studentLabel: {
    vi: "Sinh viên ngành Công nghệ thông tin",
    en: "Information Technology student",
  },
  gpa: "3.25",
  location: { vi: "TP. Hồ Chí Minh", en: "Ho Chi Minh City" },
  roles: [
    "Full-stack Developer",
    "Backend Developer",
    "Mobile Developer",
    "Software Engineer",
  ] as const,
  email: "mtri3t.dev@gmail.com",
  github: "https://github.com/alotritne",
  facebook: "https://www.facebook.com/alotritne/",
  website: "https://mtriet.is-a.dev/",
} as const;

export const contactLinks = [
  { id: "github", label: "GitHub", url: profile.github },
  { id: "facebook", label: "Facebook", url: profile.facebook },
  { id: "website", label: "Website", url: profile.website },
] as const;

export const projects: Project[] = [
  {
    id: "smarthome-backend",
    name: "SmartHome Backend",
    problem: {
      vi: "Backend cần quản lý tài khoản, thiết bị và dữ liệu cảm biến, đồng thời tiếp nhận cập nhật theo thời gian thực.",
      en: "The backend needs to manage accounts, devices, and sensor data while receiving real-time updates.",
    },
    approach: {
      vi: "Hệ thống sử dụng Express cho REST API, Prisma với MySQL để quản lý dữ liệu và MQTT để nhận dữ liệu từ thiết bị theo thời gian thực.",
      en: "The system uses Express for its REST API, Prisma with MySQL for data management, and MQTT for real-time device data.",
    },
    features: [
      {
        vi: "Xác thực bằng JWT và refresh token",
        en: "JWT authentication and refresh tokens",
      },
      {
        vi: "Device claiming và dữ liệu cảm biến thời gian thực",
        en: "Device claiming and real-time sensor data",
      },
      { vi: "Tài liệu API bằng Swagger", en: "API documentation with Swagger" },
    ],
    stack: ["Node.js", "Express", "Prisma", "MySQL", "MQTT"],
    repository: "https://github.com/Phon0816/SmartHome-Backend",
  },
  {
    id: "smarthome-android",
    name: "SmartHome Android",
    problem: {
      vi: "Người dùng cần một cách đơn giản để theo dõi và quản lý ngôi nhà ngay trên điện thoại.",
      en: "Users need a straightforward way to monitor and manage their home from a phone.",
    },
    approach: {
      vi: "Ứng dụng sử dụng Kotlin và Jetpack Compose, tổ chức theo MVVM; Retrofit xử lý kết nối API và Hilt quản lý các dependency.",
      en: "The app uses Kotlin and Jetpack Compose with MVVM, Retrofit for API calls, and Hilt for dependency management.",
    },
    features: [
      { vi: "Đăng nhập và đăng ký", en: "Login and registration" },
      {
        vi: "Màn hình tổng quan để theo dõi hệ thống",
        en: "System monitoring dashboard",
      },
      { vi: "Quản lý thiết bị", en: "Device management" },
    ],
    stack: ["Android", "Kotlin", "Jetpack Compose", "MVVM", "Retrofit", "Hilt"],
    repository: "https://github.com/Phon0816/LTDPT-SmartHome-AndroidApp",
  },
  {
    id: "vsign",
    name: "VSign",
    problem: {
      vi: "Người học ngôn ngữ ký hiệu Việt Nam cần phản hồi trực quan để biết mình đang thực hiện đúng hay chưa.",
      en: "Vietnamese Sign Language learners need visual feedback to know whether they are performing a sign correctly.",
    },
    approach: {
      vi: "Camera ghi nhận cử chỉ, MediaPipe xử lý đặc trưng và mô hình LSTM chạy qua TensorFlow để đưa ra kết quả nhận diện.",
      en: "The camera captures gestures, MediaPipe extracts features, and an LSTM model runs through TensorFlow for recognition.",
    },
    features: [
      {
        vi: "Nhận diện đúng/sai khi luyện tập",
        en: "Correctness feedback during practice",
      },
      {
        vi: "Dịch ngôn ngữ ký hiệu từ camera",
        en: "Camera-based sign-language translation",
      },
    ],
    stack: ["TensorFlow", "MediaPipe", "LSTM"],
  },
  {
    id: "algo-tournament",
    name: "Algo Tournament",
    problem: {
      vi: "Tạo một nơi để tổ chức và quản lý các cuộc thi thuật toán.",
      en: "Create one place for organizing and managing algorithm competitions.",
    },
    approach: {
      vi: "Thông tin về kiến trúc và đóng góp cá nhân chưa được cung cấp.",
      en: "Architecture and individual contribution details have not been provided.",
    },
    features: [],
    stack: [],
    repository: "https://github.com/alotritne/AlgoTournament",
  },
];

export const featuredProjects = projects.filter(
  (project) => project.id !== "algo-tournament",
);

export const skillGroups = [
  {
    key: "languages",
    items: ["C++", "Java", "Kotlin", "JavaScript", "Python", "TypeScript"],
  },
  { key: "frontend", items: ["React", "Vite", "TailwindCSS"] },
  {
    key: "backend",
    items: ["Node.js", "Express", "Prisma", "REST API", "JWT Authentication"],
  },
  {
    key: "dataMobile",
    items: ["MySQL", "MongoDB", "Android", "Jetpack Compose", "MQTT"],
  },
  { key: "workflow", items: ["Git", "GitHub", "Docker"] },
] as const;

export const localizeSkillItem = (item: string, locale: Locale) =>
  item === "Docker" ? `Docker (${locale === "vi" ? "cơ bản" : "basic"})` : item;

const copy = {
  vi: {
    nav: ["Giới thiệu", "Kỹ năng", "Dự án", "Liên hệ"],
    navIds: ["about", "capabilities", "projects", "contact"],
    heroBody:
      "Mình thích tìm hiểu cách các phần của một sản phẩm kết nối với nhau — từ API và dữ liệu phía sau đến giao diện mà người dùng trực tiếp tương tác. Hiện tại, mình tập trung vào backend, full-stack và phát triển ứng dụng Android.",
    viewProjects: "Xem dự án",
    contact: "Liên hệ",
    profile: "Hồ sơ kỹ thuật",
    domains: "Lĩnh vực",
    focus: "Trọng tâm hiện tại",
    focusValue: "Backend, full-stack và phát triển ứng dụng Android.",
    technology: "Công nghệ chính",
    sectionLabels: {
      about: "Giới thiệu",
      capabilities: "Kỹ năng",
      projects: "Dự án nổi bật",
      contact: "Liên hệ",
    },
    aboutTitle: "Mình học tốt nhất khi bắt tay vào làm.",
    aboutBody:
      "Khi học một công nghệ mới, mình thường đưa nó vào dự án để hiểu cách nó hoạt động cùng những phần còn lại. Qua các dự án hiện tại, mình đã có dịp làm việc với backend cho IoT, ứng dụng Android và bài toán nhận diện ngôn ngữ ký hiệu.",
    principle: "Điều mình coi trọng",
    principles: [
      "Code rõ ràng để người khác có thể tiếp tục phát triển",
      "API và dữ liệu được tổ chức nhất quán",
      "Giao diện đơn giản, dễ dùng trên nhiều thiết bị",
    ],
    capabilitiesTitle: "Công nghệ mình đã sử dụng",
    capabilitiesBody:
      "Đây là những công nghệ mình đã dùng trong quá trình học và làm dự án. Mình vẫn đang tiếp tục tìm hiểu sâu hơn từng phần.",
    groupLabels: {
      languages: "Ngôn ngữ",
      frontend: "Frontend",
      backend: "Backend",
      dataMobile: "Dữ liệu & Mobile",
      workflow: "Công cụ",
    },
    projectsTitle: "Một số dự án nổi bật",
    projectsBody:
      "Mỗi dự án là một bài toán riêng, với cách tiếp cận và bộ công nghệ khác nhau.",
    problem: "Bài toán",
    approach: "Cách tiếp cận kỹ thuật",
    features: "Tính năng chính",
    stack: "Công nghệ",
    repository: "Mã nguồn",
    unavailable: "Triển khai private",
    openRepo: "Xem mã nguồn",
    contactTitle: "Cảm ơn bạn đã ghé qua.",
    contactBody:
      "Nếu bạn muốn trao đổi về một dự án, một công nghệ hoặc đơn giản là kết nối, bạn có thể gửi email cho mình.",
    email: "Gửi email",
    location: "Việt Nam · GMT+7",
    menu: "Mở điều hướng",
    close: "Đóng điều hướng",
  },
  en: {
    nav: ["About", "Skills", "Projects", "Contact"],
    navIds: ["about", "capabilities", "projects", "contact"],
    heroBody:
      "I enjoy understanding how the parts of a product connect—from APIs and data behind the scenes to the interfaces people interact with. Right now, I’m focused on backend, full-stack, and Android development.",
    viewProjects: "View projects",
    contact: "Contact",
    profile: "Engineering profile",
    domains: "Domains",
    focus: "Current focus",
    focusValue: "Backend, full-stack, and Android development.",
    technology: "Main technologies",
    sectionLabels: {
      about: "About",
      capabilities: "Skills",
      projects: "Selected work",
      contact: "Contact",
    },
    aboutTitle: "I learn best by building.",
    aboutBody:
      "When I learn a new technology, I usually put it into a project to understand how it works with the rest of the system. My current projects have given me experience with IoT backends, Android apps, and sign-language recognition.",
    principle: "What I care about",
    principles: [
      "Clear code that others can continue working with",
      "Consistent APIs and well-organized data",
      "Simple interfaces that work across devices",
    ],
    capabilitiesTitle: "Technologies I have used",
    capabilitiesBody:
      "These are technologies I have used while learning and building projects. I am still developing a deeper understanding of each area.",
    groupLabels: {
      languages: "Languages",
      frontend: "Frontend",
      backend: "Backend",
      dataMobile: "Data & Mobile",
      workflow: "Workflow",
    },
    projectsTitle: "Selected projects",
    projectsBody:
      "Each project presents a different problem, technical approach, and set of technologies.",
    problem: "Problem",
    approach: "Technical approach",
    features: "Key features",
    stack: "Stack",
    repository: "Repository",
    unavailable: "Not provided",
    openRepo: "Open repository",
    contactTitle: "Thanks for taking a look around.",
    contactBody:
      "If you would like to talk about a project, technology, or simply connect, feel free to send me an email.",
    email: "Send an email",
    location: "Vietnam · GMT+7",
    menu: "Open navigation",
    close: "Close navigation",
  },
} as const;

export const getCopy = (locale: Locale) => copy[locale];
