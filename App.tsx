
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  ShoppingBag, 
  Snowflake, 
  Star, 
  Train, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  ChevronRight, 
  X, 
  Info, 
  Navigation, 
  Plus, 
  Trash2, 
  Check,
  CloudSnow,
  Calculator,
  Coins,
  ImageIcon,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Hotel,
  ExternalLink,
  CloudSun,
  ShieldCheck,
  BatteryCharging,
  MessageCircle,
  ShoppingCart
} from 'lucide-react';

import { ITINERARY_DATA, INITIAL_PACKING_LIST, DEFAULT_EXCHANGE_RATE, TARGET_DEPARTURE_DATE } from './constants';
import { ItineraryItem, ExpenseItem, ShoppingItem, TabType } from './types';
import { safeEvaluate, saveToLocalStorage, loadFromLocalStorage } from './utils';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [selectedDay, setSelectedDay] = useState<ItineraryItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [countdown, setCountdown] = useState<string>("");
  const [currentBg, setCurrentBg] = useState<string>(ITINERARY_DATA[0].bgUrl);

  // Persistence State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => loadFromLocalStorage('checkedItems', {}));
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>(() => loadFromLocalStorage('expenseList', []));
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => loadFromLocalStorage('shoppingList', [
    { id: 1, name: '小熊餅乾', store: '唐吉訶德', jpy: 298, bought: true },
    { id: 2, name: 'SONY 相機', store: 'Bic Camera', jpy: 120000, bought: false },
  ]));

  // UI State
  const [calcExpression, setCalcExpression] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<string>(DEFAULT_EXCHANGE_RATE);
  const [logItemName, setLogItemName] = useState<string>('');
  const [logAmount, setLogAmount] = useState<string>('');
  const [newShopItem, setNewShopItem] = useState({ name: '', store: '', jpy: '' });

  // Persistence Effects
  useEffect(() => saveToLocalStorage('checkedItems', checkedItems), [checkedItems]);
  useEffect(() => saveToLocalStorage('expenseList', expenseList), [expenseList]);
  useEffect(() => saveToLocalStorage('shoppingList', shoppingList), [shoppingList]);

  // Derived Values
  const filteredItinerary = useMemo(() => {
    if (filter === 'all') return ITINERARY_DATA;
    return ITINERARY_DATA.filter(item => item.category.includes(filter));
  }, [filter]);

  const currentTWDFromCalc = useMemo(() => {
    const jpy = safeEvaluate(calcExpression) || 0;
    return Math.round(jpy * parseFloat(exchangeRate));
  }, [calcExpression, exchangeRate]);

  const totalShopJPY = shoppingList.reduce((acc, curr) => acc + curr.jpy, 0);
  const totalShopTWD = Math.round(totalShopJPY * parseFloat(exchangeRate));
  const totalExpenseJPY = expenseList.reduce((acc, curr) => acc + curr.val, 0);
  const totalExpenseTWD = Math.round(totalExpenseJPY * parseFloat(exchangeRate));

  // Countdown Logic
  useEffect(() => {
    const target = new Date(TARGET_DEPARTURE_DATE).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff < 0) {
        setCountdown("已啟程 ✈️");
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setCountdown(`${d}天 ${h}時`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleDaySelect = (item: ItineraryItem) => {
    setSelectedDay(item);
    setCurrentBg(item.bgUrl);
  };

  const handleCalcInput = (val: string) => {
    if (val === 'C') {
      setCalcExpression('');
    } else if (val === '=') {
      const result = safeEvaluate(calcExpression);
      if (result !== undefined && !isNaN(result)) {
        setCalcExpression(result.toString());
        setLogAmount(result.toString());
      } else {
        setCalcExpression('Error');
      }
    } else {
      const lastChar = calcExpression.slice(-1);
      const operators = ['+', '-', '×', '÷'];
      if (operators.includes(lastChar) && operators.includes(val)) {
        setCalcExpression(prev => prev.slice(0, -1) + val);
      } else {
        setCalcExpression(prev => prev + val);
      }
    }
  };

  const handleAddLog = () => {
    if (!logAmount || isNaN(parseFloat(logAmount))) return;
    setExpenseList([{ id: Date.now(), title: logItemName.trim() || '消費項目', val: parseFloat(logAmount) }, ...expenseList]);
    setLogItemName('');
    setLogAmount('');
  };

  const addShopItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopItem.name.trim()) return;
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: newShopItem.name.trim(),
      store: newShopItem.store.trim() || '-',
      jpy: newShopItem.jpy ? parseFloat(newShopItem.jpy) : 0,
      bought: false
    };
    setShoppingList([...shoppingList, newItem]);
    setNewShopItem({ name: '', store: '', jpy: '' });
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative bg-[#0f172a]">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            src={currentBg}
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.4]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/80 to-slate-900 z-10" />
      </div>

      {/* Header */}
      <header className="relative w-full z-30 px-6 pt-12 pb-8 flex flex-col items-start">
        <div className="w-full flex justify-end mb-6">
          <button 
            onClick={() => window.open('https://www.data.jma.go.jp/multi/yoho/yoho_detail.html?code=130010&lang=cn_zt', '_blank')}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl active:scale-95 transition-all group"
          >
            <CloudSun className="text-cyan-400" size={20} />
            <span className="text-[12px] font-black tracking-widest text-white whitespace-nowrap">東京天氣</span>
            <ExternalLink size={12} className="text-white/40" />
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <span className="text-cyan-400 font-black tracking-[0.3em] text-[10px] uppercase mb-2 block opacity-90">
            {countdown} TO GO
          </span>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-white">
            東京 & 越後湯澤
          </h1>
          <div className="inline-flex items-center gap-2 text-cyan-500 font-black text-sm tracking-widest text-glow-cyan">
             <Calendar size={14} /> 2026.02.01 - 02.06
          </div>
        </motion.div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-4 z-50 px-4 mb-10">
        <div className="bg-slate-900/90 backdrop-blur-3xl p-1.5 rounded-full border border-white/10 flex w-full max-w-[520px] mx-auto shadow-[0_0_50px_rgba(0,0,0,0.7)] overflow-x-auto no-scrollbar">
          {(['itinerary', 'packing', 'exchange', 'shopping', 'info'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[88px] py-3.5 rounded-full transition-all duration-300 font-black text-[10px] tracking-widest uppercase relative shrink-0 ${
                activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute inset-0 bg-cyan-500 shadow-[0_0_25px_rgba(6,182,212,1)] rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">
                {tab === 'itinerary' ? '行程' : tab === 'packing' ? '行李' : tab === 'exchange' ? '錢包' : tab === 'shopping' ? '待採購' : '資訊'}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 relative z-30 pb-36">
        <AnimatePresence mode="wait">
          
          {/* 1. Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {filteredItinerary.map((item) => (
                <motion.div 
                  key={item.day}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDaySelect(item)}
                  className="bg-white rounded-[2rem] p-5 flex gap-5 items-center cursor-pointer shadow-2xl border border-white transition-all active:bg-slate-50"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg text-white`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-80">{item.day} · {item.date}</span>
                    <h3 className="text-base font-black text-slate-900 mb-0.5 leading-tight">{item.title}</h3>
                    <p className="text-slate-400 text-[11px] truncate">{item.detail}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 2. Packing Tab */}
          {activeTab === 'packing' && (
            <motion.div key="packing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {Object.entries(INITIAL_PACKING_LIST).map(([category, items]) => (
                <div key={category} className="bg-slate-100/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-xl">
                  <h3 className="text-[11px] font-black mb-5 text-cyan-400 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-2 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]" /> {category}
                  </h3>
                  <div className="space-y-2.5">
                    {items.map(item => (
                      <div 
                        key={item} 
                        onClick={() => setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }))} 
                        className={`flex items-center gap-4 p-4.5 rounded-2xl border cursor-pointer transition-all ${checkedItems[item] ? 'bg-transparent border-white/10 text-slate-500 opacity-60' : 'bg-white border-white text-slate-900 shadow-md scale-[1.01]'}`}
                      >
                        {checkedItems[item] ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-200" />}
                        <span className={`text-sm font-black ${checkedItems[item] ? 'line-through' : ''}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 3. Exchange Tab */}
          {activeTab === 'exchange' && (
            <motion.div key="exchange" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Calculator UI */}
              <div className="bg-slate-800/95 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-2xl border-4 border-slate-700/60">
                <div className="flex gap-2 mb-5">
                  <div className="flex-1 bg-white rounded-xl p-4 min-h-[65px] flex items-center text-slate-900 font-black text-2xl overflow-x-auto no-scrollbar shadow-inner border border-white">
                    {calcExpression || '0'}
                  </div>
                  <div className="w-[120px] bg-black rounded-xl p-3 flex flex-col justify-center items-end shadow-2xl border border-white/10 text-right">
                    <span className="text-[9px] text-cyan-400 font-black uppercase mb-1 tracking-wider">NT$</span>
                    <span className="text-white font-black text-xl">{currentTWDFromCalc.toLocaleString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[7, 8, 9, '÷', 4, 5, 6, '×', 1, 2, 3, '-', 'C', 0, '=', '+'].map((btn) => (
                    <button 
                      key={btn} 
                      onClick={() => handleCalcInput(btn.toString())} 
                      className={`h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all active:scale-90 ${
                        // Fix for line 295: Removed redundant and type-unsafe '|| btn === 0' check.
                        // 'typeof btn === "number"' already covers the value 0 and avoids unintentional
                        // string-to-number comparison which causes a TypeScript overlap error.
                        typeof btn === 'number' 
                          ? 'bg-slate-700 text-white shadow-lg' 
                          : btn === 'C' 
                            ? 'bg-slate-700 text-red-400 shadow-lg' 
                            : btn === '=' 
                              ? 'bg-cyan-500 text-white border-2 border-cyan-400 shadow-cyan-500/40' 
                              : 'bg-slate-800 text-cyan-400 border border-slate-600 shadow-lg'
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-end gap-3 px-1 text-right text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rate: {exchangeRate}</div>
              </div>

              {/* Fast Logging UI */}
              <div className="bg-white rounded-[2rem] p-6 flex flex-col gap-4 shadow-2xl text-slate-900 border border-white">
                <div className="text-[12px] font-black uppercase tracking-widest text-slate-400">快速消費記帳</div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="項目" value={logItemName} onChange={(e) => setLogItemName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-500" />
                  <input type="number" placeholder="金額" value={logAmount} onChange={(e) => setLogAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-500" />
                </div>
                <button onClick={handleAddLog} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl">確認記帳</button>
              </div>

              {/* History UI */}
              <div className="bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                <div className="px-7 py-6 flex justify-between border-b border-white/5 items-center">
                  <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest">History</div>
                  <div className="text-right text-xl font-black text-white">Total: ¥{totalExpenseJPY.toLocaleString()}</div>
                </div>
                <div className="p-5 space-y-3.5 max-h-[350px] overflow-y-auto no-scrollbar">
                  {expenseList.map(item => (
                    <div key={item.id} className="bg-white rounded-[1.8rem] p-5 flex justify-between items-center text-slate-900 shadow-md">
                      <div>
                         <div className="text-[15px] font-black">{item.title}</div>
                         <div className="text-[10px] font-bold text-slate-400">≈ NT${Math.round(item.val * parseFloat(exchangeRate)).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-black">¥{item.val.toLocaleString()}</div>
                        <button onClick={() => setExpenseList(prev => prev.filter(i => i.id !== item.id))} className="text-red-500 active:scale-90 transition-transform">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {expenseList.length === 0 && <div className="text-center py-10 text-slate-600 font-bold text-xs uppercase tracking-widest opacity-50">尚無記帳記錄</div>}
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. Shopping Tab */}
          {activeTab === 'shopping' && (
            <motion.div key="shopping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="font-black text-2xl tracking-widest mb-2 opacity-90 uppercase flex items-center gap-3">
                <ShoppingCart size={24} className="text-cyan-400" /> TO-BUY LIST
              </div>

              <div className="bg-white rounded-[2.2rem] p-7 text-slate-900 shadow-2xl border-t-8 border-cyan-500">
                <form onSubmit={addShopItem} className="space-y-4">
                  <input type="text" placeholder="*項目名稱 (例如: 吹風機、藥妝)" value={newShopItem.name} onChange={(e) => setNewShopItem({...newShopItem, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-cyan-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="商店 (選填)" value={newShopItem.store} onChange={(e) => setNewShopItem({...newShopItem, store: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none" />
                    <input type="number" placeholder="金額 (日圓)" value={newShopItem.jpy} onChange={(e) => setNewShopItem({...newShopItem, jpy: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-xl font-black text-sm uppercase shadow-xl active:scale-95 transition-all">加入清單</button>
                </form>
              </div>

              <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl text-slate-900 border border-white">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-[13px] font-black tracking-widest uppercase text-slate-400">待採購表格</h3>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[340px]">
                    <thead>
                      <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase">
                        <th className="px-5 py-4 text-center">買了</th>
                        <th className="px-3 py-4">項目</th>
                        <th className="px-3 py-4 text-right">日圓</th>
                        <th className="px-5 py-4 text-right">刪除</th>
                      </tr>
                    </thead>
                    <tbody className="text-[14px] font-black">
                      {shoppingList.map(item => (
                        <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-5 text-center">
                            <button onClick={() => setShoppingList(shoppingList.map(i => i.id === item.id ? { ...i, bought: !i.bought } : i))}>
                              {item.bought ? <CheckCircle2 size={20} className="text-emerald-500 mx-auto" /> : <Circle size={20} className="text-slate-200 mx-auto" />}
                            </button>
                          </td>
                          <td className={`px-3 py-5 ${item.bought ? 'line-through text-slate-300 font-medium' : 'text-slate-800'}`}>{item.name}</td>
                          <td className="px-3 py-5 text-right text-slate-700">¥{item.jpy.toLocaleString()}</td>
                          <td className="px-5 py-5 text-right"><button onClick={() => setShoppingList(shoppingList.filter(i => i.id !== item.id))} className="text-rose-300 hover:text-rose-500 transition-colors active:scale-90"><Trash2 size={18} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-7 py-7 bg-slate-900 text-white flex justify-between items-center">
                    <div className="text-[12px] font-black tracking-widest text-slate-500 uppercase">預算合計</div>
                    <div className="text-right">
                        <div className="text-xl font-black text-white leading-none mb-1.5">¥{totalShopJPY.toLocaleString()}</div>
                        <div className="text-[12px] font-bold text-cyan-400 leading-none">≈ NT${totalShopTWD.toLocaleString()}</div>
                    </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. Info Tab */}
          {activeTab === 'info' && (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pb-12">
              <div className="font-black text-2xl tracking-widest mb-2 opacity-90 uppercase">INFO</div>

              <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl border-t-8 border-indigo-600">
                <div className="flex items-center gap-3 mb-6 text-left">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm"><Hotel size={26} /></div>
                  <h3 className="text-xl font-black tracking-tight">飯店資訊 (上野)</h3>
                </div>
                <div className="space-y-5">
                  <div className="text-[17px] font-black text-slate-900 leading-tight">Ostay Ueno Hotel Apartment</div>
                  <div className="text-[12px] font-bold text-slate-400 leading-relaxed">東京都 Taito-ku Higashiueno 5-22-4, 日本</div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Ostay+Ueno+Tokyo`, '_blank')} className="bg-black text-white py-4 rounded-xl font-black text-[12px] uppercase shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"><MapPin size={16} /> 開啟地圖</button>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1 text-center">入住: 16:00-22:00</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none text-center">退房: 10:00 前</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest border-t border-slate-100 pt-4">住宿日期: 2026.02.01 — 02.04</div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl border-t-8 border-rose-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 shadow-sm"><ShieldAlert size={26} /></div>
                  <h3 className="text-xl font-black tracking-tight">2026 出入境禁令</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-inner">
                    <div className="flex items-center gap-2 mb-4 text-rose-400 font-black text-[12px] border-b border-white/10 pb-3 uppercase tracking-widest"><AlertTriangle size={16} /> 日本入境嚴禁</div>
                    <ul className="space-y-4 text-xs font-bold leading-relaxed">
                      <li>• <strong className="text-rose-400 underline underline-offset-4 decoration-rose-500/50">所有肉製品</strong>：含肉乾、香腸、含肉塊之零食。最高罰 300 萬日圓。</li>
                      <li>• <strong className="text-rose-400 underline underline-offset-4 decoration-rose-500/50">黃金逾 1kg</strong>：金飾、金條總重超過 1 公斤必須主動申報。</li>
                    </ul>
                  </div>
                  <div className="bg-[#06C755]/10 border border-[#06C755]/30 rounded-2xl p-6 text-slate-900 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-[#06C755] font-black text-xs uppercase"><MessageCircle size={18} /> 拍照諮詢 LINE</div>
                    <p className="text-xs font-bold text-slate-600 mb-5 leading-relaxed">如果不確定物品是否能帶入台灣？加入防檢局 LINE 傳送照片即時確認。</p>
                    <button onClick={() => window.open('https://line.me/R/ti/p/%40eqq3136f', '_blank')} className="w-full bg-[#06C755] text-white py-4 rounded-xl font-black text-xs uppercase shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">開啟防檢局 LINE</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Itinerary Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-3 pb-3 sm:px-0 sm:pb-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDay(null)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 32, stiffness: 280 }} 
              className="relative w-full max-w-md bg-white rounded-[2.8rem] border border-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0" />
              <div className={`px-7 py-7 bg-gradient-to-br ${selectedDay.color} text-white shrink-0 relative`}>
                <div className="flex justify-between items-center mb-5">
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80 block mb-1">{selectedDay.day} · {selectedDay.date}</span>
                    <h2 className="text-2xl font-black tracking-tight truncate leading-none">{selectedDay.title}</h2>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="bg-white/10 p-2.5 rounded-full active:scale-90 transition-transform"><X size={22} /></button>
                </div>
                {selectedDay.flightInfo && (
                  <div className="p-4.5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2 text-[9px] font-black opacity-70 mb-1.5 uppercase tracking-wider"><Plane size={12} /> {selectedDay.flightInfo.no}</div>
                    <div className="text-base font-black flex justify-between items-center leading-none">
                      <span>{selectedDay.flightInfo.route}</span>
                      <span className="text-[10px] opacity-60 bg-black/20 px-2.5 py-1 rounded-md font-black uppercase">{selectedDay.flightInfo.terminal}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-8 py-8 overflow-y-auto no-scrollbar flex-1 bg-white">
                <div className="space-y-8 relative ml-3">
                  <div className="absolute left-[7.5px] top-2 bottom-2 w-[1.5px] bg-slate-100" />
                  {selectedDay.extendedDetail.map((step, i) => (
                    <div key={i} className="flex gap-7 relative items-start">
                      <div className="w-4 h-4 rounded-full bg-cyan-500 border-[3.5px] border-white z-10 mt-1 shadow-[0_0_12px_rgba(6,182,212,0.4)]" />
                      <div>
                        <div className="text-[10px] font-black text-cyan-600 mb-1 tracking-widest uppercase">{step.time}</div>
                        <div className="text-[16px] font-black text-slate-800 leading-snug">{step.task}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                  <div className="flex items-center gap-2.5 mb-3">
                    <Info size={16} className="text-cyan-500" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">NOTE / 備註</span>
                  </div>
                  <p className="text-slate-600 text-[12px] font-bold leading-relaxed italic pl-4 border-l-2 border-cyan-500/20">{selectedDay.memo}</p>
                </div>
              </div>
              <div className="px-7 py-7 border-t border-slate-100 bg-white shrink-0">
                <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedDay.mapQuery)}`, '_blank')} className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Navigation size={18} /> 前往地圖指南
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Filter Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[300px] px-6 z-[60]">
        <div className="bg-slate-900/95 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5 rounded-full p-2 flex justify-around items-center h-16">
          <button onClick={() => { setFilter('transport'); setActiveTab('itinerary'); }} className={`p-3 rounded-full transition-colors ${filter === 'transport' ? 'text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-slate-600'}`}><Plane size={20} /></button>
          <button onClick={() => { setFilter('shopping'); setActiveTab('itinerary'); }} className={`p-3 rounded-full transition-colors ${filter === 'shopping' ? 'text-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.4)]' : 'text-slate-600'}`}><ShoppingBag size={20} /></button>
          <div className="relative -top-5">
            <motion.div 
                whileTap={{ scale: 0.9 }} 
                onClick={() => { setFilter('all'); setActiveTab('itinerary'); setCurrentBg(ITINERARY_DATA[0].bgUrl); }} 
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer ${filter === 'all' ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'bg-slate-800'}`}
            >
              <Snowflake size={26} />
            </motion.div>
          </div>
          <button onClick={() => { setFilter('attraction'); setActiveTab('itinerary'); }} className={`p-3 rounded-full transition-colors ${filter === 'attraction' ? 'text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'text-slate-600'}`}><Star size={20} /></button>
          <button onClick={() => { setFilter('ski'); setActiveTab('itinerary'); }} className={`p-3 rounded-full transition-colors ${filter === 'ski' ? 'text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.4)]' : 'text-slate-600'}`}><CloudSnow size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default App;
