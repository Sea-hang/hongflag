// ============================================================
// 📞 联系方式页 — 地址、电话、邮箱、办公时间
// ============================================================

export const contactData = {
  /** 页面顶部小标签 */
  label: "联系方式",
  /** 页面大标题 */
  title: "欢迎联系我们",

  /** 地图区块标题 */
  mapTitle: "学校位置",
  /** 地图下方地址行（显示在地图占位中） */
  mapCity: "河南省洛阳市宜阳县",
  mapStreet: "兴宜西路29号",
  /** 地图/学校照片路径，如 "/uploads/activities/xxx.jpg"，留空则显示文字 */
  mapImage: "/uploads/activities/1783490870566.JPG",

  /** 联系方式列表 */
  contacts: [
    {
      icon: "📍",
      label: "学校地址",
      value: "河南省洛阳市宜阳县兴宜西路29号",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      icon: "📞",
      label: "联系电话",
      value:
        "小学部：董主任 13721689058\n中学部：张校长 13525958682\n办公电话：0379-68881811",
      color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      icon: "📧",
      label: "电子邮箱",
      value: "yyhqsyxx@163.com",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      icon: "🕐",
      label: "办公时间",
      value:
        "周一至周五：8:00 - 17:00\n周六：8:30 - 11:30（招生咨询）\n周日休息",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    },
  ],
} as const;
