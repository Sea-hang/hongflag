// ============================================================
// 📖 学校简介页 — 完整介绍内容
// ============================================================

export const aboutData = {
  /** 页面顶部小标签 */
  label: "学校简介",
  /** 页面大标题 */
  title: "关于红旗实验学校",
  /** 大标题下方副标题 */
  subtitle: "民办九年一贯制寄宿学校",

  /** 学校简介正文（每段为一个数组元素） */
  introParagraphs: [
    "红旗实验学校是一所民办九年一贯制寄宿学校，位于河南省洛阳市宜阳县兴宜西路29号。",
    `学校环境优美，设施完善，涵盖小学部和中学部，实行寄宿制管理。我们秉承"十年树木，百年树人"的校训，坚持"家校共育"的办学理念，为学生的成长提供全方位的关怀与指导。`,
    "学校拥有一支高素质的教师队伍，注重学生的德智体美劳全面发展，努力打造让家长放心、让学生满意的优质教育品牌。",
  ],

  /** 办学理念区块标题 */
  philosophyTitle: "办学理念",

  /** 学校照片路径，如 "/uploads/activities/xxx.jpg"，留空则显示默认色块 */
  image: "",

  /** 办学理念四栏（德智体美） */
  philosophyCards: [
    {
      icon: "德",
      label: "立德树人",
      desc: "培养良好品德与行为习惯",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      icon: "智",
      label: "启智育人",
      desc: "激发学习兴趣与创新思维",
      color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      icon: "体",
      label: "强身健体",
      desc: "促进身心健康发展",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      icon: "美",
      label: "以美育人",
      desc: "提升审美与人文素养",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ],
} as const;
