const accessoryColors = [
  { id: "white", name: "白", suffix: "白" },
  { id: "teak", name: "柚木", suffix: "柚木" },
  { id: "walnut", name: "胡桃", suffix: "胡桃" }
];

const lineColors = [
  { id: "B", name: "黑", suffix: "B" },
  { id: "G", name: "灰", suffix: "G" },
  { id: "W", name: "白", suffix: "W" }
];

const doorSize = {
  width: 703,
  height: 2000
};

function parseAccessorySize(code) {
  const match = code.match(/(\d+)×(\d+)/);

  if (!match) {
    return null;
  }

  return {
    width: Number(match[1]),
    height: Number(match[2])
  };
}

function makeAccessoryGroup(type, label, folder, codes) {
  return {
    type,
    label,
    items: codes.map((code) => ({
      id: `${type}-${code}`,
      name: code,
      size: parseAccessorySize(code),
      images: Object.fromEntries(
        accessoryColors.map((color) => [
          color.id,
          `assets/accessories/${folder}/${code}_${color.suffix}.png`
        ])
      )
    }))
  };
}

function makeLineOverlay(code) {
  return {
    id: `line-${code}`,
    name: `線條 ${code}`,
    description: "線條點綴樣式。",
    images: Object.fromEntries(
      lineColors.map((color) => [
        color.id,
        `assets/lines/${code}_${color.suffix}.png`
      ])
    )
  };
}

window.doorCatalog = {
  bases: [
    {
      id: "white-ash",
      name: "白梣",
      description: "清爽明亮，適合現代與北歐感。",
      image: "assets/base/white-ash/base.png"
    },
    {
      id: "teak",
      name: "柚木",
      description: "暖調自然，空間感溫潤穩定。",
      image: "assets/base/teak/base.png"
    },
    {
      id: "walnut",
      name: "胡桃",
      description: "深色沉穩，適合精品與質感路線。",
      image: "assets/base/walnut/base.png"
    }
  ],
  overlays: [
    {
      id: "none",
      name: "無點綴",
      description: "僅顯示木紋貼皮本身。",
      image: "",
      preview: ""
    },
    {
      id: "style-01",
      name: "樣式 01",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/1.png",
      preview: "assets/overlays/1.png"
    },
    {
      id: "style-02",
      name: "樣式 02",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/2.png",
      preview: "assets/overlays/2.png"
    },
    {
      id: "style-03",
      name: "樣式 03",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/3.png",
      preview: "assets/overlays/3.png"
    },
    {
      id: "style-04",
      name: "樣式 04",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/4.png",
      preview: "assets/overlays/4.png"
    },
    {
      id: "style-05",
      name: "樣式 05",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/5.png",
      preview: "assets/overlays/5.png"
    },
    {
      id: "style-06",
      name: "樣式 06",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/6.png",
      preview: "assets/overlays/6.png"
    },
    {
      id: "style-07",
      name: "樣式 07",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/7.png",
      preview: "assets/overlays/7.png"
    },
    {
      id: "style-08",
      name: "樣式 08",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/8.png",
      preview: "assets/overlays/8.png"
    },
    {
      id: "style-09",
      name: "樣式 09",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/9.png",
      preview: "assets/overlays/9.png"
    },
    {
      id: "style-10",
      name: "樣式 10",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/10.png",
      preview: "assets/overlays/10.png"
    },
    {
      id: "style-11",
      name: "樣式 11",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/11.png",
      preview: "assets/overlays/11.png"
    },
    {
      id: "style-12",
      name: "樣式 12",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/12.png",
      preview: "assets/overlays/12.png"
    },
    {
      id: "style-13",
      name: "樣式 13",
      description: "UV 局部彩繪示意樣式。",
      image: "assets/overlays/13.png",
      preview: "assets/overlays/13.png"
    }
  ],
  lineColors,
  lineOverlays: [
    "01",
    "02",
    "08",
    "09",
    "11",
    "16",
    "20",
    "50",
    "51",
    "54",
    "60",
    "61",
    "62",
    "63",
    "64",
    "80",
    "87"
  ].map(makeLineOverlay),
  doorSize,
  accessoryColors,
  accessories: [
    makeAccessoryGroup("glass", "玻璃框", "glass", [
      "GLS_D_01_420×1005",
      "GLS_D_02_420×1005",
      "GLS_D_03_420×1005",
      "GLS_D_04_420×378",
      "GLS_D_05_420×378",
      "GLS_D_06_440×700",
      "GLS_D_07_440×700",
      "GLS_D_08_440×700",
      "GLS_D_09_440×700",
      "GLS_D_10_440×700",
      "GLS_G01_467×725",
      "GLS_G-01_467×725",
      "GLS_G03_460×730",
      "GLS_T_08_200×605",
      "GLS_T_09_370×605",
      "GLS_T_16_200×200",
      "GLS_T_17_250×950",
      "GLS_T-15_200×655",
      "GLS_T-17_250×950",
      "GLS_T-20_130×130",
      "GLS_T-21_75×75",
      "GLS_T-22_80×380",
      "GLS_T-23_120×100",
      "GLS_T-25_100×100",
      "GLS_T-26-150×720",
      "GLS_T-26-260×10",
      "GLS-T-01_387×920",
      "GLS-T-02_387×920",
      "GLS-T-03_387×685",
      "GLS-T-04_387×685",
      "GLS-T-08(花紋)_200×605",
      "GLS-T-08_200×650",
      "GLS-T-09_370×605",
      "GLS-T-10_400×400",
      "GLS-T-11_387×920",
      "GLS-T-12_387×685",
      "GLS-T-13_425",
      "GLS-T-16-200×200"
    ]),
    makeAccessoryGroup("louvers", "百頁", "louvers", [
      "LOU_A-00-450×20",
      "LOU_A-01_378×230",
      "LOU_A-03_420×378",
      "LOU_A-04_200×650",
      "LOU_A-05_400×650",
      "LOU_A-06_466×247",
      "LOU_A-07_405×208",
      "LOU_A-08_350×203",
      "LOU_A-09_257×238",
      "LOU_A-11_300×300",
      "LOU_A-13_250×297",
      "LOU_A-13-250×295",
      "LOU_A-16-200×200",
      "LOU_A-22-80×380",
      "LOU_A-25-100×100",
      "LOU_A-26-150×720",
      "LOU_A-27-100×260",
      "LOU_E-02-3_200×1320",
      "LOU_E-04-392×1544",
      "LOU_Q-02-200×1512"
    ])
  ]
};
