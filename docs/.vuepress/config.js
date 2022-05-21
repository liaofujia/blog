module.exports = {
    title: "冲破束缚的天蝎座",
    head: [["link", { rel: "icon", href: "logo.png" }]],
    description: "一名专注前端开发的废物",
    base: "/blog/",
    themeConfig: {
      lastUpdated: "最后更新时间",
      smoothScroll: true,
      repo: "https://github.com/liaofujia/blog",
      repoLabel: "Github",
      nav: [
        {
          text: "前端面试之道",
          link: "/interview/",
        },
        {
          text: "前端书籍",
          items: [
            { text: 'JavaScript设计模式', link: '/books/' },
          ]
        },
        {
          text: "react",
          link: "/react/",
        },
        {
          text: "typeScript",
          link: "/typescript/",
        },
        {
          text: "前端进阶",
          link: "/advance/prettier",
        },
        {
          text: "前端自动化部署",
          link: "/automate/",
        },
        {
          text: "Git",
          link: "/git/",
        },
        {
          text: "常见问题",
          link: "/other/css",
        }
      ],
      sidebar: {
        "/interview/": ["css", "html", "", "advance", "es6", "jsAsync", "eventLoop", "browser", "safetyProtection", "webpack", "http", "url"],
        "/books/": ["", "FactoryPattern"],
        "/react/": ["", "hooks", "advance"],
        "/typescript/": [
          "",
          "base",
          "advance",
          "challengeBuildIn",
          "challenge",
          "tsconfig",
        ],
        "/advance/": ["prettier", "", "stylelint", "webpack", "umi"],
        "/automate/": ["", "nginx"],
        "/other/": ["css", "react", "antd", "stylelint", "nginx", "vite", ""],
      },
    },
  };