'use client';
import React, { useState } from 'react';
import { 
  FaTerminal, 
  FaCopy, 
  FaCheck, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaChartBar,
  FaMicrochip
} from 'react-icons/fa';
import { HiOutlineCpuChip } from 'react-icons/hi2';

interface CaseStudyFormatterProps {
  content: string;
  sectionType: 'architecture' | 'challenge' | 'solution';
}

// Helper to copy text to clipboard
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-gray-300 hover:text-white bg-[#1a2238] hover:bg-[#253254] rounded border border-gray-700/60 transition-colors shadow-sm"
      title="Copy to clipboard"
    >
      {copied ? <FaCheck className="text-[#16f2b3]" size={11} /> : <FaCopy size={11} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// Check if string is a box-drawing ASCII diagram
function isAsciiDiagram(text: string): boolean {
  const boxChars = ['┌', '─', '┐', '│', '└', '┘', '├', '┤', '┬', '┴', '┼', '▲', '▼', '◄', '►', '├──', '└──►'];
  return boxChars.some(char => text.includes(char)) || text.includes('Raw Input Byte Stream:');
}

// Check if block is code
function isCodeBlock(text: string): boolean {
  if (text.startsWith('```') && text.endsWith('```')) return true;
  const codeKeywords = [
    'if (code ==', 
    'class BitWriter', 
    'void write_bits', 
    'uint64_t buffer_', 
    'buffer_ |=', 
    'while (bit_count_', 
    'sink_.push_back',
    'std::string',
    'std::vector',
    'output.append',
    'prev_string ='
  ];
  return codeKeywords.some(kw => text.includes(kw));
}

// Parse markdown table into headers and rows
function parseMarkdownTable(tableLines: string[]) {
  if (tableLines.length < 2) return null;
  const parseRow = (line: string) => 
    line.split('|').map(s => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length - 1);

  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).map(parseRow).filter(r => r.length > 0);
  return { headers, rows };
}

export const CaseStudyFormatter: React.FC<CaseStudyFormatterProps> = ({ content, sectionType }) => {
  if (!content) return null;

  // Split content into major blocks by double newlines or section boundaries
  const rawBlocks = content.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  const renderBlock = (block: string, index: number) => {
    // 1. Check for Markdown Table
    const lines = block.split('\n');
    const isTable = lines.length >= 3 && lines[0].startsWith('|') && lines[0].endsWith('|') && lines[1].includes('---');
    if (isTable) {
      const tableData = parseMarkdownTable(lines);
      if (tableData) {
        return (
          <div key={index} className="my-6 overflow-hidden rounded-xl border border-[#1f223c] bg-[#070b16] shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#11172a] border-b border-[#1f223c]">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#16f2b3] uppercase tracking-wider">
                <FaChartBar size={12} />
                <span>Quantified Benchmark Telemetry</span>
              </div>
              <CopyButton text={block} />
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
                <thead>
                  <tr className="bg-[#0b1022] border-b border-[#1f223c] text-gray-300">
                    {tableData.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 font-semibold text-teal-300 tracking-wide">
                        {h.replace(/[*_]/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182038]">
                  {tableData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#11172a]/70 transition-colors">
                      {row.map((cell, cIdx) => {
                        const cleanCell = cell.replace(/[*_]/g, '');
                        const isPass = cleanCell.includes('100% Pass');
                        const isSpeed = cleanCell.includes('MB/s') || cleanCell.includes('GB/s');
                        const isRatio = cleanCell.includes(': 1');
                        return (
                          <td key={cIdx} className="px-4 py-2.5 text-gray-300 whitespace-nowrap">
                            {isPass ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <FaCheckCircle size={10} />
                                {cleanCell}
                              </span>
                            ) : isSpeed ? (
                              <span className="text-[#16f2b3] font-semibold">{cleanCell}</span>
                            ) : isRatio ? (
                              <span className="text-pink-400 font-semibold">{cleanCell}</span>
                            ) : (
                              cleanCell
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }

    // 2. Check for ASCII Architecture / State Machine Diagram
    if (isAsciiDiagram(block)) {
      return (
        <div key={index} className="my-6 rounded-xl border border-[#1f274a] bg-[#050811] shadow-[0_4px_30px_rgba(22,242,179,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1428] border-b border-[#1f274a]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#16f2b3] tracking-wider uppercase">
              <FaTerminal size={12} />
              <span>Architectural Data Flow & Memory Layout</span>
            </div>
            <CopyButton text={block} />
          </div>
          <div className="p-4 sm:p-5 overflow-x-auto custom-scrollbar">
            <pre className="font-mono text-[12px] sm:text-[13px] leading-relaxed text-[#16f2b3] tracking-wide select-text">
              {block}
            </pre>
          </div>
        </div>
      );
    }

    // 3. Check for Code Block (C++, Go, etc.)
    if (isCodeBlock(block)) {
      const cleanCode = block.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
      return (
        <div key={index} className="my-5 rounded-xl border border-[#1e293b] bg-[#070b14] shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="ml-2 text-xs font-mono text-gray-400 font-medium">Core Algorithmic Logic</span>
            </div>
            <CopyButton text={cleanCode} />
          </div>
          <div className="p-4 overflow-x-auto custom-scrollbar">
            <pre className="font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed">
              <code>{cleanCode}</code>
            </pre>
          </div>
        </div>
      );
    }

    // 4. Check for Challenge Card
    const challengeMatch = block.match(/^(?:CHALLENGE\s+(\d+|[A-Z0-9]+)\s*[—–\-:]\s*)(.*)/i);
    if (challengeMatch || (sectionType === 'challenge' && block.startsWith('CHALLENGE '))) {
      const titleLine = lines[0];
      const match = titleLine.match(/^(?:CHALLENGE\s+(\d+|[A-Z0-9]+)\s*[—–\-:]\s*)(.*)/i);
      const challengeNum = match ? match[1] : '01';
      const challengeTitle = match ? match[2] : titleLine.replace(/^CHALLENGE\s+/, '');
      const bodyContent = lines.slice(1).join('\n').trim();

      return (
        <div 
          key={index} 
          className="my-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#170e24] via-[#0f1224] to-[#0d1020] border border-pink-500/30 shadow-[0_4px_25px_rgba(236,72,153,0.08)] transition-all hover:border-pink-500/50"
        >
          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-pink-500/15 text-pink-400 border border-pink-500/30">
              <FaExclamationTriangle size={11} />
              <span>CHALLENGE {challengeNum}</span>
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
              {challengeTitle}
            </h4>
          </div>
          {bodyContent && (
            <div className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed space-y-2 whitespace-pre-line pl-1 border-l-2 border-pink-500/20">
              {bodyContent}
            </div>
          )}
        </div>
      );
    }

    // 5. Check for Solution Card
    const solutionMatch = block.match(/^(?:SOLUTION\s+(\d+|[A-Z0-9]+)\s*[—–\-:]\s*)(.*)/i);
    if (solutionMatch || (sectionType === 'solution' && block.startsWith('SOLUTION '))) {
      const titleLine = lines[0];
      const match = titleLine.match(/^(?:SOLUTION\s+(\d+|[A-Z0-9]+)\s*[—–\-:]\s*)(.*)/i);
      const solutionNum = match ? match[1] : '01';
      const solutionTitle = match ? match[2] : titleLine.replace(/^SOLUTION\s+/, '');
      const bodyContent = lines.slice(1).join('\n').trim();

      // Check if body content has internal code
      const hasCode = isCodeBlock(bodyContent);

      return (
        <div 
          key={index} 
          className="my-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c1a2c] via-[#0d1428] to-[#0a1020] border border-violet-500/30 shadow-[0_4px_25px_rgba(139,92,246,0.08)] transition-all hover:border-violet-500/50"
        >
          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
              <FaCheckCircle size={11} />
              <span>SOLUTION {solutionNum}</span>
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
              {solutionTitle}
            </h4>
          </div>

          {bodyContent && (
            <div className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed space-y-3 pl-1 border-l-2 border-violet-500/20">
              {hasCode ? (
                // Split body content around code if needed
                renderInnerContent(bodyContent)
              ) : (
                <p className="whitespace-pre-line">{bodyContent}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    // 6. Check for Major Section Subheading (ALL CAPS LINE)
    const isSubheading = lines.length === 1 && block === block.toUpperCase() && block.length > 5 && !block.startsWith('•');
    if (isSubheading || block.endsWith(':') && block.length < 60) {
      const cleanHeader = block.replace(/:$/, '');
      return (
        <div key={index} className="mt-8 mb-4 flex items-center gap-3">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-[#16f2b3] to-violet-500"></div>
          <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#16f2b3] flex items-center gap-2">
            <FaMicrochip className="text-teal-400" size={14} />
            <span>{cleanHeader}</span>
          </h4>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#1f293d] to-transparent"></div>
        </div>
      );
    }

    // 7. Check for Benchmark Summary List
    const isBenchmarkList = lines.some(l => l.includes('CR ') && l.includes('MB/s'));
    if (isBenchmarkList) {
      return (
        <div key={index} className="my-5 p-4 sm:p-5 rounded-xl border border-[#1f2746] bg-[#090e1e]/90 shadow-md">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold mb-3 flex items-center gap-2">
            <FaChartBar size={12} />
            <span>Quantified Benchmark Results</span>
          </div>
          <div className="space-y-2">
            {lines.map((l, li) => {
              if (l.startsWith('•')) {
                const parts = l.replace(/^•\s*/, '').split('|').map(p => p.trim());
                return (
                  <div key={li} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-[#0d1428] border border-[#1b2342] text-xs font-mono gap-1 hover:bg-[#121c38] transition-colors">
                    <span className="text-white font-bold">{parts[0]}</span>
                    <div className="flex flex-wrap items-center gap-2 text-gray-300">
                      {parts.slice(1).map((p, pi) => (
                        <span key={pi} className="px-2 py-0.5 rounded bg-[#162144] text-[#16f2b3]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return <p key={li} className="text-xs text-gray-400 font-mono">{l}</p>;
            })}
          </div>
        </div>
      );
    }

    // 8. Standard Bullet List or Paragraph
    const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
    if (hasBullets) {
      return (
        <div key={index} className="my-3 space-y-2.5">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('•')) {
              return (
                <div key={lIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16f2b3] mt-2 flex-shrink-0 shadow-[0_0_8px_#16f2b3]"></span>
                  <span className="flex-1 whitespace-pre-line">{trimmed.replace(/^•\s*/, '')}</span>
                </div>
              );
            } else if (trimmed.startsWith('-')) {
              return (
                <div key={lIdx} className="ml-5 flex items-start gap-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-pink-400 mt-2 flex-shrink-0"></span>
                  <span className="flex-1 whitespace-pre-line">{trimmed.replace(/^-\s*/, '')}</span>
                </div>
              );
            }
            return (
              <p key={lIdx} className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                {line}
              </p>
            );
          })}
        </div>
      );
    }

    // Default Paragraph Block
    return (
      <p key={index} className="my-3 text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line">
        {block}
      </p>
    );
  };

  // Helper for rendering inside solution cards
  const renderInnerContent = (text: string) => {
    const subBlocks = text.split(/\n{2,}/);
    return (
      <div className="space-y-3">
        {subBlocks.map((sb, sIdx) => {
          if (isCodeBlock(sb)) {
            const cleanCode = sb.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
            return (
              <div key={sIdx} className="my-2 rounded-lg border border-[#1f274a] bg-[#070b14] overflow-hidden">
                <div className="px-3 py-1.5 bg-[#0f172a] border-b border-[#1f274a] flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>Implementation Logic</span>
                  <CopyButton text={cleanCode} />
                </div>
                <pre className="p-3 font-mono text-xs text-cyan-300 overflow-x-auto custom-scrollbar">
                  <code>{cleanCode}</code>
                </pre>
              </div>
            );
          }
          return (
            <p key={sIdx} className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
              {sb}
            </p>
          );
        })}
      </div>
    );
  };

  return <div className="space-y-4">{rawBlocks.map(renderBlock)}</div>;
};
