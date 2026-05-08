"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

export default function PriceHistoryModal({ isOpen, onClose, productId, productTitle }: PriceHistoryModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    setTimeout(() => {
      const basePrice = 2000 + Math.random() * 5000;
      const mockData = Array.from({ length: 12 }).map((_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        price: Math.floor(basePrice + (Math.random() - 0.3) * 1500)
      }));
      setData(mockData);
      setLoading(false);
    }, 1200);
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(4px)',
        padding: '16px',
      }}
    >
      <div 
        style={{ boxShadow: '12px 12px 0px 0px #FF4500', maxHeight: '85vh' }}
        className="bg-[#F4F4F0] border-[3px] border-[#0A0A0A] w-full max-w-1/2 relative flex flex-col overflow-hidden"
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b-[3px] border-[#0A0A0A] bg-[#0A0A0A] text-[#F4F4F0] px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FF4500]" />
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Price_History</h2>
          </div>
          <button 
            onClick={onClose}
            className="font-mono text-xs tracking-widest hover:text-[#FF4500] transition-colors uppercase font-bold"
          >
            [Close]
          </button>
        </div>

        {/* Product title strip */}
        <div className="px-5 py-3 border-b-[3px] border-[#0A0A0A]/10 shrink-0">
          <p className="font-mono text-[10px] text-[#6B6B6B] truncate tracking-wider uppercase">{productTitle}</p>
        </div>

        {/* Chart Content */}
        <div className="flex-grow p-5 flex items-center justify-center min-h-[280px] overflow-y-auto">
          {loading ? (
            <div className="font-mono text-[#FF4500] text-sm font-bold tracking-[0.2em]">
              Fetching_Historical_Data<span className="cursor-blink" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.08} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#0A0A0A" 
                  tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#6B6B6B' }} 
                  tickLine={false}
                  axisLine={{ strokeWidth: 2 }}
                />
                <YAxis 
                  stroke="#0A0A0A" 
                  tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#6B6B6B' }} 
                  tickFormatter={(val) => `₹${val.toLocaleString()}`} 
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0A0A0A', 
                    border: '2px solid #FF4500', 
                    color: '#fff', 
                    fontFamily: 'monospace', 
                    fontSize: '11px',
                    borderRadius: 0,
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#FF4500', fontWeight: 'bold' }}
                  labelStyle={{ color: '#A8A8A0', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="price" 
                  stroke="#FF4500" 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: '#0A0A0A', stroke: '#FF4500', strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: '#FF4500', stroke: '#0A0A0A', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer */}
        <button 
          onClick={onClose}
          className="shrink-0 w-full bg-[#0A0A0A] text-[#F4F4F0] py-4 font-mono font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#FF4500] hover:text-[#0A0A0A] transition-colors duration-200 border-t-[3px] border-[#0A0A0A]"
        >
          [ Close_History ]
        </button>
      </div>
    </div>
  );
}
