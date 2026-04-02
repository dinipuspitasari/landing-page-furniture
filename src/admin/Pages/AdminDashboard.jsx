import { useState, useEffect } from "react";
import { Card, Spinner } from "flowbite-react";
import { HiOutlineClock, HiOutlineCalendar, HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineCollection } from "react-icons/hi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import NavAdmin from "../../components/NavAdmin";
import AppFooter from "../../components/AppFooter";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// --- Mock Data ---
const mockRevenueData = [
  { name: "Sen", total: 1200000 },
  { name: "Sel", total: 2100000 },
  { name: "Rab", total: 800000 },
  { name: "Kam", total: 3200000 },
  { name: "Jum", total: 1500000 },
  { name: "Sab", total: 5400000 },
  { name: "Min", total: 4300000 },
];

const mockTopSelling = [
  { id: 1, name: "Sofa Retro Kuning", sold: 124, revenue: 31000000 },
  { id: 2, name: "Meja Kayu Jati", sold: 98, revenue: 14700000 },
  { id: 3, name: "Lampu Hias Aesthetic", sold: 85, revenue: 4250000 },
];

export default function AdminDashboard() {
  const [time, setTime] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time clock setup
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real data for products & catalogs
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Fetch products
        const resProd = await fetch(`${API_BASE}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataProd = await resProd.json();
        
        // Fetch catalogs
        const resCat = await fetch(`${API_BASE}/api/catalogs`);
        const dataCat = await resCat.json();

        if (dataProd.status === "success") setProducts(dataProd.data || []);
        if (dataCat.status === "success") setCatalogs(dataCat.data || []);
      } catch (err) {
        console.error("Dashboard dat fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Derived Real Data
  const recentProducts = [...products].reverse().slice(0, 3); // Top 3 recently added/updated

  // Formatting helpers
  const formatTime = (date) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (date) => date.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const formatRupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);

  // Calendar logic (Simple Current Month Calendar)
  const currentYear = time.getFullYear();
  const currentMonth = time.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  
  const generateCalendarDays = () => {
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="p-2 text-center text-transparent">0</div>);
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const isToday = i + 1 === time.getDate();
      return (
        <div key={i + 1} className={`p-2 text-center text-sm font-medium rounded-full ${isToday ? "bg-[#bd4135] text-white shadow-md font-bold" : "text-gray-700"}`}>
          {i + 1}
        </div>
      );
    });
    return [...blanks, ...days];
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6 font-sans">
      <div className="w-full max-w-6xl">
        <NavAdmin />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-10">
          {/* Header Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Ringkasan aktivitas dan performa toko furnitur Anda.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
            {/* Kiri: Waktu & Kalender */}
            <div className="col-span-1 flex flex-col gap-6">
              {/* Card Jam */}
              <div className="rounded-3xl bg-amber-100 p-6 shadow-sm border border-[#bd4135]/20 text-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-[#bd4135]/10">
                  <HiOutlineClock className="w-32 h-32" />
                </div>
                <h2 className="text-lg font-bold text-[#bd4135] mb-1">Waktu Real-Time</h2>
                <div className="text-4xl font-black text-gray-900 tracking-tight my-2 font-display">{formatTime(time)}</div>
                <div className="text-sm font-medium text-gray-600">{formatDate(time)}</div>
              </div>

              {/* Card Kalender */}
              <div className="rounded-3xl bg-red-100 p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <HiOutlineCalendar className="w-5 h-5 text-[#4da394]" /> Kalender
                  </h2>
                  <span className="text-xs font-bold text-[#4da394] bg-[#4da394]/10 px-3 py-1 rounded-full">
                    {time.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
                    <div key={d} className="text-xs font-bold text-gray-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays()}
                </div>
              </div>
            </div>

            {/* Kanan: Summary Stats & Charts */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-[#bd4135] p-5 shadow-md border-4 border-[#f6ebd8] flex flex-col justify-center transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 text-white rounded-2xl"><HiOutlineCube className="w-8 h-8" /></div>
                    <div>
                      <p className="text-sm text-[#f6ebd8] font-bold">Total Produk</p>
                      {loading ? <Spinner size="sm" color="failure" /> : <h3 className="text-3xl font-black text-white font-display tracking-wide">{products.length}</h3>}
                    </div>
                  </div>
                </div>
                
                <div className="rounded-3xl bg-[#f9d26b] p-5 shadow-md border-4 border-white flex flex-col justify-center transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/40 text-yellow-800 rounded-2xl"><HiOutlineCollection className="w-8 h-8" /></div>
                    <div>
                      <p className="text-sm text-yellow-800 font-bold">Total Katalog</p>
                      {loading ? <Spinner size="sm" color="warning" /> : <h3 className="text-3xl font-black text-yellow-900 font-display tracking-wide">{catalogs.length}</h3>}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#4da394] p-5 shadow-md border-4 border-[#E2ECE9] flex flex-col justify-center transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 text-white rounded-2xl"><HiOutlineCurrencyDollar className="w-8 h-8" /></div>
                    <div>
                      <p className="text-sm text-[#E2ECE9] font-bold">Pemasukan (Mgg)</p>
                      <h3 className="text-2xl font-black text-white font-display tracking-tight">{formatRupiah(18500000)}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pemasukan Chart */}
              <div className="rounded-3xl bg-orange-300/80 p-6 shadow-sm border-2 border-[#4da394]/20 flex-1">
                <h2 className="font-bold text-[#4da394] mb-6 flex items-center gap-2">
                  Grafik Pemasukan <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Mock</span>
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(val) => `Rp${val / 1000000}M`} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => formatRupiah(value)} />
                      <Line type="monotone" dataKey="total" stroke="#4da394" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 3 Selling (Mock) */}
            <div className="rounded-3xl bg-purple-300 p-6 shadow-sm border-2 border-[#f9d26b]/40">
              <h2 className="font-bold text-[#bd4135] mb-4 flex items-center justify-between">
                Top 3 Produk Terlaris
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Mock</span>
              </h2>
              <div className="flex flex-col gap-4">
                {mockTopSelling.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? "bg-[#f9d26b] text-yellow-900" : index === 1 ? "bg-gray-200 text-gray-700" : "bg-[#f6ebd8] text-[#bd4135]"}`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.sold} Terjual</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#4da394]">{formatRupiah(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Produk Terbaru (Real Date) */}
            <div className="rounded-3xl bg-[#E2ECE9] p-6 shadow-sm border-2 border-[#4da394]/20">
              <h2 className="font-bold text-[#4da394] mb-4">Baru Ditambahkan</h2>
              {loading ? (
                <div className="flex justify-center p-10"><Spinner /></div>
              ) : recentProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada produk.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <img src={`${API_BASE}${p.foto_url}`} alt={p.nama_produk} className="w-14 h-14 rounded-xl object-cover" onError={(e) => e.target.src="https://via.placeholder.com/150"} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{p.nama_produk}</h4>
                        <p className="text-xs text-gray-500 font-medium">Katalog: <span className="text-[#bd4135]">{p.catalog?.nama || "-"}</span></p>
                      </div>
                      <div>
                        <span className="bg-[#f6ebd8] text-[#bd4135] text-xs font-bold px-3 py-1 rounded-full">Baru</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
        <AppFooter />
      </div>
    </div>
  );
}
