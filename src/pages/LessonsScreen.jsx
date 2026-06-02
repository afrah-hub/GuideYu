// LessonsScreen.jsx - Updated UI with modern styling and AI integration
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  ChevronLeft,
  X,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  RefreshCw,
  Target,
  Search,
  Trophy,
  Flame,
  Star,
  Bookmark,
  StickyNote,
  Maximize2,
  Minimize2,
  Info,
  Lightbulb,
  FileText,
  Activity,
  Award,
  AlertCircle,
  Glasses,
  Brain,
  Image as ImageIcon,
  Table as TableIcon,
  List,
  PenTool,
  Quote,
  ArrowLeft,
  MoreVertical,
  BookOpen,
} from 'lucide-react';

// Custom Markdown Parsers and Styled Renderers
const normalizeNewline = (text) => {
  if (!text) return '';
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
};

const formatInlineText = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`|\*.*?\*|_.*?_)/g);
  return parts.map((part, idx) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={idx} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-mono text-xs text-rose-500 dark:text-rose-400">{part.slice(1, -1)}</code>;
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={idx} className="italic text-slate-800 dark:text-zinc-200">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const parseMarkdown = (text) => {
  if (!text) return [];
  const normalizedText = normalizeNewline(text);
  const blocks = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
  let match;
  let lastIndex = 0;
  const tempBlocks = [];

  while ((match = codeBlockRegex.exec(normalizedText)) !== null) {
    const startIndex = match.index;
    const endIndex = codeBlockRegex.lastIndex;

    if (startIndex > lastIndex) {
      tempBlocks.push({
        type: 'text',
        content: normalizedText.substring(lastIndex, startIndex)
      });
    }

    tempBlocks.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2]
    });

    lastIndex = endIndex;
  }

  if (lastIndex < normalizedText.length) {
    tempBlocks.push({
      type: 'text',
      content: normalizedText.substring(lastIndex)
    });
  }

  const finalBlocks = [];

  for (const block of tempBlocks) {
    if (block.type === 'code') {
      finalBlocks.push(block);
      continue;
    }

    const paragraphs = block.content.split(/\n\n+/);
    for (let para of paragraphs) {
      para = para.trim();
      if (!para) continue;

      if (para.startsWith('#')) {
        const matchHeading = para.match(/^(#{1,6})\s+(.*)$/);
        if (matchHeading) {
          finalBlocks.push({
            type: 'heading',
            level: matchHeading[1].length,
            content: matchHeading[2]
          });
          continue;
        }
      }

      if (para.startsWith('>')) {
        const quoteContent = para.split('\n')
          .map(line => line.trim().replace(/^>\s*/, ''))
          .join('\n');
        finalBlocks.push({
          type: 'blockquote',
          content: quoteContent
        });
        continue;
      }

      if (para.startsWith('- ') || para.startsWith('* ') || /^\d+\.\s+/.test(para)) {
        const items = para.split(/\n/).map(line => line.trim()).filter(Boolean);
        const listItems = items.map(item => {
          return item.replace(/^(-\s*|\*\s*|\d+\.\s*)/, '');
        });
        finalBlocks.push({
          type: 'list',
          ordered: /^\d+\.\s+/.test(para),
          items: listItems
        });
        continue;
      }

      if (para.includes('|') && para.split('\n').length >= 2) {
        const lines = para.split('\n').map(l => l.trim()).filter(Boolean);
        const rows = lines.map(line => {
          return line.split('|').map(cell => cell.trim());
        });

        const isTable = rows.some(r => r.some(c => c.includes('---')));
        if (isTable) {
          const cleanRow = r => {
            let cells = [...r];
            if (cells[0] === '') cells.shift();
            if (cells[cells.length - 1] === '') cells.pop();
            return cells;
          };

          const header = cleanRow(rows[0]);
          const bodyRows = rows.slice(1)
            .filter(r => !r.some(c => c.includes('---')))
            .map(r => cleanRow(r));

          finalBlocks.push({
            type: 'table',
            headers: header,
            rows: bodyRows
          });
          continue;
        }
      }

      finalBlocks.push({
        type: 'paragraph',
        content: para
      });
    }
  }

  return finalBlocks;
};

const parseSections = (text) => {
  if (!text) return [];
  const normalizedText = normalizeNewline(text);
  const lines = normalizedText.split('\n');
  const sections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^##\s+(.*)$/);

    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: headingMatch[1].trim(),
        contentLines: []
      };
    } else {
      if (currentSection) {
        currentSection.contentLines.push(line);
      } else {
        currentSection = {
          title: "Introduction",
          contentLines: [line]
        };
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.map(sec => {
    const rawContent = sec.contentLines.join('\n').trim();
    return {
      title: sec.title,
      blocks: parseMarkdown(rawContent)
    };
  });
};

const sectionStyles = {
  "executive overview": {
    icon: Info,
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-900/50",
    text: "text-blue-700 dark:text-blue-400",
    accent: "from-blue-500 to-indigo-500"
  },
  "why this topic matters": {
    icon: Target,
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    border: "border-indigo-200 dark:border-indigo-900/50",
    text: "text-indigo-700 dark:text-indigo-400",
    accent: "from-indigo-500 to-purple-500"
  },
  "core concepts": {
    icon: Brain,
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-900/50",
    text: "text-purple-700 dark:text-purple-400",
    accent: "from-purple-500 to-pink-500"
  },
  "step-by-step explanation": {
    icon: List,
    bg: "bg-pink-50/50 dark:bg-pink-950/20",
    border: "border-pink-200 dark:border-pink-900/50",
    text: "text-pink-700 dark:text-pink-400",
    accent: "from-pink-500 to-rose-500"
  },
  "real-world examples": {
    icon: Sparkles,
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-900/50",
    text: "text-amber-700 dark:text-amber-400",
    accent: "from-amber-500 to-orange-500"
  },
  "industry use cases": {
    icon: Award,
    bg: "bg-orange-50/50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-900/50",
    text: "text-orange-700 dark:text-orange-400",
    accent: "from-orange-500 to-red-500"
  },
  "tools & technologies": {
    icon: PenTool,
    bg: "bg-rose-50/50 dark:bg-rose-950/20",
    border: "border-rose-200 dark:border-rose-900/50",
    text: "text-rose-700 dark:text-rose-400",
    accent: "from-rose-500 to-red-500"
  },
  "best practices": {
    icon: CheckCircle2,
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
    accent: "from-emerald-500 to-teal-500"
  },
  "common mistakes": {
    icon: AlertCircle,
    bg: "bg-rose-50/50 dark:bg-rose-950/20",
    border: "border-rose-200 dark:border-rose-900/50",
    text: "text-rose-700 dark:text-rose-400",
    accent: "from-rose-500 to-orange-500"
  },
  "security/performance considerations": {
    icon: Zap,
    bg: "bg-cyan-50/50 dark:bg-cyan-950/20",
    border: "border-cyan-200 dark:border-cyan-900/50",
    text: "text-cyan-700 dark:text-cyan-400",
    accent: "from-cyan-500 to-blue-500"
  },
  "summary": {
    icon: BookOpen,
    bg: "bg-teal-50/50 dark:bg-teal-950/20",
    border: "border-teal-200 dark:border-teal-900/50",
    text: "text-teal-700 dark:text-teal-400",
    accent: "from-teal-500 to-emerald-500"
  },
  "key takeaways": {
    icon: Flame,
    bg: "bg-red-50/50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-900/50",
    text: "text-red-700 dark:text-red-400",
    accent: "from-red-500 to-orange-500"
  },
  "interview questions": {
    icon: Trophy,
    bg: "bg-yellow-50/50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-900/50",
    text: "text-yellow-700 dark:text-yellow-600 dark:text-yellow-400",
    accent: "from-yellow-500 to-amber-500"
  },
  "mini practice tasks": {
    icon: Activity,
    bg: "bg-fuchsia-50/50 dark:bg-fuchsia-950/20",
    border: "border-fuchsia-200 dark:border-fuchsia-900/50",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
    accent: "from-fuchsia-500 to-purple-500"
  }
};

const getSectionStyle = (title) => {
  const cleanTitle = title.toLowerCase().trim();
  for (const [key, value] of Object.entries(sectionStyles)) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return value;
    }
  }
  return {
    icon: Info,
    bg: "bg-slate-50/50 dark:bg-zinc-900/50",
    border: "border-slate-200 dark:border-zinc-800",
    text: "text-slate-700 dark:text-zinc-400",
    accent: "from-slate-500 to-zinc-500"
  };
};

const CodeBlock = ({ language, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="w-full my-6 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative group/code-block">
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400 uppercase">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5 font-bold uppercase tracking-wider"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : null}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto text-[14px] leading-relaxed font-mono text-emerald-400 dark:text-emerald-300">
        <code>{content}</code>
      </pre>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  const sections = parseSections(content);

  return (
    <div className="w-full space-y-12">
      {sections.map((section, sIdx) => {
        const style = getSectionStyle(section.title);
        const IconComponent = style.icon;

        return (
          <motion.section
            key={sIdx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: Math.min(sIdx * 0.05, 0.3) }}
            className="w-full p-6 md:p-12 bg-white/70 dark:bg-[#111113] backdrop-blur-3xl border border-slate-200/80 dark:border-zinc-800/80 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all relative overflow-hidden group/section"
          >
            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${style.accent}`} />

            <div className="flex items-center gap-5 mb-8">
              <div className={`p-3.5 rounded-[1.25rem] ${style.bg} ${style.text} border border-current/10 shadow-inner flex items-center justify-center shrink-0`}>
                <IconComponent size={22} />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {section.title}
              </h2>
            </div>

            <div className="space-y-6 text-slate-700 dark:text-zinc-300">
              {section.blocks.map((block, bIdx) => {
                if (block.type === 'code') {
                  return (
                    <CodeBlock
                      key={bIdx}
                      language={block.language}
                      content={block.content}
                    />
                  );
                }

                if (block.type === 'list') {
                  const ListTag = block.ordered ? 'ol' : 'ul';
                  return (
                    <ListTag key={bIdx} className="list-none pl-1 my-5 space-y-4">
                      {block.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3.5 text-slate-700 dark:text-zinc-300 text-[16px] md:text-[18px] leading-[1.8] font-medium dark:font-light">
                          {block.ordered ? (
                            <span className={`font-black text-[16px] md:text-[18px] ${style.text} shrink-0 min-w-[24px]`}>{idx + 1}.</span>
                          ) : (
                            <span className="mt-2.5 w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-500 shrink-0" />
                          )}
                          <span className="flex-1">{formatInlineText(item)}</span>
                        </li>
                      ))}
                    </ListTag>
                  );
                }

                if (block.type === 'blockquote') {
                  return (
                    <blockquote key={bIdx} className="pl-6 border-l-4 border-slate-300 dark:border-zinc-700 italic my-6 text-slate-600 dark:text-zinc-400 text-[16px] md:text-[18px] leading-[1.8]">
                      {formatInlineText(block.content)}
                    </blockquote>
                  );
                }

                if (block.type === 'table') {
                  return (
                    <div key={bIdx} className="w-full overflow-x-auto my-6 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/10">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800">
                            {block.headers.map((h, idx) => (
                              <th key={idx} className="p-4 font-bold text-slate-900 dark:text-white text-xs md:text-sm uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-100 dark:border-zinc-800/40 hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-4 text-slate-700 dark:text-zinc-300 text-xs md:text-sm font-medium dark:font-light">{formatInlineText(cell)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (block.type === 'heading') {
                  const headingLevel = block.level;
                  const headingClasses = headingLevel === 1
                    ? "text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-8 mb-4"
                    : headingLevel === 2
                      ? "text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-6 mb-3 border-b border-slate-100 dark:border-zinc-800 pb-1.5"
                      : "text-base md:text-lg font-bold text-slate-800 dark:text-zinc-200 mt-4 mb-2";
                  return (
                    <h3 key={bIdx} className={headingClasses}>
                      {block.content}
                    </h3>
                  );
                }

                return (
                  <p key={bIdx} className="text-[16px] md:text-[18px] leading-[1.8] md:leading-[1.9] text-slate-700 dark:text-zinc-300 font-medium dark:font-light">
                    {formatInlineText(block.content)}
                  </p>
                );
              })}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
};

const LessonsScreen = () => {
  const { roadmapId, moduleId, topicId } = useParams();
  const [searchParams] = useSearchParams();
  const career = searchParams.get('career') || "Software Engineer";
  const savedMapId = searchParams.get('savedMapId') || '';
  const navigate = useNavigate();

  // State
  const [roadmap, setRoadmap] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [activeSection, setActiveSection] = useState('learn'); // learn, evaluate
  const [readingProgress, setReadingProgress] = useState(0);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [conceptContent, setConceptContent] = useState(null);
  const [isConceptLoading, setIsConceptLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // AI Quiz System State
  const [quizState, setQuizState] = useState('idle');   // 'idle'|'loading'|'active'|'submitted'|'error'
  const [quiz, setQuiz] = useState(null);               // QuizResponseDto (NO correctAnswers)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});  // { [qIndex]: selectedOption }
  const [quizResult, setQuizResult] = useState(null);   // QuizResultDto (correctAnswers revealed post-submit)
  const [quizPassed, setQuizPassed] = useState(false);  // gates Complete button
  const [quizError, setQuizError] = useState(null);     // friendly AI failure message

  // Fetch Quiz API Call
  const fetchQuiz = async () => {
    setQuizState('loading');
    setQuizError(null);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lessonId: topicId,
          career: career,
          lessonContent: lesson?.content ?? ''
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQuiz(data);
        setQuizState('active');
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setQuizResult(null);
      } else if (res.status === 403) {
        const errData = await res.json().catch(() => ({}));
        setQuizError(errData.message || "Complete the previous lesson quiz to unlock this evaluation.");
        setQuizState('error');
      } else if (res.status === 503) {
        setQuizError("We couldn't generate your quiz right now. Please try again shortly.");
        setQuizState('error');
      } else {
        const errData = await res.json().catch(() => ({}));
        setQuizError(errData.message || "An unexpected error occurred. Please retry.");
        setQuizState('error');
      }
    } catch (err) {
      console.error("[LessonsScreen] Quiz generation error:", err);
      setQuizError("Connection lost. Please check your internet and retry.");
      setQuizState('error');
    }
  };

  // Submit Quiz API Call (Server-side grading & validation)
  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < (quiz?.questions?.length || 0)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setQuizState('loading');
    setQuizError(null);

    const answersList = quiz.questions.map((_, idx) => selectedAnswers[idx] || "");

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lessonId: topicId,
          roadmapId: parseInt(roadmapId) || 0,
          topicTitle: lesson?.title || "",
          answers: answersList
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Normalize backend casing to camelCase safely
        const normalizedData = {
          score: data.score !== undefined ? data.score : data.Score,
          total: data.total !== undefined ? data.total : data.Total,
          passed: data.passed !== undefined ? data.passed : data.Passed,
          attemptCount: data.attemptCount !== undefined ? data.attemptCount : data.AttemptCount,
          feedback: (data.feedback || data.Feedback || []).map(item => ({
            index: item.index !== undefined ? item.index : item.Index,
            question: item.question !== undefined ? item.question : item.Question,
            yourAnswer: item.yourAnswer !== undefined ? item.yourAnswer : item.YourAnswer,
            correctAnswer: item.correctAnswer !== undefined ? item.correctAnswer : item.CorrectAnswer,
            isCorrect: item.isCorrect !== undefined ? item.isCorrect : item.IsCorrect
          }))
        };

        setQuizResult(normalizedData);
        setQuizState('submitted');
        if (normalizedData.passed) {
          setQuizPassed(true);
          setCompleted(true);
          // Dynamically update the local roadmap completion state
          setRoadmap(prev => prev.map(m => ({
            ...m,
            Topics: m.Topics?.map(t =>
              (t.Id || t.id)?.toString() === topicId ||
                (t.TopicKey || t.topicKey) === topicId ||
                (t.Title || t.title) === topicId
                ? { ...t, IsCompleted: true, isCompleted: true }
                : t
            )
          })));
        } else {
          setQuizPassed(false);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setQuizError(errData.message || "Failed to submit quiz. Please try again.");
        setQuizState('error');
      }
    } catch (err) {
      console.error("[LessonsScreen] Quiz submission error:", err);
      setQuizError("Connection lost. Please check your internet and retry.");
      setQuizState('error');
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setQuizResult(null);
    setQuizState('active');
  };

  const contentRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: contentRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track reading progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => setReadingProgress(Math.round(v * 100)));
    return () => unsubscribe();
  }, [scrollYProgress]);

  const handleBack = () => {
    const mod = encodeURIComponent(currentModule?.Title || currentModule?.title || '');
    const car = encodeURIComponent(career);
    const smId = savedMapId ? `&savedMapId=${savedMapId}` : '';
    // Eagerly prefetch the syllabus so it's already cached when the page renders
    window.fetch(`/api/recommendations/syllabus?moduleName=${mod}&targetCareer=${car}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`, { credentials: 'include' }).catch(() => { });
    navigate(`/study-materials?module=${mod}&career=${car}${smId}`);
  };

  // 1. Fetch Roadmap
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/Lessons/roadmap/${roadmapId}?career=${encodeURIComponent(career)}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to fetch roadmap: ${res.status}`);
        const data = await res.json();
        console.log('Fetched roadmap data:', data);
        setRoadmap(data);
        // Determine current module based on fetched data
        const currentM = data.find((m) =>
          m.Topics?.some(
            (t) =>
              (t.Id || t.id)?.toString() === topicId ||
              (t.Title || t.title) === topicId ||
              (t.TopicKey || t.topicKey) === topicId
          )
        );
        if (currentM) {
          setExpandedModules((prev) => ({ ...prev, [currentM.Id || currentM.id]: true }));
          const currentTopic = currentM.Topics?.find(
            (t) =>
              (t.Id || t.id)?.toString() === topicId ||
              (t.Title || t.title) === topicId ||
              (t.TopicKey || t.topicKey) === topicId
          );
          if (currentTopic?.IsCompleted || currentTopic?.isCompleted) {
            setCompleted(true);
          } else {
            setCompleted(false);
          }
        }
      } catch (err) {
        console.error("[LessonsScreen] Failed to fetch roadmap:", err);
        setError(err.message);
      }
    };
    fetchRoadmap();
  }, [roadmapId, topicId, career]);

  // 2. Fetch Lesson Content
  useEffect(() => {
    // Reset AI Quiz System State on topic change
    setQuizState('idle');
    setQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setQuizPassed(false);
    setQuizError(null);

    const fetchLessonContent = async () => {
      if (!roadmap.length) return;

      setLoading(true);
      setError(null);

      try {
        let currentTopic = null;
        let currentMod = null;
        for (const m of roadmap) {
          const t = m.Topics?.find(top =>
            (top.Id || top.id)?.toString() === topicId ||
            (top.TopicKey || top.topicKey) === topicId ||
            (top.Title || top.title) === topicId
          );
          if (t) {
            currentTopic = t;
            currentMod = m;
            break;
          }
        }

        if (!currentTopic) {
          if (roadmapId === "0" || roadmapId === 0) {
            currentTopic = {
              title: decodeURIComponent(topicId),
              topicKey: topicId,
              difficulty: "Intermediate"
            };
            console.log("[LessonsScreen] Dynamic Mode: Created virtual topic from URL:", currentTopic);
          } else {
            setLoading(false);
            setError("Topic not found in your learning path.");
            return;
          }
        }

        const topicIdenfier = currentTopic.TopicKey || currentTopic.topicKey || currentTopic.Title || currentTopic.title;
        const topicTitle = currentTopic.Title || currentTopic.title;
        const topicDifficulty = currentTopic.Difficulty || currentTopic.difficulty || "Intermediate";

        const moduleName = searchParams.get('module') || currentMod?.Title || currentMod?.title || "";
        const url = `/api/lessons/content?topic=${encodeURIComponent(topicIdenfier)}&career=${encodeURIComponent(career)}&difficulty=${encodeURIComponent(topicDifficulty)}&module=${encodeURIComponent(moduleName)}`;
        console.log("[LessonsScreen] Fetching lesson from:", url);

        const res = await fetch(url, { credentials: 'include' });

        if (res.ok) {
          const data = await res.json();
          const finalTitle = data?.title || topicTitle || "Untitled Lesson";
          setLesson({
            title: finalTitle,
            content: data?.content || "",
            keyConcepts: data?.keyConcepts || [],
            examples: data?.examples || [],
            summary: data?.summary || "",
            difficulty: data?.difficulty || topicDifficulty,
            practicalApps: data?.practicalApps || [
              "Implementing core patterns in modern frameworks",
              "Scalability analysis for enterprise systems",
              "Security audit and compliance verification"
            ]
          });
          setError(null);

          // Save this as the last stopped lesson in the database
          fetch('/api/lessons/last-stopped', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              career: career,
              moduleName: moduleName,
              topicTitle: finalTitle,
              topicId: topicId,
              roadmapId: parseInt(roadmapId) || 0,
              moduleId: parseInt(moduleId) || 0
            }),
            credentials: 'include'
          }).then(lsRes => {
            if (lsRes.ok) console.log("[LessonsScreen] Saved last stopped lesson successfully.");
          }).catch(err => console.error("[LessonsScreen] Failed to save last stopped lesson:", err));

          // Also report current progress to the backend so the DB registers this topic access
          fetch('/api/lessons/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roadmapId: parseInt(roadmapId) || 0,
              topicTitle: finalTitle,
              isCompleted: false
            }),
            credentials: 'include'
          }).catch(err => console.error("[LessonsScreen] Failed to report lesson start progress:", err));
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.message || "AI Mentor is currently busy. Please try again.");
        }
      } catch (err) {
        console.error("[LessonsScreen] Fetch Exception:", err);
        setError("Connection lost. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [topicId, roadmap, career]);

  // 3. Fetch Quiz automatically when entering the Evaluate tab and quiz is idle
  useEffect(() => {
    if (activeSection === 'evaluate' && quizState === 'idle' && lesson) {
      fetchQuiz();
    }
  }, [activeSection, quizState, lesson]);

  const currentModule = roadmap.find(m => m.Topics?.some(t => (t.Id || t.id)?.toString() === topicId || (t.Title || t.title) === topicId || (t.TopicKey || t.topicKey) === topicId));
  const currentIndex = currentModule?.Topics?.findIndex(t => (t.Id || t.id)?.toString() === topicId || (t.Title || t.title) === topicId || (t.TopicKey || t.topicKey) === topicId) || 0;

  const handleAction = async (actionType, paragraphText = null, conceptText = null) => {
    try {
      setAiLoading(true);
      setAiAssistantOpen(true);

      const activeConcept = conceptText || selectedConcept;

      let richContext = `Module: ${currentModule?.Title || searchParams.get('module')}\nTopic: ${lesson?.title || topicId}\n`;
      if (activeConcept) richContext += `Active Concept: ${activeConcept}\n`;
      if (paragraphText) richContext += `Paragraph Context: ${paragraphText}\n`;
      if (!activeConcept && !paragraphText) richContext += `Full Lesson Context: ${lesson?.content}\n`;

      const payload = {
        actionType: actionType,
        context: richContext,
        targetCareer: career
      };

      const res = await fetch(`/api/lessons/ai/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response);
      } else {
        setAiResponse("The Neural Mentor encountered an anomaly. Please try again.");
      }
    } catch (err) {
      console.error("[LessonsScreen] AI Action failed:", err);
      setAiResponse("Connection to Neural Mentor lost.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleConceptSelect = async (skill) => {
    const isSelected = selectedConcept === skill;

    if (isSelected) {
      setSelectedConcept(null);
      setConceptContent(null);
      return;
    }

    setSelectedConcept(skill);
    setIsConceptLoading(true);
    setConceptContent(null); // Clear previous

    try {
      const richContext = `Module: ${currentModule?.Title || searchParams.get('module')}\nTopic: ${lesson?.title || topicId}\nTarget Concept: ${skill}\n`;

      const payload = {
        actionType: "Deep Dive Concept Exploration. Provide a comprehensive multi-paragraph explanation focused entirely on this concept.",
        context: richContext,
        targetCareer: career
      };

      const res = await fetch(`/api/lessons/ai/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setConceptContent(data.response);
      } else {
        setConceptContent("Failed to load concept data. The Neural Mentor encountered an anomaly.");
      }
    } catch (err) {
      console.error("[LessonsScreen] Concept fetch failed:", err);
      setConceptContent("Connection lost. Please try again.");
    } finally {
      setIsConceptLoading(false);
    }
  };

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const LessonSkeleton = () => (
    <div className="space-y-10 py-10 animate-pulse max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-200/60" />
          <div className="space-y-3">
            <div className="h-5 w-64 bg-slate-200/60 rounded-lg" />
            <div className="h-3 w-40 bg-slate-200/40 rounded-lg" />
          </div>
        </div>
        <div className="h-[280px] w-full bg-slate-200/50 rounded-[2.5rem]" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-40 bg-slate-200/50 rounded-[2rem]" />
          <div className="h-40 bg-slate-200/50 rounded-[2rem]" />
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ icon: Icon, title, children, color = "text-[#2774AE]", bg = "bg-blue-50/50" }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5 md:space-y-8 relative overflow-hidden"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${bg} ${color} shadow-inner border border-white/50`}>
            <Icon size={18} />
          </div>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-800">{title}</h3>
        </div>
        <MoreVertical size={18} className="text-slate-400" />
      </div>
      <div className="relative z-10 prose prose-slate max-w-none text-slate-600 text-sm md:text-[15px] leading-[1.8] font-medium">
        {children}
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090b] text-slate-900 dark:text-zinc-300 overflow-x-hidden relative selection:bg-blue-100 dark:selection:bg-cyan-900 font-sans transition-colors duration-300">

      {/* 1. AMBIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[25%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(39,116,174,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wLjUgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] dark:opacity-50 opacity-10" />
      </div>

      {/* Global Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100]">
        <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-500 dark:to-purple-500 origin-left" style={{ scaleX: scrollYProgress }} />
      </div>

      {/* 2. FLOATING OVERLAY ROADMAP (Command Palette Style) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-2xl max-h-[70vh] bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              <div className="flex items-center px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                <Search size={20} className="text-slate-400 dark:text-zinc-500 mr-4" />
                <input type="text" placeholder="Search course modules..." className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium" />
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded-md text-slate-500 dark:text-zinc-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {roadmap.map((module) => {
                  const isExpanded = expandedModules[module.Id || module.id];
                  return (
                    <div key={module.Id || module.id} className="bg-slate-50/50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800/50 overflow-hidden">
                      <button onClick={() => toggleModule(module.Id || module.id)} className="w-full flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[11px] font-black text-slate-600 dark:text-zinc-400">
                            {module.Topics?.length || 0}
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-zinc-300 text-left">{module.Title || module.title}</span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 dark:text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-100 dark:border-zinc-800/50">
                            <div className="p-2 space-y-1">
                              {module.Topics?.map((topic) => {
                                const isActive = (topic.Id || topic.id)?.toString() === topicId || (topic.Title || topic.title) === topicId || (topic.TopicKey || topic.topicKey) === topicId;
                                return (
                                  <button key={topic.Id || topic.id} onClick={() => { navigate(`/lessons/${roadmapId}/${module.Id || module.id}/${encodeURIComponent(topic.id || topic.Title || topic.title)}?career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-cyan-950/30 text-blue-600 dark:text-cyan-400 border border-blue-100 dark:border-cyan-900/50' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500 dark:bg-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(34,211,238,0.5)]' : topic.IsCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`} />
                                    <span className="text-sm font-medium text-left">{topic.Title || topic.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CORE WORKSPACE */}
      <div className="relative z-10 max-w-[1200px] mx-auto pt-20 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6 md:px-12 flex flex-col items-center">

        {/* State Management Overlays */}
        {loading ? (
          <div className="w-full max-w-4xl space-y-12 py-20 animate-pulse">
            <div className="h-12 w-3/4 bg-slate-200 dark:bg-zinc-800/50 rounded-2xl" />
            <div className="h-64 w-full bg-slate-200 dark:bg-zinc-800/50 rounded-[2rem]" />
            <div className="h-40 w-full bg-slate-200 dark:bg-zinc-800/50 rounded-[2rem]" />
          </div>
        ) : error ? (
          <div className="w-full max-w-lg mt-32 p-12 bg-white/50 dark:bg-zinc-900/50 border border-rose-200 dark:border-rose-900/50 rounded-[2rem] text-center space-y-6 backdrop-blur-xl">
            <AlertCircle size={40} className="mx-auto text-rose-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">System Error</h2>
            <p className="text-slate-500 dark:text-zinc-500 text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-900 dark:bg-zinc-800 hover:bg-slate-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Retry Connection</button>
          </div>
        ) : (
          <div className="w-full">

            {/* LEARN SECTION */}
            {activeSection === 'learn' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center space-y-24">

                {/* Spatial Header */}
                <header className="text-center space-y-8 max-w-3xl pt-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest">{career}</span>
                    <ChevronRight size={12} className="text-slate-400 dark:text-zinc-600" />
                    <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest">{currentModule?.Title || "Module Focus"}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] drop-shadow-sm dark:drop-shadow-2xl">
                    {lesson?.title}
                  </h1>

                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {lesson?.keyConcepts?.map((skill, i) => {
                      const isSelected = selectedConcept === skill;
                      return (
                        <button
                          key={i}
                          onClick={() => handleConceptSelect(skill)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 backdrop-blur-md shadow-sm hover:scale-105 ${isSelected ? 'bg-blue-500 text-white border-blue-600 dark:bg-cyan-600 dark:border-cyan-500 shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/30' : 'bg-white/80 dark:bg-zinc-900/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800'}`}>
                          <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500 dark:bg-purple-400'}`} /> {skill}
                        </button>
                      )
                    })}
                  </div>
                </header>

                {/* Immersive Modular Nodes */}
                {isConceptLoading ? (
                  <div className="w-full space-y-12">
                    <div className="w-full h-40 bg-slate-200/50 dark:bg-zinc-800/50 rounded-[2rem] animate-pulse" />
                    <div className="w-full h-64 bg-slate-200/50 dark:bg-zinc-800/50 rounded-[2rem] animate-pulse" />
                    <div className="w-full h-40 bg-slate-200/50 dark:bg-zinc-800/50 rounded-[2rem] animate-pulse" />
                  </div>
                ) : (
                  <div className="w-full">
                    {conceptContent ? (
                      <div className="w-full space-y-12">
                        {conceptContent.split('\n\n').map((para, i) => (
                          <div key={i} className="w-full p-6 md:p-10 bg-white/80 dark:bg-[#121214] backdrop-blur-3xl border border-slate-200/80 dark:border-zinc-800/80 rounded-[1.5rem] md:rounded-[2rem] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500/50 to-transparent" />
                            <p className="text-sm md:text-[17px] leading-[1.8] md:leading-[1.9] text-slate-700 dark:text-zinc-300 font-medium dark:font-light">
                              {para}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <MarkdownRenderer content={lesson?.content} />
                    )}
                  </div>
                )}

                {/* Seamless Transition to Next Phase */}
                <div className="w-full mt-12 p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-cyan-950/40 dark:to-purple-950/40 border border-slate-200 dark:border-zinc-800 rounded-[3rem] backdrop-blur-xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                  <div className="relative z-10 space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Knowledge Integration Complete</p>
                    <div className="flex items-baseline justify-center gap-3">
                      <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">+{Math.round(readingProgress * 2.5)}</p>
                      <p className="text-2xl font-black text-blue-600 dark:text-cyan-400">XP</p>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Neural pathways established. Ready to test your understanding?</p>
                  </div>

                  <button onClick={() => setActiveSection('evaluate')} className="relative z-10 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    Take Evaluation <Brain size={16} className="text-blue-400 dark:text-cyan-600" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* EVALUATE (QUIZ) SECTION */}
            {activeSection === 'evaluate' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-12 pt-12 max-w-4xl mx-auto">
                <div className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 rounded-[3rem] p-8 md:p-16 shadow-xl dark:shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wLjUgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIi8+PC9zdmc+')] opacity-10 dark:opacity-30 pointer-events-none" />

                  {/* Quiz Background Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/30 dark:bg-cyan-950/10 rounded-full blur-[100px] pointer-events-none" />

                  {/* IDLE STATE — shown briefly before auto-fetch kicks in */}
                  {quizState === 'idle' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8 relative z-10">
                      <div className="w-24 h-24 bg-blue-50 dark:bg-cyan-500/10 text-blue-500 dark:text-cyan-400 rounded-full flex items-center justify-center border border-blue-100 dark:border-cyan-500/20 shadow-lg">
                        <Brain size={44} />
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Preparing Evaluation</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">Loading lesson content before generating your quiz...</p>
                      </div>
                    </div>
                  )}

                  {/* LOADING STATE */}
                  {quizState === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8 relative z-10">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-blue-50 dark:bg-cyan-500/10 text-blue-500 dark:text-cyan-400 rounded-full flex items-center justify-center border border-blue-100 dark:border-cyan-500/20 shadow-lg"
                      >
                        <Brain size={44} className="animate-pulse" />
                      </motion.div>
                      <div className="text-center space-y-3">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Generating Evaluation</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">Our AI Mentor is curating a personalized 7-question multiple choice quiz to test your mastery of this topic...</p>
                      </div>
                    </div>
                  )}

                  {/* ERROR STATE */}
                  {quizState === 'error' && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center relative z-10">
                      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-900/30 shadow-inner">
                        <AlertCircle size={36} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-zinc-200">Evaluation Unavailable</h3>
                        <p className="text-slate-500 dark:text-zinc-500 text-sm max-w-md leading-relaxed">{quizError}</p>
                      </div>
                      <button
                        onClick={fetchQuiz}
                        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                      >
                        Retry Diagnostics
                      </button>
                    </div>
                  )}

                  {/* ACTIVE QUIZ STATE */}
                  {quizState === 'active' && quiz && quiz.questions && quiz.questions.length > 0 && (
                    <div className="relative z-10 space-y-8">
                      {/* Header with Progress */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                            Question {currentQuestion + 1} of {quiz.questions.length}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                            {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Progress
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-cyan-500 dark:to-indigo-500 transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Question Card */}
                      <div className="space-y-8 py-4">
                        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-relaxed">
                          {quiz.questions[currentQuestion].question}
                        </h4>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-4">
                          {quiz.questions[currentQuestion].options.map((option, idx) => {
                            const isSelected = selectedAnswers[currentQuestion] === option;
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: option }))}
                                className={`w-full text-left p-6 rounded-2xl border text-sm md:text-base font-bold transition-all flex items-center justify-between ${isSelected
                                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-lg'
                                    : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/40 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                                  }`}
                              >
                                <span className="flex-1 pr-4">{option}</span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected
                                    ? 'border-white dark:border-zinc-950 bg-blue-500 dark:bg-cyan-500'
                                    : 'border-slate-300 dark:border-zinc-700'
                                  }`}>
                                  {isSelected && <Check size={12} className="text-white dark:text-zinc-950" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Navigation */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800/50">
                        <button
                          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestion === 0}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${currentQuestion === 0
                              ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'
                              : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                            }`}
                        >
                          <ChevronLeft size={16} /> Prev
                        </button>

                        {currentQuestion < quiz.questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                            disabled={!selectedAnswers[currentQuestion]}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedAnswers[currentQuestion]
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-950 hover:scale-105'
                                : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600'
                              }`}
                          >
                            Next <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md ${Object.keys(selectedAnswers).length === quiz.questions.length
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white hover:scale-105'
                                : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600'
                              }`}
                          >
                            Submit Evaluation <CheckCircle2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* QUIZ SUBMITTED / RESULTS STATE */}
                  {quizState === 'submitted' && quizResult && (
                    <div className="relative z-10 space-y-12">
                      {/* Score Circle & Pass/Fail Badge */}
                      <div className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-lg bg-slate-50/50 dark:bg-zinc-900/50 ${quizResult.passed
                            ? 'border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400'
                            : 'border-rose-500 text-rose-500 dark:border-rose-400 dark:text-rose-400'
                          }`}>
                          <span className="text-4xl font-black tracking-tight">{quizResult.score}</span>
                          <span className="text-xs font-mono uppercase tracking-widest opacity-60">of {quizResult.total}</span>
                        </div>

                        <div className="space-y-2">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${quizResult.passed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400'
                              : 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400'
                            }`}>
                            {quizResult.passed ? <Trophy size={14} /> : <AlertCircle size={14} />}
                            {quizResult.passed ? 'Evaluation Passed' : 'Evaluation Failed'}
                          </div>
                          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                            {quizResult.passed
                              ? `Congratulations! You scored ${Math.round((quizResult.score / quizResult.total) * 100)}% and have unlocked the next lesson.`
                              : `You scored ${Math.round((quizResult.score / quizResult.total) * 100)}%. The passing score is 70%. Review the material and try again.`
                            }
                          </p>
                          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-zinc-500">Attempt Count: {quizResult.attemptCount}</p>
                        </div>
                      </div>

                      {/* Per-Question Detailed Feedback */}
                      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-zinc-800/50 text-left">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Diagnostic Feedback</h4>
                        <div className="space-y-6">
                          {quizResult.feedback.map((item, idx) => (
                            <div key={idx} className={`p-6 rounded-2xl border space-y-4 ${item.isCorrect
                                ? 'bg-emerald-50/20 border-emerald-100 dark:bg-emerald-950/5 dark:border-emerald-950/50'
                                : 'bg-rose-50/20 border-rose-100 dark:bg-rose-950/5 dark:border-rose-950/50'
                              }`}>
                              <div className="flex items-start justify-between gap-4">
                                <h5 className="font-bold text-slate-800 dark:text-zinc-200 text-sm md:text-base leading-relaxed">
                                  {idx + 1}. {item.question}
                                </h5>
                                <div className={`p-1.5 rounded-full shrink-0 ${item.isCorrect
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                    : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                                  }`}>
                                  {item.isCorrect ? <Check size={14} /> : <X size={14} />}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Your Answer</span>
                                  <p className={item.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                    {item.yourAnswer || <span className="italic opacity-60">Unanswered</span>}
                                  </p>
                                </div>
                                {!item.isCorrect && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Correct Answer</span>
                                    <p className="text-emerald-600 dark:text-emerald-400">{item.correctAnswer}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800/50">
                        <button
                          onClick={handleRetakeQuiz}
                          className="px-8 py-4 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <RefreshCw size={14} /> Retake Quiz
                        </button>

                        {quizResult.passed && (
                          <button
                            onClick={() => {
                              let nextTopic = null;
                              let nextModuleId = moduleId;

                              if (currentModule) {
                                if (currentIndex < (currentModule.Topics?.length || 0) - 1) {
                                  nextTopic = currentModule.Topics[currentIndex + 1];
                                } else {
                                  const currentModuleIndex = roadmap.findIndex(m =>
                                    (m.Id || m.id)?.toString() === (currentModule.Id || currentModule.id)?.toString()
                                  );
                                  if (currentModuleIndex !== -1 && currentModuleIndex < roadmap.length - 1) {
                                    const nextModule = roadmap[currentModuleIndex + 1];
                                    nextModuleId = nextModule.Id || nextModule.id;
                                    if (nextModule.Topics && nextModule.Topics.length > 0) {
                                      nextTopic = nextModule.Topics[0];
                                    }
                                  }
                                }
                              }

                              if (nextTopic) {
                                navigate(`/lessons/${roadmapId}/${nextModuleId}/${encodeURIComponent(nextTopic.id || nextTopic.Id || nextTopic.Title || nextTopic.title)}?career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`);
                                setActiveSection('learn');
                                setQuizState('idle');
                                setQuiz(null);
                              } else {
                                navigate(`/study-materials?module=${encodeURIComponent(currentModule?.Title || currentModule?.title || '')}&career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`);
                              }
                            }}
                            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 hover:scale-105 active:scale-95 transition-all rounded-2xl text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-2"
                          >
                            Continue Learning <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 4. FLOATING AI MENTOR WINDOW (OS Style Widget) */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} className="fixed bottom-32 right-12 w-[450px] bg-white/95 dark:bg-zinc-900/90 backdrop-blur-3xl border border-slate-200 dark:border-zinc-700/50 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[70] flex flex-col overflow-hidden max-h-[60vh]">

            {/* OS Window Header */}
            <div className="h-14 bg-slate-50/80 dark:bg-zinc-800/50 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-600 shadow-inner cursor-pointer hover:bg-rose-400" onClick={() => setAiAssistantOpen(false)} />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 shadow-inner" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 font-bold tracking-widest uppercase">Neural_Mentor.exe</span>
              <div className="w-10" />
            </div>

            <div data-lenis-prevent className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-black/20">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-blue-500 dark:text-cyan-400">
                    <RefreshCw size={32} />
                  </motion.div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse font-mono">Computing...</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 text-[14px] font-medium dark:font-light leading-[1.8] text-slate-700 dark:text-zinc-300 shadow-sm prose prose-slate dark:prose-invert">
                    {aiResponse}
                  </div>
                  <div className="flex items-center justify-end">
                    <button onClick={() => setAiResponse(null)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-700">Clear Buffer</button>
                  </div>
                </div>
              ) : selectedConcept ? (
                <div className="space-y-4">
                  <div className="p-5 bg-blue-50/50 dark:bg-cyan-900/20 border border-blue-100 dark:border-cyan-900/30 rounded-2xl flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-blue-100 dark:bg-cyan-500/20 text-blue-500 dark:text-cyan-400 rounded-lg"><Target size={20} /></div>
                    <p className="text-[10px] font-black uppercase text-blue-500 dark:text-cyan-400 tracking-widest">Active Concept Context</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-zinc-200">{selectedConcept}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button onClick={() => handleAction('Break Down', null, selectedConcept)} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Glasses size={14} /> Break Down
                    </button>
                    <button onClick={() => handleAction('Career Relevance', null, selectedConcept)} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Award size={14} /> Career Relevance
                    </button>
                    <button onClick={() => handleAction('Real-World Scenario', null, selectedConcept)} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Zap size={14} /> Real-World Use
                    </button>
                    <button onClick={() => handleAction('Why It Matters', null, selectedConcept)} className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <AlertCircle size={14} /> Why It Matters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-500 dark:text-cyan-400 border border-blue-100 dark:border-cyan-500/20"><Sparkles size={28} /></div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Intelligence Standby</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 max-w-[200px] mx-auto leading-relaxed">Select a Neural Context action from a node, or a Concept Tag.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FLOATING COMMAND DOCK (Top Center Arc/Linear Style) */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[90]">
        <div className="flex items-center gap-1.5 p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)_inset]">

          <button onClick={handleBack} className="p-4 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-all mx-1 active:scale-95" title="Exit Workspace">
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => setSidebarOpen(true)} className="p-4 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-all mx-1 active:scale-95" title="Command Navigator">
            <Search size={18} />
          </button>

          <div className="w-[1px] h-8 bg-slate-200 dark:bg-zinc-800 mx-2" />

          {[
            { id: 'learn', label: 'Learn', icon: BookOpen },
            { id: 'evaluate', label: 'Evaluate', icon: Target }
          ].map(step => {
            const isActive = activeSection === step.id;
            return (
              <button key={step.id} onClick={() => {
                if (step.id === 'evaluate' && quizState === 'error') {
                  setQuizState('idle'); // clear retry error state if they re-click
                }
                setActiveSection(step.id);
              }} className={`relative flex items-center gap-2.5 py-4 px-6 rounded-[1.25rem] transition-all duration-300 ${isActive ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-950 shadow-lg scale-105' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'}`}>
                <step.icon size={16} className={isActive ? 'text-white dark:text-zinc-950' : ''} />
                <span className="text-[11px] font-black uppercase tracking-widest hidden md:inline">{step.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-8 bg-slate-200 dark:bg-zinc-800 mx-2" />

          <button
            onClick={async () => {
              if (completing) return;

              // Find the next topic
              let nextTopic = null;
              let nextModuleId = moduleId;

              if (currentModule) {
                if (currentIndex < (currentModule.Topics?.length || 0) - 1) {
                  nextTopic = currentModule.Topics[currentIndex + 1];
                } else {
                  // End of current module, search for next module in the roadmap
                  const currentModuleIndex = roadmap.findIndex(m =>
                    (m.Id || m.id)?.toString() === (currentModule.Id || currentModule.id)?.toString()
                  );
                  if (currentModuleIndex !== -1 && currentModuleIndex < roadmap.length - 1) {
                    const nextModule = roadmap[currentModuleIndex + 1];
                    nextModuleId = nextModule.Id || nextModule.id;
                    if (nextModule.Topics && nextModule.Topics.length > 0) {
                      nextTopic = nextModule.Topics[0];
                    }
                  }
                }
              }

              if (completed) {
                // If already completed, directly go to the next topic
                if (nextTopic) {
                  navigate(`/lessons/${roadmapId}/${nextModuleId}/${encodeURIComponent(nextTopic.id || nextTopic.Id || nextTopic.Title || nextTopic.title)}?career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`);
                  setActiveSection('learn');
                  setQuizState('idle');
                  setQuiz(null);
                } else {
                  // End of entire learning path, return to study materials
                  navigate(`/study-materials?module=${encodeURIComponent(currentModule?.Title || currentModule?.title || '')}&career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`);
                }
                return;
              }

              // Otherwise, update backend progress and then navigate
              try {
                setCompleting(true);
                const response = await fetch('/api/lessons/progress', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    roadmapId: parseInt(roadmapId) || 0,
                    topicTitle: lesson?.title,
                    isCompleted: true
                  }),
                  credentials: 'include'
                });
                if (response.ok) {
                  setCompleted(true);
                  setQuizPassed(true);
                  // Dynamically update local roadmap state
                  setRoadmap(prev => prev.map(m => ({
                    ...m,
                    Topics: m.Topics?.map(t =>
                      (t.Id || t.id)?.toString() === topicId ||
                        (t.TopicKey || t.topicKey) === topicId ||
                        (t.Title || t.title) === topicId
                        ? { ...t, IsCompleted: true, isCompleted: true }
                        : t
                    )
                  })));

                  // Give a brief, satisfying 1.2-second pause for the user to see the "Completed" badge, then move on!
                  setTimeout(() => {
                    if (nextTopic) {
                      navigate(`/lessons/${roadmapId}/${nextModuleId}/${encodeURIComponent(nextTopic.id || nextTopic.Id || nextTopic.Title || nextTopic.title)}?career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`);
                      setActiveSection('learn');
                      setQuizState('idle');
                      setQuiz(null);
                    } else {
                      navigate(`/study-materials?module=${encodeURIComponent(currentModule?.Title || currentModule?.title || '')}&career=${encodeURIComponent(career)}${savedMapId ? `&savedMapId=${savedMapId}` : ''}`);
                    }
                  }, 1200);
                } else {
                  alert("Failed to complete lesson.");
                }
              } catch (err) {
                console.error("[LessonsScreen] Failed to update progress:", err);
              } finally {
                setCompleting(false);
              }
            }}
            disabled={completing || (!quizPassed && !completed)}
            title={!quizPassed && !completed ? "Pass the evaluation quiz first" : ""}
            className={`p-4 rounded-2xl transition-all mx-1 group flex items-center gap-2 active:scale-95 ${completed
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : !quizPassed && !completed
                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-zinc-600'
                : 'text-slate-500 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400'
              }`}
          >
            <CheckCircle2 size={20} />
            <span className="text-[11px] font-black uppercase tracking-widest w-0 overflow-hidden group-hover:w-[75px] transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 hidden md:block">
              {completing ? 'Saving...' : completed ? 'Completed' : 'Complete'}
            </span>
          </button>
        </div>
      </div>

    </main>
  );
};

export default LessonsScreen;
