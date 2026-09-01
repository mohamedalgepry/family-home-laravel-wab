import { t as useTrans } from "../ssr.js";
import { Link, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/UI/HossamChatWidget.jsx
var STORAGE_KEY = "hossam_concierge_session_v1";
var PIN_PREFIX = {
	ar: "CAIRO",
	en: "GIZA"
};
var buildConciergePin = (locale) => {
	const now = /* @__PURE__ */ new Date();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	const dd = String(now.getDate()).padStart(2, "0");
	return `${PIN_PREFIX[locale] || PIN_PREFIX.ar} · ${dd}${mm}-EG`;
};
var formatTime = (date, locale) => new Date(date).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
	hour: "2-digit",
	minute: "2-digit"
});
function HossamChatWidget() {
	const locale = (usePage()?.props || {}).locale || (typeof document !== "undefined" ? document.documentElement.lang : "ar") || "ar";
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isAdmin = typeof window !== "undefined" && window.location.pathname.includes("/admin");
	const [isOpen, setIsOpen] = useState(() => {
		if (typeof window === "undefined") return false;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				return typeof parsed.isOpen === "boolean" ? parsed.isOpen : false;
			}
		} catch (e) {}
		return false;
	});
	const [isFullscreen, setIsFullscreen] = useState(() => {
		if (typeof window === "undefined") return false;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				return typeof parsed.isFullscreen === "boolean" ? parsed.isFullscreen : false;
			}
		} catch (e) {}
		return false;
	});
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [hasUnread, setHasUnread] = useState(true);
	const [isHovered, setIsHovered] = useState(false);
	const [feedback, setFeedback] = useState({});
	const [streamedMessageId, setStreamedMessageId] = useState(null);
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [audioEnabled, setAudioEnabled] = useState(false);
	const welcomeTimestamp = useMemo(() => formatTime(/* @__PURE__ */ new Date(), locale), [locale]);
	const [messages, setMessages] = useState(() => {
		if (typeof window === "undefined") return [{
			id: "welcome",
			role: "assistant",
			content: trans("assistant_welcome"),
			recommended_units: [],
			timestamp: welcomeTimestamp
		}];
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed.messages) && parsed.messages.length > 0) return parsed.messages;
			}
		} catch (e) {}
		return [{
			id: "welcome",
			role: "assistant",
			content: trans("assistant_welcome"),
			recommended_units: [],
			timestamp: welcomeTimestamp
		}];
	});
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);
	const conciergePin = useMemo(() => buildConciergePin(locale), [locale]);
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
				messages,
				isOpen,
				isFullscreen,
				savedAt: Date.now()
			}));
		} catch (e) {}
	}, [
		messages,
		isOpen,
		isFullscreen
	]);
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);
	useEffect(() => {
		if (isOpen) {
			setHasUnread(false);
			scrollToBottom();
			const t = setTimeout(() => inputRef.current?.focus(), 250);
			return () => clearTimeout(t);
		}
	}, [isOpen, scrollToBottom]);
	useEffect(() => {
		scrollToBottom();
	}, [
		messages,
		isLoading,
		scrollToBottom
	]);
	const speakMessage = useCallback((text) => {
		if (!audioEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
		window.speechSynthesis.cancel();
		const speech = new SpeechSynthesisUtterance(text);
		speech.lang = locale === "ar" ? "ar-EG" : "en-US";
		speech.rate = 1.05;
		speech.pitch = 1;
		speech.onstart = () => setIsSpeaking(true);
		speech.onend = () => setIsSpeaking(false);
		speech.onerror = () => setIsSpeaking(false);
		window.speechSynthesis.speak(speech);
	}, [audioEnabled, locale]);
	const toggleAudio = useCallback(() => {
		setAudioEnabled((prev) => {
			const next = !prev;
			if (!next && window.speechSynthesis) {
				window.speechSynthesis.cancel();
				setIsSpeaking(false);
			}
			return next;
		});
	}, []);
	const SpeechRecognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
	const recognitionRef = useRef(null);
	useEffect(() => {
		if (!SpeechRecognition) return;
		const recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.lang = locale === "ar" ? "ar-EG" : "en-US";
		recognition.onresult = (event) => {
			let finalTranscript = "";
			for (let i = event.resultIndex; i < event.results.length; ++i) if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
			if (finalTranscript) setInputMessage((prev) => (prev + " " + finalTranscript).trim());
		};
		recognition.onerror = () => setIsListening(false);
		recognition.onend = () => setIsListening(false);
		recognitionRef.current = recognition;
	}, [SpeechRecognition, locale]);
	const toggleListening = useCallback(() => {
		if (!recognitionRef.current) return;
		if (isListening) {
			recognitionRef.current.stop();
			setIsListening(false);
		} else {
			setInputMessage("");
			recognitionRef.current.start();
			setIsListening(true);
		}
	}, [isListening]);
	useEffect(() => {
		if (typeof window === "undefined") return;
		const handler = (e) => {
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
				setIsFullscreen(false);
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isOpen]);
	const quickQuestions = useMemo(() => [
		trans("assistant_quick_1"),
		trans("assistant_quick_2"),
		trans("assistant_quick_3"),
		trans("assistant_quick_4")
	], [trans]);
	const abortControllerRef = useRef(null);
	const handleSendMessage = async (textToSend = null, retryMessageId = null) => {
		const text = (textToSend || inputMessage).trim();
		if (!text || isLoading) return;
		if (retryMessageId) setMessages((prev) => prev.filter((m) => m.id !== retryMessageId));
		const userMsg = {
			id: "user_" + Date.now(),
			role: "user",
			content: text,
			timestamp: formatTime(/* @__PURE__ */ new Date(), locale)
		};
		const newMessages = retryMessageId ? [...messages.filter((m) => m.id !== retryMessageId), userMsg] : [...messages, userMsg];
		if (!retryMessageId) setMessages(newMessages);
		else setMessages((prev) => prev.filter((m) => m.id !== retryMessageId));
		setInputMessage("");
		setIsLoading(true);
		if (abortControllerRef.current) abortControllerRef.current.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;
		const timeoutId = setTimeout(() => controller.abort(), 45e3);
		const maxAttempts = 2;
		let lastError = null;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) try {
			const historyPayload = newMessages.filter((m) => m.id !== "welcome" && !String(m.id).startsWith("welcome_")).map((m) => ({
				role: m.role,
				content: m.content
			}));
			const csrfToken = typeof document !== "undefined" ? document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "" : "";
			const contextUrl = typeof window !== "undefined" ? window.location.href : "";
			const contextTitle = typeof document !== "undefined" ? document.title : "";
			const response = await fetch(`/${locale || "ar"}/assistant/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"X-CSRF-TOKEN": csrfToken,
					"X-Requested-With": "XMLHttpRequest"
				},
				body: JSON.stringify({
					message: text,
					history: historyPayload,
					locale: locale || "ar",
					context_url: contextUrl,
					context_title: contextTitle
				}),
				signal: controller.signal
			});
			if (!response.ok) {
				if (attempt < maxAttempts && (response.status === 429 || response.status >= 500)) {
					await new Promise((r) => setTimeout(r, 1e3));
					continue;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			if (data && data.success) {
				const newBotId = "bot_" + Date.now();
				setStreamedMessageId(newBotId);
				setMessages((prev) => [...prev, {
					id: newBotId,
					role: "assistant",
					content: data.reply,
					recommended_units: data.recommended_units || [],
					quick_replies: data.quick_replies || [],
					timestamp: formatTime(/* @__PURE__ */ new Date(), locale)
				}]);
				setTimeout(() => setStreamedMessageId(null), 1400);
				if (audioEnabled) speakMessage(data.reply);
				clearTimeout(timeoutId);
				abortControllerRef.current = null;
				setIsLoading(false);
				return;
			} else throw new Error("Empty reply payload");
		} catch (error) {
			lastError = error;
			if (error.name === "AbortError") break;
			if (attempt < maxAttempts) {
				await new Promise((r) => setTimeout(r, 800));
				continue;
			}
		}
		clearTimeout(timeoutId);
		abortControllerRef.current = null;
		console.error("Hossam Assistant Error:", lastError);
		const errorId = "bot_err_" + Date.now();
		const isTimeout = lastError?.name === "AbortError";
		setMessages((prev) => [...prev, {
			id: errorId,
			role: "assistant",
			content: isRtl ? isTimeout ? "عذراً، الاستجابة أخذت وقت أطول من المتوقع. اضغط على زر \"إعادة المحاولة\" أو اكتب سؤالك مرة تانية." : "عذراً، حدث خطأ في الاتصال. اضغط على \"إعادة المحاولة\" أو جرب مرة أخرى." : isTimeout ? "Sorry, the response took longer than expected. Tap \"Retry\" or rephrase your question." : "Sorry, a connection error occurred. Tap \"Retry\" or try again.",
			recommended_units: [],
			timestamp: formatTime(/* @__PURE__ */ new Date(), locale),
			isError: true,
			retryText: text
		}]);
		setIsLoading(false);
	};
	const resetChat = () => {
		setMessages([{
			id: "welcome_" + Date.now(),
			role: "assistant",
			content: trans("assistant_welcome"),
			recommended_units: [],
			timestamp: formatTime(/* @__PURE__ */ new Date(), locale)
		}]);
		setFeedback({});
		if (typeof window !== "undefined") try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch (e) {}
	};
	const setReaction = (messageId, reaction) => {
		setFeedback((prev) => ({
			...prev,
			[messageId]: prev[messageId] === reaction ? null : reaction
		}));
	};
	const handleUnitLinkClick = () => {
		if (typeof window !== "undefined" && window.innerWidth < 768) {
			setIsOpen(false);
			setIsFullscreen(false);
		}
	};
	const formatInline = (str) => {
		if (!str) return null;
		return str.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, pIdx) => {
			const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
			if (linkMatch) return /* @__PURE__ */ jsx(Link, {
				href: linkMatch[2],
				onClick: handleUnitLinkClick,
				className: "text-[#CC0000] font-bold underline underline-offset-2 decoration-[#CC0000]/30 hover:text-[#990000] hover:decoration-[#990000]/60 transition-colors",
				children: linkMatch[1]
			}, pIdx);
			if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ jsx("strong", {
				className: "font-bold text-slate-950",
				children: part.slice(2, -2)
			}, pIdx);
			return part;
		});
	};
	const formatMessageText = (text) => {
		if (!text) return null;
		const lines = text.split("\n");
		const elements = [];
		let inTable = false;
		let tableRows = [];
		const flushTable = (key) => {
			if (tableRows.length > 0) {
				elements.push(/* @__PURE__ */ jsx("div", {
					className: "my-2.5 overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white",
					children: /* @__PURE__ */ jsx("table", {
						className: "min-w-full text-xs text-start divide-y divide-slate-200",
						children: /* @__PURE__ */ jsx("tbody", { children: tableRows.map((row, rIdx) => {
							const isHeader = rIdx === 0;
							if (row.every((cell) => /^[-:\s|]+$/.test(cell))) return null;
							return /* @__PURE__ */ jsx("tr", {
								className: isHeader ? "bg-slate-100/90 font-bold text-slate-900" : "hover:bg-slate-50/80 text-slate-700 divide-x divide-slate-100",
								children: row.map((cell, cIdx) => /* @__PURE__ */ jsx("td", {
									className: `px-2.5 py-1.5 whitespace-nowrap ${isHeader ? "font-black text-slate-900" : ""}`,
									children: formatInline(cell)
								}, cIdx))
							}, rIdx);
						}) })
					})
				}, `tbl_${key}`));
				tableRows = [];
			}
			inTable = false;
		};
		lines.forEach((line, idx) => {
			const trimmed = line.trim();
			if (!trimmed) {
				if (inTable) flushTable(idx);
				elements.push(/* @__PURE__ */ jsx("div", { className: "h-1.5" }, idx));
				return;
			}
			if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
				inTable = true;
				const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
				tableRows.push(cells);
				return;
			} else if (inTable) flushTable(idx);
			if (/^[-*_]{3,}$/.test(trimmed)) {
				elements.push(/* @__PURE__ */ jsx("hr", { className: "my-2.5 border-slate-200" }, idx));
				return;
			}
			if (trimmed.startsWith("### ")) {
				elements.push(/* @__PURE__ */ jsxs("h4", {
					className: "font-bold text-slate-900 text-xs sm:text-sm mt-2.5 mb-1 flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx("span", { className: "w-1 h-3 bg-[#CC0000] rounded-full inline-block" }), /* @__PURE__ */ jsx("span", { children: formatInline(trimmed.slice(4)) })]
				}, idx));
				return;
			}
			if (trimmed.startsWith("## ")) {
				elements.push(/* @__PURE__ */ jsx("h3", {
					className: "font-black text-slate-950 text-sm mt-3 mb-1.5 text-[#990000] border-b border-slate-200/80 pb-1",
					children: formatInline(trimmed.slice(3))
				}, idx));
				return;
			}
			if (trimmed.startsWith("# ")) {
				elements.push(/* @__PURE__ */ jsx("h2", {
					className: "font-black text-slate-950 text-sm sm:text-base mt-3 mb-1.5 text-[#990000]",
					children: formatInline(trimmed.slice(2))
				}, idx));
				return;
			}
			let bulletContent = null;
			if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) bulletContent = trimmed.slice(2).trim();
			else if (trimmed.startsWith("•")) bulletContent = trimmed.slice(1).trim();
			if (bulletContent !== null) {
				if (bulletContent.length === 0) return;
				elements.push(/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2 my-1 ps-1 text-slate-800 text-xs sm:text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[#CC0000] font-black leading-relaxed shrink-0",
						children: "•"
					}), /* @__PURE__ */ jsx("span", {
						className: "flex-1 leading-relaxed",
						children: formatInline(bulletContent)
					})]
				}, idx));
				return;
			}
			if (/^\d+\.\s/.test(trimmed)) {
				const dotPos = trimmed.indexOf(".");
				const num = trimmed.slice(0, dotPos);
				const numContent = trimmed.slice(dotPos + 1).trim();
				elements.push(/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2 my-1.5 ps-1 text-slate-800 text-xs sm:text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-5 h-5 rounded-md bg-slate-100 text-[#CC0000] font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs",
						children: num
					}), /* @__PURE__ */ jsx("span", {
						className: "flex-1 leading-relaxed font-semibold",
						children: formatInline(numContent)
					})]
				}, idx));
				return;
			}
			elements.push(/* @__PURE__ */ jsx("p", {
				className: "my-1 leading-relaxed text-slate-800 text-xs sm:text-sm",
				children: formatInline(line)
			}, idx));
		});
		if (inTable) flushTable("end");
		return elements;
	};
	const showQuickQuestions = messages.length === 1 && !isLoading;
	if (isAdmin) return null;
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "fixed z-50 bottom-6 end-4 sm:bottom-8 sm:end-8 print:hidden font-sans",
		children: [!isOpen && /* @__PURE__ */ jsxs("div", {
			className: "relative flex items-center",
			children: [/* @__PURE__ */ jsxs("div", {
				className: `hidden sm:flex absolute ${isRtl ? "end-full me-3.5" : "start-full ms-3.5"} items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl whitespace-nowrap transition-all duration-300 pointer-events-none ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`,
				children: [
					/* @__PURE__ */ jsx("span", { children: trans("assistant_name") }),
					/* @__PURE__ */ jsx("span", {
						className: "text-white/40",
						children: "•"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-white/80 font-normal",
						children: trans("assistant_title")
					})
				]
			}), /* @__PURE__ */ jsxs("button", {
				onClick: () => setIsOpen(true),
				onMouseEnter: () => setIsHovered(true),
				onMouseLeave: () => setIsHovered(false),
				className: `group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white flex items-center justify-center transition-all duration-300 outline-none focus:ring-4 focus:ring-[#CC0000]/30 ${hasUnread ? "concierge-pulse bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]" : "bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.20)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.30)]"}`,
				"aria-label": trans("assistant_name"),
				title: trans("assistant_name"),
				children: [/* @__PURE__ */ jsxs("span", {
					className: "absolute top-1.5 end-1.5 flex h-3 w-3",
					children: [/* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#1A1A1A] shadow-sm" })]
				}), /* @__PURE__ */ jsx("div", {
					className: "concierge-fab-icon relative flex items-center justify-center",
					children: /* @__PURE__ */ jsxs("span", {
						className: "font-black text-xl sm:text-2xl tracking-tight text-white leading-none select-none",
						children: ["H", /* @__PURE__ */ jsx("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-[#CC0000] align-top ms-0.5" })]
					})
				})]
			})]
		}), isOpen && /* @__PURE__ */ jsxs("div", {
			className: `concierge-open flex flex-col bg-white overflow-hidden border border-slate-200/80 ${isFullscreen ? "fixed inset-0 w-screen h-[100dvh] rounded-none sm:inset-4 sm:w-[calc(100vw-32px)] sm:h-[calc(100dvh-32px)] sm:max-w-[460px] sm:ml-auto sm:rounded-[28px]" : "w-[calc(100vw-32px)] sm:w-[440px] h-[640px] max-h-[84vh] rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.30)]"}`,
			role: "dialog",
			"aria-label": trans("assistant_name"),
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "bg-white border-b concierge-rule shrink-0 concierge-safe-top",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-4 sm:px-5 pt-4 pb-3 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-11 h-11 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-sm",
									children: /* @__PURE__ */ jsx("span", {
										className: "font-black text-lg leading-none",
										children: "H"
									})
								}), /* @__PURE__ */ jsx("span", {
									className: "absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm",
									"aria-hidden": "true"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "font-black text-[15px] leading-none text-slate-950 tracking-tight",
										children: trans("assistant_name")
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#8B0000] bg-[#FFF5F5] border border-[#FFE3E3] px-1.5 py-0.5 rounded",
										children: [/* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-[#CC0000]" }), "Concierge"]
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500 font-medium leading-tight mt-1 truncate",
									children: trans("assistant_title")
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-0.5 shrink-0",
							children: [
								SpeechRecognition && /* @__PURE__ */ jsx("button", {
									onClick: toggleAudio,
									className: `w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${audioEnabled ? "text-[#CC0000] bg-red-50" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`,
									title: audioEnabled ? isRtl ? "إيقاف الصوت" : "Mute" : isRtl ? "تشغيل الصوت" : "Unmute",
									"aria-label": audioEnabled ? isRtl ? "إيقاف الصوت" : "Mute" : isRtl ? "تشغيل الصوت" : "Unmute",
									children: audioEnabled ? /* @__PURE__ */ jsx("svg", {
										className: `w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`,
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
										})
									}) : /* @__PURE__ */ jsxs("svg", {
										className: "w-3.5 h-3.5",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2,
										children: [/* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
										}), /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
										})]
									})
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setIsFullscreen((prev) => !prev),
									className: "w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors",
									title: isFullscreen ? isRtl ? "تصغير" : "Minimize" : isRtl ? "ملء الشاشة" : "Fullscreen",
									"aria-label": isFullscreen ? isRtl ? "تصغير" : "Minimize" : isRtl ? "ملء الشاشة" : "Fullscreen",
									children: isFullscreen ? /* @__PURE__ */ jsx("svg", {
										className: "w-3.5 h-3.5",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2.2,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M9 9V4H4v5M15 9V4h5v5M9 15v5H4v-5M15 15v5h5v-5"
										})
									}) : /* @__PURE__ */ jsx("svg", {
										className: "w-3.5 h-3.5",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2.2,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"
										})
									})
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: resetChat,
									className: "w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors",
									title: trans("assistant_clear"),
									"aria-label": trans("assistant_clear"),
									children: /* @__PURE__ */ jsx("svg", {
										className: "w-3.5 h-3.5",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										})
									})
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setIsOpen(false);
										setIsFullscreen(false);
									},
									className: "w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors",
									title: trans("assistant_close"),
									"aria-label": trans("assistant_close"),
									children: /* @__PURE__ */ jsx("svg", {
										className: "w-3.5 h-3.5",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2.2,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M6 6l12 12M6 18L18 6"
										})
									})
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "px-4 sm:px-5 pb-2.5 flex items-center justify-between text-[10px] text-slate-400 font-medium tracking-wider",
						children: [/* @__PURE__ */ jsx("span", {
							className: "concierge-pin font-bold",
							children: conciergePin
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }), /* @__PURE__ */ jsx("span", {
								className: "text-slate-500",
								children: trans("assistant_status")
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 px-4 sm:px-5 py-4 overflow-y-auto concierge-paper custom-scrollbar",
					"aria-live": "polite",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							messages.map((msg) => {
								const isUser = msg.role === "user";
								const isStreaming = msg.id === streamedMessageId;
								const reaction = feedback[msg.id] || null;
								const showMeta = !isStreaming;
								return /* @__PURE__ */ jsxs("div", {
									className: `concierge-bubble-in flex flex-col ${isUser ? "items-end" : "items-start"}`,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: `max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${isUser ? "bg-[#1A1A1A] text-white rounded-br-md shadow-[0_2px_8px_rgba(0,0,0,0.10)]" : msg.isError ? "bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]" : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]"}`,
											children: [/* @__PURE__ */ jsx("div", {
												className: isUser ? "text-white" : msg.isError ? "text-rose-800" : "text-slate-800",
												children: isUser ? /* @__PURE__ */ jsx("span", {
													className: isStreaming ? "streaming-caret" : "",
													children: msg.content
												}) : /* @__PURE__ */ jsx("span", {
													className: isStreaming ? "streaming-caret" : "",
													children: formatMessageText(msg.content)
												})
											}), showMeta && /* @__PURE__ */ jsx("div", {
												className: `text-[10px] mt-1.5 text-end tabular-nums tracking-wide ${isUser ? "text-white/60" : "text-slate-400"}`,
												children: msg.timestamp
											})]
										}),
										msg.isError && msg.retryText && !isLoading && /* @__PURE__ */ jsxs("button", {
											onClick: () => handleSendMessage(msg.retryText, msg.id),
											className: "flex items-center gap-1.5 mt-1.5 ms-1 text-[11px] font-bold text-[#CC0000] hover:text-[#990000] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full transition-all",
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-3.5 h-3.5",
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												strokeWidth: 2,
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
												})
											}), isRtl ? "إعادة المحاولة" : "Retry"]
										}),
										!isUser && !isStreaming && !msg.isError && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1 mt-1 ms-1",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => setReaction(msg.id, "up"),
												className: `w-6 h-6 rounded-md flex items-center justify-center transition-colors ${reaction === "up" ? "text-emerald-600 bg-emerald-50" : "text-slate-300 hover:text-slate-500"}`,
												"aria-label": "Helpful",
												title: "Helpful",
												children: /* @__PURE__ */ jsx("svg", {
													className: "w-3.5 h-3.5",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9A2 2 0 0019.7 9H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
													})
												})
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => setReaction(msg.id, "down"),
												className: `w-6 h-6 rounded-md flex items-center justify-center transition-colors ${reaction === "down" ? "text-rose-600 bg-rose-50" : "text-slate-300 hover:text-slate-500"}`,
												"aria-label": "Not helpful",
												title: "Not helpful",
												children: /* @__PURE__ */ jsx("svg", {
													className: "w-3.5 h-3.5",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9A2 2 0 004.3 15H10zM17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"
													})
												})
											})]
										}),
										msg.recommended_units && msg.recommended_units.length > 0 && /* @__PURE__ */ jsxs("div", {
											className: "w-full mt-3 space-y-2 max-w-[96%]",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 px-1",
												children: [/* @__PURE__ */ jsx("span", { className: "w-1 h-3 bg-[#CC0000] rounded-full" }), /* @__PURE__ */ jsx("p", {
													className: "text-[10px] font-black uppercase tracking-[0.12em] text-slate-500",
													children: isRtl ? "العقارات المتاحة" : "Matching inventory"
												})]
											}), msg.recommended_units.map((unit) => /* @__PURE__ */ jsxs("div", {
												className: "bg-white rounded-xl p-2.5 border border-slate-200 hover:border-slate-300 transition-all flex gap-3 items-center group",
												children: [/* @__PURE__ */ jsx(Link, {
													href: unit.url,
													onClick: handleUnitLinkClick,
													className: "shrink-0",
													children: /* @__PURE__ */ jsx("img", {
														src: unit.image_url,
														alt: unit.name,
														className: "w-16 h-16 rounded-lg object-cover border border-slate-100 bg-slate-100 group-hover:opacity-90 transition-opacity",
														loading: "lazy"
													})
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex-1 min-w-0",
													children: [
														/* @__PURE__ */ jsx(Link, {
															href: unit.url,
															onClick: handleUnitLinkClick,
															className: "block font-bold text-slate-900 text-[12.5px] truncate group-hover:text-[#CC0000] transition-colors",
															children: unit.name
														}),
														/* @__PURE__ */ jsx("p", {
															className: "text-[10.5px] text-slate-500 truncate mt-0.5",
															children: unit.area_name || (isRtl ? "موقع متميز" : "Prime Location")
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "flex items-center gap-1.5 mt-0.5",
															children: [
																/* @__PURE__ */ jsx("span", {
																	className: "text-[12px] font-black text-[#CC0000] tabular-nums",
																	children: unit.price_formatted
																}),
																/* @__PURE__ */ jsx("span", {
																	className: "text-[9px] font-semibold text-slate-500",
																	children: unit.currency
																}),
																unit.rooms > 0 && /* @__PURE__ */ jsxs("span", {
																	className: "text-[9.5px] text-slate-400 ms-auto",
																	children: [
																		"• ",
																		unit.rooms,
																		" ",
																		isRtl ? "غرف" : "rm"
																	]
																})
															]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "flex items-center gap-1 mt-1.5",
															children: [/* @__PURE__ */ jsx(Link, {
																href: unit.url,
																onClick: handleUnitLinkClick,
																className: "text-[10px] font-bold text-slate-900 hover:text-[#CC0000] underline underline-offset-2 decoration-slate-300 hover:decoration-[#CC0000] transition-colors",
																children: trans("assistant_view_unit")
															}), unit.whatsapp_url && /* @__PURE__ */ jsxs("a", {
																href: unit.whatsapp_url,
																target: "_blank",
																rel: "noopener noreferrer",
																className: "text-[10px] font-bold text-emerald-700 hover:text-emerald-800 ms-2 inline-flex items-center gap-0.5",
																children: [/* @__PURE__ */ jsx("svg", {
																	className: "w-3 h-3",
																	viewBox: "0 0 24 24",
																	fill: "currentColor",
																	children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.5 2 2 6.5 2 12c0 1.78.46 3.45 1.26 4.9L2 22l5.25-1.23C8.7 21.56 10.31 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" })
																}), /* @__PURE__ */ jsx("span", { children: trans("assistant_whatsapp") })]
															})]
														})
													]
												})]
											}, unit.id))]
										}),
										!isUser && !isStreaming && msg.quick_replies && msg.quick_replies.length > 0 && !isLoading && /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-1.5 mt-3 ms-1 w-full max-w-[96%]",
											children: msg.quick_replies.map((replyText, idx) => /* @__PURE__ */ jsx("button", {
												onClick: () => handleSendMessage(replyText),
												className: "px-3 py-1.5 text-[11.5px] font-medium text-slate-700 bg-white border border-slate-200/80 rounded-full hover:border-[#CC0000] hover:text-[#CC0000] hover:bg-red-50/30 transition-all shadow-sm text-start",
												children: replyText
											}, `qr-${msg.id}-${idx}`))
										})
									]
								}, msg.id);
							}),
							isLoading && /* @__PURE__ */ jsx("div", {
								className: "flex flex-col items-start",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5 text-slate-500 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-bl-md max-w-[80%] shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex gap-1 items-center",
										"aria-hidden": "true",
										children: [
											/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce [animation-delay:-0.32s]" }),
											/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce [animation-delay:-0.16s]" }),
											/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#CC0000] animate-bounce" })
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-semibold text-slate-500 tracking-wide",
										children: trans("assistant_typing")
									})]
								})
							}),
							/* @__PURE__ */ jsx("div", { ref: messagesEndRef })
						]
					})
				}),
				showQuickQuestions && /* @__PURE__ */ jsxs("div", {
					className: "px-4 sm:px-5 py-3 bg-white border-t concierge-rule shrink-0",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 mb-2",
						children: isRtl ? "اقتراحات سريعة" : "Quick start"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-1.5",
						children: quickQuestions.map((q, qIdx) => /* @__PURE__ */ jsx("button", {
							onClick: () => handleSendMessage(q),
							className: "text-[11.5px] font-semibold text-slate-700 bg-slate-50 hover:bg-[#FFF5F5] hover:text-[#8B0000] border border-slate-200 hover:border-[#FFE3E3] px-2.5 py-1.5 rounded-full transition-all text-start leading-snug",
							children: q
						}, qIdx))
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleSendMessage();
					},
					className: "p-3 sm:p-3.5 bg-white border-t concierge-rule shrink-0 concierge-safe-bottom",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-[#CC0000] focus-within:ring-2 focus-within:ring-[#CC0000]/15 focus-within:bg-white transition-all",
						children: [
							/* @__PURE__ */ jsx("textarea", {
								ref: inputRef,
								value: inputMessage,
								onChange: (e) => setInputMessage(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage();
									}
								},
								placeholder: isListening ? isRtl ? "جاري الاستماع..." : "Listening..." : trans("assistant_placeholder"),
								disabled: isLoading || isListening,
								rows: 1,
								className: "flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none resize-none text-[13.5px] text-slate-900 placeholder:text-slate-400 leading-relaxed max-h-24 disabled:opacity-60 px-1 py-1 shadow-none",
								style: {
									minHeight: "24px",
									outline: "none",
									boxShadow: "none"
								}
							}),
							SpeechRecognition && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: toggleListening,
								disabled: isLoading,
								className: `w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${isListening ? "bg-red-100 text-[#CC0000] animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"}`,
								"aria-label": isRtl ? "تحدث" : "Speak",
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-4 h-4",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
									})
								})
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: !inputMessage.trim() || isLoading,
								className: "w-9 h-9 rounded-xl bg-[#1A1A1A] hover:bg-[#CC0000] disabled:opacity-30 disabled:hover:bg-[#1A1A1A] text-white flex items-center justify-center transition-all shrink-0",
								"aria-label": isRtl ? "إرسال" : "Send",
								children: /* @__PURE__ */ jsx("svg", {
									className: `w-4 h-4 ${isRtl ? "rotate-180" : ""}`,
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2.5,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M5 12h14M13 6l6 6-6 6"
									})
								})
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mt-2 px-1 text-[9.5px] text-slate-400 font-medium tracking-wider uppercase",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: isRtl ? "اضغط Enter للإرسال" : "Press Enter to send"
						}), /* @__PURE__ */ jsx("span", {
							className: "concierge-pin font-bold hidden sm:inline",
							children: conciergePin
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { HossamChatWidget as default };
