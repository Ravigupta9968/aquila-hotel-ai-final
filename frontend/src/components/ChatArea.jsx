import React, { useRef, useEffect, useState } from 'react';
import { User, Sparkles, Table as TableIcon, BarChart2, LineChart, PieChart, Settings2, Database, Search } from 'lucide-react';
import embed from 'vega-embed';

const ChatArea = ({ messages, isLoading, onFollowUpClick }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'end' });
    }, 150);
    return () => clearTimeout(scrollTimeout);
  }, [messages, isLoading]);

  const formatText = (text) => {
    if (!text) return "";
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  const VegaChart = ({ spec }) => {
    const chartRef = useRef(null);
    const [chartType, setChartType] = useState('auto');
    const [showOptions, setShowOptions] = useState(false);
    
    useEffect(() => {
      if (chartRef.current && spec) {
        try {
          let chartSpec = typeof spec === 'string' ? JSON.parse(spec) : JSON.parse(JSON.stringify(spec));
          
          if (chartType !== 'auto' && chartSpec.mark) {
            if (chartType === 'line') {
              chartSpec.mark = { type: 'line', point: true, strokeWidth: 3, color: '#2563eb' };
            } else if (chartType === 'bar') {
              chartSpec.mark = { type: 'bar', cornerRadiusEnd: 6, color: '#3b82f6' };
            } else if (chartType === 'pie') {
              const xField = chartSpec.encoding?.x?.field;
              const yField = chartSpec.encoding?.y?.field;
              chartSpec = {
                ...chartSpec,
                mark: { type: 'arc', innerRadius: 60, cornerRadius: 4 },
                encoding: {
                  theta: { field: yField || chartSpec.encoding?.y?.field, type: 'quantitative' },
                  color: { field: xField || chartSpec.encoding?.x?.field, type: 'nominal', legend: { title: null } }
                }
              };
            }
          }
          
          // Light theme chart configuration
          chartSpec.background = 'transparent';
          chartSpec.width = 'container';
          chartSpec.config = {
            ...chartSpec.config,
            axis: { labelColor: '#64748b', titleColor: '#475569', gridColor: '#f1f5f9', domainColor: '#cbd5e1' },
            legend: { labelColor: '#475569', titleColor: '#334155' },
            title: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
            view: { stroke: 'transparent' },
          };
          
          embed(chartRef.current, chartSpec, { 
            actions: { export: true, source: false, compiled: false, editor: false },
            renderer: 'svg'
          }).catch(console.error);
          
        } catch (e) {
          console.error("Vega Chart Error:", e);
        }
      }
    }, [spec, chartType]);
    
    const chartOptions = [
      { type: 'auto', label: 'Auto', icon: BarChart2 },
      { type: 'line', label: 'Line', icon: LineChart },
      { type: 'bar', label: 'Bar', icon: BarChart2 },
      { type: 'pie', label: 'Pie', icon: PieChart }
    ];
    
    return (
      <div className="mt-5 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wider">
            <BarChart2 size={18} className="text-blue-600" /> Data Visualization
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Settings2 size={14} /> Customize
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 p-2 min-w-[150px] animate-in fade-in slide-in-from-top-2">
                {chartOptions.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => { setChartType(type); setShowOptions(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      chartType === type 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div ref={chartRef} className="w-full"></div>
      </div>
    );
  };

  const DataTable = ({ data }) => {
    const [showTable, setShowTable] = useState(false);
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    const headers = Object.keys(data[0]);
    
    return (
      <div className="mt-4">
        <button 
          onClick={() => setShowTable(!showTable)} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
        >
          <TableIcon size={18} className={showTable ? "text-blue-600" : "text-slate-400"} /> 
          {showTable ? 'Hide Raw Data' : 'View Raw Data'} <span className="text-slate-400 font-normal ml-1">({data.length} rows)</span>
        </button>
        {showTable && (
          <div className="mt-4 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm max-h-[400px]">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                <tr>{headers.map((h, i) => <th key={i} className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">{h.replace(/_/g, ' ')}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50/80 transition-colors">
                    {headers.map((h, ci) => <td key={ci} className="px-6 py-4 whitespace-nowrap">{row[h] !== null && row[h] !== undefined ? (typeof row[h] === 'number' ? (row[h] > 1000 ? `₹${Math.round(row[h]).toLocaleString('en-IN')}` : row[h]) : String(row[h])) : '-'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative scrollbar-thin bg-slate-50">
      <div className="flex flex-col items-center text-sm pb-32 pt-8">
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 mt-40 animate-in fade-in duration-700">
            <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <Sparkles size={40} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Aquila Intelligence</h2>
            <p className="mt-3 text-sm font-medium text-slate-500">Ask me anything about your business data.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`w-full py-8 px-4 transition-all ${msg.role === 'assistant' ? 'bg-white border-y border-slate-100 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)]' : 'bg-transparent'}`}>
              <div className="max-w-4xl mx-auto flex gap-5 md:gap-8 text-base">
                
                {/* Icons Area */}
                <div className="flex flex-col relative items-end shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <div className="relative h-10 w-10 rounded-full flex items-center justify-center bg-slate-800 text-white shadow-md border border-slate-700">
                      <User size={20} />
                    </div>
                  ) : (
                    <div className="relative h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg border border-blue-500">
                      <Sparkles size={20} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="relative flex w-full flex-col gap-3 leading-relaxed text-slate-700">
                  <div className="font-bold text-sm tracking-wide text-slate-900 mb-1">
                    {msg.role === 'user' ? 'You' : 'Aquila AI'}
                  </div>

                  {msg.text && (
                    <div 
                      className="prose prose-slate max-w-none text-[15px]" 
                      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} 
                    />
                  )}

                  {/* 🌟 FEATURE 1: CITATION UI */}
                  {msg.citations && msg.role === 'assistant' && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-100 text-blue-700 rounded-lg text-xs font-medium w-fit">
                      <Database size={13} className="opacity-70" />
                      <span>{msg.citations}</span>
                    </div>
                  )}

                  {msg.vegaChart && <VegaChart spec={msg.vegaChart} />}
                  {msg.tableData && <DataTable data={msg.tableData} />}

                  {/* 🌟 FEATURE 2: FOLLOW-UP QUERIES UI */}
                  {msg.follow_up && msg.follow_up.length > 0 && msg.role === 'assistant' && (
                    <div className="mt-5 pt-4 border-t border-slate-100/80">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Suggested Follow-ups
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.follow_up.map((query, idx) => (
                          <button
                            key={idx}
                            onClick={() => onFollowUpClick(query)}
                            className="flex items-center gap-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-full px-3.5 py-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                          >
                            <Search size={12} className="text-slate-400 group-hover:text-blue-500" /> {query}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading State... */}
        {isLoading && (
          <div className="w-full py-8 px-4 bg-white border-y border-slate-100 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)]">
            <div className="max-w-4xl mx-auto flex gap-5 md:gap-8">
              <div className="flex flex-col relative items-end shrink-0 mt-1">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg border border-blue-500 animate-pulse">
                   <Sparkles size={20} className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 font-semibold text-[15px] tracking-wide animate-pulse">
                  {typeof isLoading === 'string' ? isLoading : "Analyzing data..."}
                </span>
                <div className="flex gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms', animationDuration: '1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms', animationDuration: '1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms', animationDuration: '1s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-10" />
      </div>
    </div>
  );
};

export default ChatArea;