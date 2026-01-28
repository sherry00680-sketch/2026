
import React from 'react';
import { Plane, ShoppingBag, Snowflake, Star, Train } from 'lucide-react';
import { ItineraryItem } from './types';

export const ITINERARY_DATA: ItineraryItem[] = [
  { 
    day: "Day 1", 
    date: "2/1", 
    title: "啟程與深夜東京", 
    icon: <Plane />, 
    category: ["transport"],
    color: "from-blue-600 to-indigo-700",
    bgUrl: "https://images.unsplash.com/photo-1542259009477-d625c009b5d7?q=80&w=2070&auto=format&fit=crop", 
    detail: "航班 MM860 | 抵達羽田 | 包車接送", 
    mapQuery: "Ostay Ueno Tokyo",
    flightInfo: { no: "Peach MM860", route: "TPE ✈️ HND", terminal: "桃園 T1 / 羽田 T3" },
    extendedDetail: [
      { time: "20:55", task: "航班起飛前往羽田" },
      { time: "00:50", task: "抵達羽田機場 T3" },
      { time: "02:15", task: "抵達 Ostay Ueno 入住" }
    ],
    memo: "公寓下有 24H 超市，可購買深夜美食。"
  },
  { 
    day: "Day 2", 
    date: "2/2", 
    title: "雪具專項：城市購物", 
    icon: <ShoppingBag />, 
    category: ["shopping"],
    color: "from-purple-500 to-pink-500",
    bgUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2070&auto=format&fit=crop", 
    detail: "神田雪具街 | 漫步上野", 
    mapQuery: "神田小川町雪具街",
    extendedDetail: [
      { time: "11:00", task: "起床補眠 & 早午餐" },
      { time: "13:00", task: "神田小川町雪具街採買" },
      { time: "16:00", task: "上野阿美橫丁購物" }
    ],
    memo: "Suica 綁定 Apple Wallet 手機進出更方便。"
  },
  { 
    day: "Day 3", 
    date: "2/3", 
    title: "夢幻迪士尼海洋", 
    icon: <Star />, 
    category: ["attraction"],
    color: "from-amber-400 to-orange-500",
    bgUrl: "https://images.unsplash.com/photo-1594916309831-294025b42d76?q=80&w=2070&auto=format&fit=crop", 
    detail: "DisneySea 攻略 | DPA 搶券", 
    mapQuery: "Tokyo DisneySea",
    extendedDetail: [
      { time: "07:30", task: "十人座包車飯店門口集合" },
      { time: "08:30", task: "APP 搶領 DPA 預約" },
      { time: "20:00", task: "返回上野公寓" }
    ],
    memo: "必搶項目：夢幻泉鄉。包車費用現場付現。"
  },
  { 
    day: "Day 4", 
    date: "2/4", 
    title: "雪國新幹線 (半滑)", 
    icon: <Train />, 
    category: ["transport", "ski"], 
    color: "from-cyan-500 to-blue-400",
    bgUrl: "https://images.unsplash.com/photo-1490806678282-4aa49b88f200?q=80&w=2070&auto=format&fit=crop", 
    detail: "新幹線前往越後湯澤 | 滑雪", 
    mapQuery: "Kandatsu Kogen Ski Resort",
    extendedDetail: [
      { time: "09:00", task: "前往上野站搭乘新幹線" },
      { time: "11:00", task: "抵達湯澤，燒肉午餐" },
      { time: "14:30", task: "神立高原滑雪場半日" }
    ],
    memo: "大型行李記得放置於車廂後方行李區。"
  },
  { 
    day: "Day 5", 
    date: "2/5", 
    title: "粉雪全日滑走", 
    icon: <Snowflake />, 
    category: ["ski"],
    color: "from-blue-200 to-indigo-300",
    bgUrl: "https://images.unsplash.com/photo-1549110485-64d852079093?q=80&w=2070&auto=format&fit=crop", 
    detail: "神立高原全日 | 溫泉放鬆", 
    mapQuery: "Kandatsu Kogen Ski Resort",
    extendedDetail: [
      { time: "09:00", task: "全日滑雪訓練開始" },
      { time: "12:00", task: "雪場餐廳景觀午餐" },
      { time: "16:00", task: "神之湯溫泉放鬆" }
    ],
    memo: "神立平日女性半價，建議確認官網最新資訊。"
  },
  { 
    day: "Day 6", 
    date: "2/6", 
    title: "歸途：返台行程", 
    icon: <Plane />, 
    category: ["transport"],
    color: "from-gray-600 to-gray-800",
    bgUrl: "https://images.unsplash.com/photo-1496231447448-f541f0b02f82?q=80&w=2070&auto=format&fit=crop", 
    detail: "新幹線返京 | 航班 SL395", 
    mapQuery: "Narita Airport Terminal 1",
    flightInfo: { no: "Thai Lion SL395", route: "NRT ✈️ TPE", terminal: "成田 T1N" },
    extendedDetail: [
      { time: "10:00", task: "湯澤車站最後採買伴手禮" },
      { time: "14:45", task: "抵達成田機場 T1N" },
      { time: "17:15", task: "航班起飛返台" }
    ],
    memo: "湯澤站內推薦購買新潟米與清酒作為伴手禮。"
  },
];

export const INITIAL_PACKING_LIST: Record<string, string[]> = {
  "📋 行前作業": ["機票/飯店", "旅遊保險", "Esim", "VJW"],
  "🔎 隨身證件": ["護照", "身分證", "信用卡", "日幣現金"],
  "❄️ 滑雪裝備": ["雪衣/雪褲", "冰爪", "面鏡", "護具", "滑雪襪", "手套"],
  "🔎 電器相關": ["行動電源", "萬國插頭", "充電線", "相機"]
};

export const DEFAULT_EXCHANGE_RATE = "0.215";
export const TARGET_DEPARTURE_DATE = "2026-02-01T20:55:00";
