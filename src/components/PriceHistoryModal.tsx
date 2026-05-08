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
    // Simulate fetching 1 year of price history in Rupees
    setTimeout(() => {
      const mockData = Array.from({ length: 12 }).map((_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        price: Math.floor(1500 + Math.random() * 3000) // Random price between 1500 and 4500
      }));
      setData(mockData);
      setLoading(false);
    }, 1500);

  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#F4F4F0] border-4 border-black w-full max-w-4xl p-6 relative flex flex-col shadow-[16px_16px_0px_0px_#FF4500] max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4 shrink-0">
          <div>
            <h2 className="font-black text-2xl uppercase tracking-tighter mb-1">Price History</h2>
            <p className="font-mono text-sm text-gray-600 truncate max-w-xl">{productTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-4xl font-black leading-none hover:text-[#FF4500] transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Chart Content */}
        <div className="w-full min-h-[250px] flex-grow flex items-center justify-center">
          {loading ? (
            <div className="font-mono animate-pulse text-xl font-bold tracking-widest text-[#FF4500]">
              // FETCHING_HISTORICAL_DATA...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                <XAxis dataKey="month" stroke="#000" tick={{ fontFamily: 'monospace', fontSize: 12 }} />
                <YAxis stroke="#000" tick={{ fontFamily: 'monospace', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff', fontFamily: 'monospace', borderRadius: 0 }}
                  itemStyle={{ color: '#FF4500', fontWeight: 'bold' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="price" 
                  stroke="#FF4500" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#000', stroke: '#FF4500', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#FF4500', stroke: '#000' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer */}
        <button 
          onClick={onClose}
          className="mt-8 shrink-0 w-full bg-black text-white py-4 font-mono font-bold text-xl uppercase tracking-widest hover:bg-[#FF4500] hover:text-black transition-colors"
        >
          [ CLOSE_HISTORY ]
        </button>

      </div>
    </div>
  );
}
