import { n as useCompare, r as useTrans, t as ChatLauncherButton } from "../ssr.js";
import { Link, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// resources/js/Components/HossamChat/hooks/useChatSession.js
var STORAGE_KEY = "hossam_concierge_session_v1";
var formatTime = (date, locale) => new Date(date).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
	hour: "2-digit",
	minute: "2-digit"
});
function useChatSession(locale, trans, isRtl, pageProps) {
	const welcomeTimestamp = useMemo(() => formatTime(/* @__PURE__ */ new Date(), locale), [locale]);
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
	const [hasUnread, setHasUnread] = useState(true);
	const [feedback, setFeedback] = useState({});
	const [proactivePill, setProactivePill] = useState(null);
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
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const safeMessages = messages.slice(-12).map((m) => ({
				id: m.id,
				role: m.role,
				content: typeof m.content === "string" ? m.content.replace(/\b(?:\+?20|0)?1[0125]\d{8}\b/g, "[رقم هاتف]") : m.content,
				timestamp: m.timestamp,
				recommended_units: m.recommended_units || [],
				quick_replies: m.quick_replies || []
			}));
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
				messages: safeMessages,
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
	useEffect(() => {
		if (isOpen || typeof window === "undefined") return;
		const currentPath = window.location.pathname;
		let inviteText = null;
		if (pageProps.project?.name) inviteText = isRtl ? `بتتصفح مشروع ${pageProps.project.name}؟ تحب تشوف أنظمة السداد والأسعار المتاحة؟` : `Exploring ${pageProps.project.name}? Want to see payment plans and prices?`;
		else if (pageProps.unit?.name) inviteText = isRtl ? `مهتم بالوحدة دي؟ ممكن أساعدك في معلومات السعر أو أرتبلك معاينة.` : `Interested in this unit? I can help with pricing info or book a visit.`;
		else if (currentPath.includes("/units/deals")) inviteText = isRtl ? `بتدور على صفقات استثمارية ولقطات؟ عندنا خيارات حصرية بخصم كاش وتقسيط!` : `Looking for top investment deals? Check out our exclusive properties!`;
		if (inviteText) {
			const timer = setTimeout(() => {
				setProactivePill(inviteText);
			}, 7500);
			return () => clearTimeout(timer);
		}
	}, [
		isOpen,
		pageProps,
		isRtl
	]);
	const resetChat = useCallback(() => {
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
	}, [locale, trans]);
	return {
		isOpen,
		setIsOpen,
		isFullscreen,
		setIsFullscreen,
		hasUnread,
		setHasUnread,
		feedback,
		setReaction: useCallback((messageId, reaction) => {
			setFeedback((prev) => ({
				...prev,
				[messageId]: prev[messageId] === reaction ? null : reaction
			}));
		}, []),
		proactivePill,
		setProactivePill,
		messages,
		setMessages,
		resetChat
	};
}
// resources/js/Components/HossamChat/hooks/useChatApi.js
function useChatApi({ messages, setMessages, locale, pageProps, isRtl, onSuccessResponse }) {
	const [isLoading, setIsLoading] = useState(false);
	const [typingStage, setTypingStage] = useState(0);
	const [streamedMessageId, setStreamedMessageId] = useState(null);
	const abortControllerRef = useRef(null);
	const streamIntervalRef = useRef(null);
	const typingTimerRef = useRef(null);
	const typingTimerRef2 = useRef(null);
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) abortControllerRef.current.abort();
			if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
			if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
			if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current);
		};
	}, []);
	return {
		isLoading,
		typingStage,
		streamedMessageId,
		handleSendMessage: useCallback(async (textToSend = null, retryMessageId = null) => {
			const text = (textToSend || "").trim();
			if (!text || isLoading) return;
			if (retryMessageId) setMessages((prev) => prev.filter((m) => m.id !== retryMessageId));
			const userMsg = {
				id: "user_" + Date.now(),
				role: "user",
				content: text,
				timestamp: formatTime(/* @__PURE__ */ new Date(), locale)
			};
			if (!retryMessageId) setMessages((prev) => [...prev, userMsg]);
			else setMessages((prev) => [...prev.filter((m) => m.id !== retryMessageId), userMsg]);
			setIsLoading(true);
			setTypingStage(0);
			if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
			if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current);
			typingTimerRef.current = setTimeout(() => setTypingStage(1), 2500);
			typingTimerRef2.current = setTimeout(() => setTypingStage(2), 6500);
			if (abortControllerRef.current) abortControllerRef.current.abort();
			const controller = new AbortController();
			abortControllerRef.current = controller;
			const timeoutId = setTimeout(() => controller.abort(), 45e3);
			const maxAttempts = 1;
			let lastError = null;
			for (let attempt = 1; attempt <= maxAttempts; attempt++) try {
				const historyPayload = messages.filter((m) => m.id !== "welcome" && !String(m.id).startsWith("welcome_") && m.role && m.content).slice(-6).map((m) => ({
					role: m.role,
					content: String(m.content).replace(/\b(?:\+?20|0)?1[0125]\d{8}\b/g, "[رقم هاتف]").slice(0, 500)
				}));
				const csrfToken = typeof document !== "undefined" ? document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "" : "";
				const contextUrl = typeof window !== "undefined" ? window.location.href : "";
				const contextPathname = typeof window !== "undefined" ? window.location.pathname : "";
				const contextTitle = typeof document !== "undefined" ? document.title : "";
				const pageContext = {
					url: contextUrl,
					pathname: contextPathname,
					title: contextTitle,
					project_id: pageProps?.project?.id || null,
					project_name: pageProps?.project?.name || null,
					project_slug: pageProps?.project?.slug || null,
					unit_id: pageProps?.unit?.id || null,
					unit_name: pageProps?.unit?.name || null,
					unit_slug: pageProps?.unit?.slug || null,
					unit_price: pageProps?.unit?.price || null,
					unit_rooms: pageProps?.unit?.rooms || null,
					area_name: pageProps?.area?.name || pageProps?.unit?.area_name || pageProps?.project?.area_name || null
				};
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
						context_title: contextTitle,
						page_context: pageContext
					}),
					signal: controller.signal
				});
				if (!response.ok) {
					if (response.status === 429) throw new Error("429_TOO_MANY_REQUESTS");
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				if (data && data.success) {
					const newBotId = "bot_" + Date.now();
					const fullReply = data.reply || "";
					const words = fullReply.split(" ");
					if (words.length <= 4) setMessages((prev) => [...prev, {
						id: newBotId,
						role: "assistant",
						content: fullReply,
						recommended_units: data.recommended_units || [],
						quick_replies: data.quick_replies || [],
						timestamp: formatTime(/* @__PURE__ */ new Date(), locale)
					}]);
					else {
						setStreamedMessageId(newBotId);
						setMessages((prev) => [...prev, {
							id: newBotId,
							role: "assistant",
							content: "",
							recommended_units: data.recommended_units || [],
							quick_replies: data.quick_replies || [],
							timestamp: formatTime(/* @__PURE__ */ new Date(), locale)
						}]);
						let wordIdx = 0;
						const chunkSize = words.length > 60 ? 3 : 2;
						const intervalMs = Math.max(14, Math.min(30, Math.floor(900 / (words.length / chunkSize))));
						if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
						streamIntervalRef.current = setInterval(() => {
							wordIdx += chunkSize;
							if (wordIdx >= words.length) {
								clearInterval(streamIntervalRef.current);
								streamIntervalRef.current = null;
								setMessages((prev) => prev.map((m) => m.id === newBotId ? {
									...m,
									content: fullReply
								} : m));
								setStreamedMessageId(null);
							} else {
								const partial = words.slice(0, wordIdx).join(" ");
								setMessages((prev) => prev.map((m) => m.id === newBotId ? {
									...m,
									content: partial
								} : m));
							}
						}, intervalMs);
					}
					clearTimeout(timeoutId);
					abortControllerRef.current = null;
					if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
					if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current);
					setTypingStage(0);
					setIsLoading(false);
					if (onSuccessResponse) onSuccessResponse(fullReply);
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
			if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
			if (typingTimerRef2.current) clearTimeout(typingTimerRef2.current);
			setTypingStage(0);
			setIsLoading(false);
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
		}, [
			isLoading,
			messages,
			locale,
			pageProps,
			isRtl,
			setMessages,
			onSuccessResponse
		])
	};
}
// resources/js/Components/HossamChat/ChatHeader.jsx
function ChatHeader({ trans, isRtl, isFullscreen, setIsFullscreen, resetChat, onClose }) {
	return /* @__PURE__ */ jsx("header", {
		className: "bg-white border-b border-slate-200 shrink-0 concierge-safe-top",
		children: /* @__PURE__ */ jsxs("div", {
			className: "px-4 py-3 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5 min-w-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative shrink-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden p-1 border border-slate-200",
						children: /* @__PURE__ */ jsx("img", {
							src: "/images/ai-agent-head.webp",
							alt: trans("assistant_name"),
							className: "w-full h-full object-contain"
						})
					}), /* @__PURE__ */ jsx("span", {
						className: "absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full",
						title: isRtl ? "متصل الآن" : "Online",
						"aria-hidden": "true"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-bold text-[14px] leading-tight text-slate-900 tracking-tight",
							children: trans("assistant_name")
						}), /* @__PURE__ */ jsx("span", {
							className: "inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full",
							children: trans("assistant_agent_badge")
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-slate-500 font-normal leading-tight mt-0.5 truncate",
						children: isRtl ? "جاهز لمساعدتك في أي استفسار عقاري" : "Ready to help with your real estate inquiries"
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1 shrink-0",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: resetChat,
						className: "w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors",
						title: trans("assistant_clear"),
						"aria-label": trans("assistant_clear"),
						children: /* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.8,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
							})
						})
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setIsFullscreen((prev) => !prev),
						className: "w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors",
						title: isFullscreen ? isRtl ? "تصغير" : "Minimize" : isRtl ? "ملء الشاشة" : "Fullscreen",
						"aria-label": isFullscreen ? isRtl ? "تصغير" : "Minimize" : isRtl ? "ملء الشاشة" : "Fullscreen",
						children: isFullscreen ? /* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.8,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
							})
						}) : /* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.8,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
							})
						})
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors",
						title: trans("assistant_close"),
						"aria-label": trans("assistant_close"),
						children: /* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M6 18 18 6M6 6l12 12"
							})
						})
					})
				]
			})]
		})
	});
}
// resources/js/Components/HossamChat/QuickReplies.jsx
function QuickQuestionsChips({ show, isRtl, quickQuestions, onSelectQuestion }) {
	if (!show || !quickQuestions || quickQuestions.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "px-3 sm:px-4 py-3 bg-white border-t border-slate-200 shrink-0",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-1.5 mb-2 text-slate-500",
			children: /* @__PURE__ */ jsx("span", {
				className: "text-[11px] font-medium",
				children: isRtl ? "أسئلة سريعة" : "Quick questions"
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap gap-1.5",
			children: quickQuestions.map((q, qIdx) => /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => onSelectQuestion(q),
				className: "text-[11.5px] font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors text-start leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
				children: q
			}, qIdx))
		})]
	});
}
function MessageQuickReplies({ replies, onSelectReply }) {
	if (!replies || replies.length === 0) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-wrap gap-1.5 mt-2.5 w-full",
		children: replies.map((replyText, idx) => /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => onSelectReply(replyText),
			className: "px-3 py-1.5 text-[11.5px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
			children: replyText
		}, `qr-${idx}`))
	});
}
// resources/js/Components/HossamChat/MessageBubble.jsx
function MessageBubble({ msg, isStreaming, reaction, setReaction, handleSendMessage, isRtl, isLoading, onUnitClick }) {
	const isUser = msg.role === "user";
	const showMeta = !isStreaming;
	const renderInteractiveLink = (rawUrl, label, key) => {
		let cleanUrl = (rawUrl || "").trim();
		let isInternal = false;
		try {
			if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
				const parsed = new URL(cleanUrl);
				const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
				if (currentOrigin && parsed.origin === currentOrigin) {
					cleanUrl = parsed.pathname + parsed.search + parsed.hash;
					isInternal = true;
				} else if (/^\/(?:(?:ar|en)\/)?(?:units|projects|about|contact)/i.test(parsed.pathname)) {
					cleanUrl = parsed.pathname + parsed.search + parsed.hash;
					isInternal = true;
				}
			} else if (cleanUrl.startsWith("/") && !cleanUrl.startsWith("//")) isInternal = true;
		} catch (e) {}
		const isInternalUnitOrProject = isInternal && /^\/(?:(?:ar|en)\/)?(?:units|projects|about|contact)(?:[/?#]|$)/i.test(cleanUrl);
		const isExternalSafe = /^https:\/\/wa\.me\//i.test(cleanUrl) || /^tel:[+0-9\s-]+$/i.test(cleanUrl) || /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(cleanUrl) || cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://");
		if (!isInternalUnitOrProject && !isExternalSafe) return /* @__PURE__ */ jsx("span", {
			className: "font-semibold text-slate-800",
			children: label
		}, key);
		const linkClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 my-0.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer";
		if (!isInternalUnitOrProject) return /* @__PURE__ */ jsxs("a", {
			href: cleanUrl,
			target: cleanUrl.startsWith("http") ? "_blank" : void 0,
			rel: cleanUrl.startsWith("http") ? "noopener noreferrer" : void 0,
			className: linkClasses,
			title: label,
			children: [/* @__PURE__ */ jsx("span", { children: label }), /* @__PURE__ */ jsx("svg", {
				className: "w-3.5 h-3.5 shrink-0 opacity-70",
				fill: "none",
				viewBox: "0 0 24 24",
				stroke: "currentColor",
				strokeWidth: 2,
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx("path", {
					strokeLinecap: "round",
					strokeLinejoin: "round",
					d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				})
			})]
		}, key);
		return /* @__PURE__ */ jsxs(Link, {
			href: cleanUrl,
			onClick: onUnitClick,
			className: linkClasses,
			title: label,
			children: [
				/* @__PURE__ */ jsx("svg", {
					className: "w-3.5 h-3.5 shrink-0 text-primary-700",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2,
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12l1.5 3H1.5L3 3z"
					})
				}),
				/* @__PURE__ */ jsx("span", { children: label }),
				/* @__PURE__ */ jsx("svg", {
					className: "w-3 h-3 shrink-0 opacity-60",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2.2,
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
					})
				})
			]
		}, key);
	};
	const formatInline = (str) => {
		if (!str) return null;
		return str.split(/(\*\*\[[^\]]+\]\([^)]+\)\*\*|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\/(?:ar|en)\/(?:units|projects)\/[^\s<),"]+|https?:\/\/[^\s<),"]+)/g).map((part, pIdx) => {
			if (!part) return null;
			const boldLinkMatch = part.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/);
			const stdLinkMatch = !boldLinkMatch ? part.match(/^\[([^\]]+)\]\(([^)]+)\)$/) : null;
			const linkMatch = boldLinkMatch || stdLinkMatch;
			if (linkMatch) {
				let label = (linkMatch[1] || "").trim();
				if (label.startsWith("**") && label.endsWith("**") && label.length > 4) label = label.slice(2, -2).trim();
				const rawUrl = (linkMatch[2] || "").trim();
				return renderInteractiveLink(rawUrl, label, pIdx);
			}
			if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
				const inner = part.slice(2, -2);
				if (/\[[^\]]+\]\([^)]+\)/.test(inner)) return /* @__PURE__ */ jsx("strong", {
					className: "font-bold text-slate-900",
					children: formatInline(inner)
				}, pIdx);
				return /* @__PURE__ */ jsx("strong", {
					className: "font-bold text-slate-900",
					children: inner
				}, pIdx);
			}
			if (/^\/(?:ar|en)\/(?:units|projects)\/[^\s<),"]+$/i.test(part)) {
				const fallbackLabel = part.includes("/projects/") ? isRtl ? "عرض المشروع" : "View Project" : isRtl ? "عرض الوحدة" : "View Unit";
				return renderInteractiveLink(part, fallbackLabel, pIdx);
			}
			if (/^https?:\/\/[^\s<),"]+$/i.test(part)) return renderInteractiveLink(part, part, pIdx);
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
					className: "my-2 overflow-x-auto rounded-xl border border-slate-200 bg-white",
					children: /* @__PURE__ */ jsx("table", {
						className: "min-w-full text-xs text-start divide-y divide-slate-100",
						children: /* @__PURE__ */ jsx("tbody", { children: tableRows.map((row, rIdx) => {
							const isHeader = rIdx === 0;
							if (row.every((cell) => /^[-:\s|]+$/.test(cell))) return null;
							return /* @__PURE__ */ jsx("tr", {
								className: isHeader ? "bg-slate-50 font-semibold text-slate-800" : "text-slate-700 divide-x divide-slate-100",
								children: row.map((cell, cIdx) => /* @__PURE__ */ jsx("td", {
									className: `px-2.5 py-1.5 whitespace-nowrap ${isHeader ? "font-bold text-slate-900" : ""}`,
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
				elements.push(/* @__PURE__ */ jsx("div", { className: "h-1" }, idx));
				return;
			}
			if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
				inTable = true;
				const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
				tableRows.push(cells);
				return;
			} else if (inTable) flushTable(idx);
			if (/^[-*_]{3,}$/.test(trimmed)) {
				elements.push(/* @__PURE__ */ jsx("hr", { className: "my-2 border-slate-150" }, idx));
				return;
			}
			if (trimmed.startsWith("### ")) {
				elements.push(/* @__PURE__ */ jsxs("h4", {
					className: "font-bold text-slate-900 text-xs sm:text-[13px] mt-2 mb-1 flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx("span", { className: "w-1 h-3 bg-primary-600 rounded-full inline-block" }), /* @__PURE__ */ jsx("span", { children: formatInline(trimmed.slice(4)) })]
				}, idx));
				return;
			}
			if (trimmed.startsWith("## ")) {
				elements.push(/* @__PURE__ */ jsx("h3", {
					className: "font-bold text-slate-900 text-sm mt-2.5 mb-1 text-primary-900 border-b border-slate-100 pb-1",
					children: formatInline(trimmed.slice(3))
				}, idx));
				return;
			}
			if (trimmed.startsWith("# ")) {
				elements.push(/* @__PURE__ */ jsx("h2", {
					className: "font-black text-slate-950 text-sm sm:text-base mt-2.5 mb-1 text-primary-900",
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
					className: "flex items-start gap-2 my-1 ps-0.5 text-slate-800 text-[13px]",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-primary-600 font-bold leading-relaxed shrink-0",
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
					className: "flex items-start gap-2 my-1 ps-0.5 text-slate-800 text-[13px]",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-4 h-4 rounded-full bg-slate-100 text-primary-900 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200/80",
						children: num
					}), /* @__PURE__ */ jsx("span", {
						className: "flex-1 leading-relaxed",
						children: formatInline(numContent)
					})]
				}, idx));
				return;
			}
			elements.push(/* @__PURE__ */ jsx("p", {
				className: "my-0.5 leading-relaxed text-slate-800 text-[13px]",
				children: formatInline(line)
			}, idx));
		});
		if (inTable) flushTable("end");
		return elements;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `concierge-bubble-in flex flex-col ${isUser ? "items-end" : "items-start"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: `flex items-end gap-2 max-w-[92%] ${isUser ? "flex-row-reverse" : "flex-row"}`,
				children: [!isUser && /* @__PURE__ */ jsx("div", {
					className: "w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0 mb-0.5",
					children: /* @__PURE__ */ jsx("img", {
						src: "/images/ai-agent-head.webp",
						alt: "",
						"aria-hidden": "true",
						className: "w-full h-full object-contain"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: `rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${isUser ? `bg-slate-800 text-white ${isRtl ? "rounded-tl-xs" : "rounded-tr-xs"}` : msg.isError ? "bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl" : `bg-white text-slate-800 border border-slate-200 ${isRtl ? "rounded-tr-xs" : "rounded-tl-xs"}`}`,
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
						className: `text-[10px] mt-1 text-end tabular-nums ${isUser ? "text-white/60" : "text-slate-400"}`,
						children: msg.timestamp
					})]
				})]
			}),
			msg.isError && msg.retryText && !isLoading && /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => handleSendMessage(msg.retryText, msg.id),
				className: "flex items-center gap-1.5 mt-1.5 ms-9 text-[11px] font-bold text-primary-700 hover:text-primary-900 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 px-3 py-1.5 rounded-full transition-all",
				children: [/* @__PURE__ */ jsx("svg", {
					className: "w-3.5 h-3.5",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2,
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					})
				}), isRtl ? "إعادة المحاولة" : "Retry"]
			}),
			!isUser && !isStreaming && !msg.isError && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1 mt-1 ms-9",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setReaction(msg.id, "up"),
					className: `w-6 h-6 rounded-full flex items-center justify-center transition-colors ${reaction === "up" ? "text-emerald-600 bg-emerald-50" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"}`,
					"aria-label": "Helpful",
					title: "Helpful",
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-3.5 h-3.5",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 1.8,
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.75c.422 0 .828.077 1.205.218M5.904 18.75V9.75m0 9H3.75a2.25 2.25 0 0 1-2.25-2.25v-4.5a2.25 2.25 0 0 1 2.25-2.25h2.154"
						})
					})
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setReaction(msg.id, "down"),
					className: `w-6 h-6 rounded-full flex items-center justify-center transition-colors ${reaction === "down" ? "text-rose-600 bg-rose-50" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"}`,
					"aria-label": "Not helpful",
					title: "Not helpful",
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-3.5 h-3.5",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 1.8,
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 0H9.75m4.875-11.25H16.5m1.5 0h2.25a2.25 2.25 0 0 1 2.25 2.25v4.5a2.25 2.25 0 0 1-2.25 2.25h-2.25m0-9v9"
						})
					})
				})]
			}),
			!isUser && !isStreaming && msg.quick_replies && msg.quick_replies.length > 0 && !isLoading && /* @__PURE__ */ jsx("div", {
				className: "ms-9 w-full",
				children: /* @__PURE__ */ jsx(MessageQuickReplies, {
					replies: msg.quick_replies,
					onSelectReply: handleSendMessage
				})
			})
		]
	});
}
// resources/js/Components/HossamChat/MessageList.jsx
function MessageList({ messages, streamedMessageId, feedback, setReaction, handleSendMessage, isRtl, isLoading, typingStage, trans, onUnitClick, messagesEndRef }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex-1 px-3 sm:px-4 py-4 overflow-y-auto bg-slate-50 custom-scrollbar scroll-smooth",
		"aria-live": "polite",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-4 max-w-full",
			children: [
				messages.map((msg) => /* @__PURE__ */ jsx(MessageBubble, {
					msg,
					isStreaming: msg.id === streamedMessageId,
					reaction: feedback[msg.id] || null,
					setReaction,
					handleSendMessage,
					isRtl,
					isLoading,
					onUnitClick
				}, msg.id)),
				isLoading && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 pt-1 animate-fadeIn",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shrink-0",
						children: /* @__PURE__ */ jsx("img", {
							src: "/images/ai-agent-head.webp",
							alt: "",
							"aria-hidden": "true",
							className: "w-full h-full object-contain"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tr-xs text-slate-500",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }),
							/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }),
							/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400" }),
							/* @__PURE__ */ jsxs("span", {
								className: "text-[11px] font-medium text-slate-500 ms-1.5",
								children: [
									typingStage === 0 && (trans("assistant_typing") || (isRtl ? "حسام يكتب الآن..." : "Hossam is typing...")),
									typingStage === 1 && (isRtl ? "جاري فحص العقارات المتاحة..." : "Searching properties..."),
									typingStage === 2 && (isRtl ? "جاري تجهيز أفضل ترشيحات..." : "Preparing recommendations...")
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("div", { ref: messagesEndRef })
			]
		})
	});
}
// resources/js/Components/HossamChat/ChatComposer.jsx
function ChatComposer({ inputRef, isLoading, isRtl, trans, onSendMessage }) {
	const [inputMessage, setInputMessage] = useState("");
	const handleSubmit = (e) => {
		if (e) e.preventDefault();
		const text = inputMessage.trim();
		if (!text || isLoading) return;
		onSendMessage(text);
		setInputMessage("");
		if (inputRef?.current) inputRef.current.style.height = "auto";
	};
	const handleTextareaChange = (e) => {
		setInputMessage(e.target.value);
		const target = e.target;
		target.style.height = "auto";
		target.style.height = `${Math.min(target.scrollHeight, 112)}px`;
	};
	const canSend = Boolean(inputMessage.trim()) && !isLoading;
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "p-3 bg-white border-t border-slate-200 shrink-0 concierge-safe-bottom",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-end gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100 transition-colors",
			children: [/* @__PURE__ */ jsx("textarea", {
				ref: inputRef,
				value: inputMessage,
				onChange: handleTextareaChange,
				onKeyDown: (e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						handleSubmit();
					}
				},
				placeholder: trans("assistant_placeholder") || (isRtl ? "اكتب استفسارك هنا..." : "Type your question here..."),
				disabled: isLoading,
				rows: 1,
				className: "flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none resize-none text-[13.5px] text-slate-900 placeholder:text-slate-400 leading-relaxed max-h-28 disabled:opacity-50 py-1 px-0 shadow-none",
				style: { minHeight: "26px" }
			}), /* @__PURE__ */ jsx("button", {
				type: "submit",
				disabled: !canSend,
				className: `w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 mb-0.5 ${canSend ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"}`,
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
						d: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
					})
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400",
			children: [/* @__PURE__ */ jsx("span", {
				className: "hidden sm:inline",
				children: isRtl ? "Enter للإرسال · Shift+Enter لسطر جديد" : "Enter to send · Shift+Enter for new line"
			}), /* @__PURE__ */ jsx("span", {
				className: "ms-auto text-[10px] text-slate-400 font-medium",
				children: isRtl ? "فاميلي هوم · ذكاء اصطناعي" : "Family Home AI"
			})]
		})]
	});
}
// resources/js/Components/HossamChat/HossamChatWidget.jsx
function HossamChatWidget({ autoOpen = false }) {
	const pageObj = usePage() || {};
	const pageProps = pageObj.props || {};
	const component = pageObj.component || "";
	const url = pageObj.url || "";
	const locale = pageProps.locale || (typeof document !== "undefined" ? document.documentElement.lang : "ar") || "ar";
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const { compareList: unitCompareList } = useCompare("unit");
	const { compareList: projectCompareList } = useCompare("project");
	const hasCompareItems = unitCompareList.length > 0 || projectCompareList.length > 0;
	const isAdmin = typeof window !== "undefined" && window.location.pathname.includes("/admin");
	const isTargetPage = Boolean(component === "Public/Units/Show" || component === "Public/Projects/Show" || url && /^\/(?:(?:ar|en)\/)?(?:units|projects)\/[^/?#]+/i.test(url) && !url.includes("/deals"));
	const [hasFixedBottomBar, setHasFixedBottomBar] = useState(() => {
		if (typeof window === "undefined") return isTargetPage;
		return isTargetPage && window.innerWidth < 768;
	});
	const needsBottomClearance = hasFixedBottomBar || hasCompareItems;
	useEffect(() => {
		const updateBottomBarStatus = () => {
			if (typeof window === "undefined") return;
			const isMobile = window.innerWidth < 768;
			const hasDomBottomBar = Boolean(document.querySelector(".fixed.bottom-0"));
			setHasFixedBottomBar(isMobile && (isTargetPage || hasDomBottomBar));
		};
		updateBottomBarStatus();
		window.addEventListener("resize", updateBottomBarStatus, { passive: true });
		window.addEventListener("orientationchange", updateBottomBarStatus, { passive: true });
		return () => {
			window.removeEventListener("resize", updateBottomBarStatus);
			window.removeEventListener("orientationchange", updateBottomBarStatus);
		};
	}, [
		component,
		url,
		isTargetPage,
		hasCompareItems
	]);
	const { isOpen, setIsOpen, isFullscreen, setIsFullscreen, setHasUnread, feedback, setReaction, proactivePill, setProactivePill, messages, setMessages, resetChat } = useChatSession(locale, trans, isRtl, pageProps);
	useEffect(() => {
		if (autoOpen) setIsOpen(true);
	}, [autoOpen, setIsOpen]);
	const { isLoading, typingStage, streamedMessageId, handleSendMessage } = useChatApi({
		messages,
		setMessages,
		locale,
		pageProps,
		isRtl
	});
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);
	const fabButtonRef = useRef(null);
	const wasOpenRef = useRef(false);
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);
	useEffect(() => {
		if (isOpen) {
			setHasUnread(false);
			scrollToBottom();
			const t = setTimeout(() => inputRef.current?.focus(), 150);
			return () => clearTimeout(t);
		}
	}, [
		isOpen,
		scrollToBottom,
		setHasUnread
	]);
	useEffect(() => {
		scrollToBottom();
	}, [
		messages,
		isLoading,
		scrollToBottom
	]);
	useEffect(() => {
		if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
	}, []);
	useEffect(() => {
		if (!isOpen) {
			if (wasOpenRef.current && fabButtonRef.current) fabButtonRef.current.focus();
			wasOpenRef.current = false;
			return;
		}
		wasOpenRef.current = true;
		const handler = (e) => {
			if (e.key === "Escape" && isOpen) {
				e.preventDefault();
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
	}, [
		isOpen,
		setIsOpen,
		setIsFullscreen
	]);
	const quickQuestions = useMemo(() => [
		trans("assistant_quick_1"),
		trans("assistant_quick_2"),
		trans("assistant_quick_3"),
		trans("assistant_quick_4")
	], [trans]);
	const handleUnitLinkClick = useCallback(() => {
		if (typeof window !== "undefined") {
			if (window.innerWidth < 768 || isFullscreen) {
				setIsOpen(false);
				setIsFullscreen(false);
			}
		}
	}, [
		isFullscreen,
		setIsOpen,
		setIsFullscreen
	]);
	const showQuickQuestions = messages.length === 1 && !isLoading;
	if (isAdmin) return null;
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: `fixed z-50 end-4 sm:bottom-8 sm:end-8 print:hidden font-sans transition-all duration-300 ${needsBottomClearance ? "bottom-[100px]" : "bottom-6"}`,
		children: [!isOpen && /* @__PURE__ */ jsxs("div", {
			className: "relative flex items-center",
			children: [proactivePill && /* @__PURE__ */ jsxs("div", {
				className: `absolute bottom-full mb-3 ${isRtl ? "end-0" : "start-0"} w-72 sm:w-80 bg-white border border-slate-200 rounded-xl p-3.5 shadow-lg z-50`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center p-0.5 shrink-0",
									children: /* @__PURE__ */ jsx("img", {
										src: "/images/ai-agent-head.webp",
										alt: "",
										"aria-hidden": "true",
										className: "w-full h-full object-contain"
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-slate-900",
									children: trans("assistant_name")
								}),
								/* @__PURE__ */ jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" })
							]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setProactivePill(null);
							},
							className: "text-slate-500 hover:text-slate-800 text-xs p-1",
							"aria-label": "Close",
							children: "✕"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-700 mt-2 leading-relaxed font-medium",
						children: proactivePill
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-2.5 flex items-center justify-end gap-2",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								setIsOpen(true);
								setProactivePill(null);
							},
							className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold rounded-lg transition-colors",
							children: trans("assistant_proactive_cta")
						})
					})
				]
			}), /* @__PURE__ */ jsx(ChatLauncherButton, {
				ref: fabButtonRef,
				onClick: () => setIsOpen(true),
				title: trans("assistant_launcher_title"),
				description: trans("assistant_launcher_description"),
				expanded: isOpen
			})]
		}), isOpen && /* @__PURE__ */ jsxs("div", {
			id: "hossam-concierge-dialog",
			className: `concierge-open flex flex-col bg-white overflow-hidden border border-slate-200 shadow-[0_12px_36px_rgba(15,23,42,0.16)] ${isFullscreen ? "fixed inset-0 w-auto h-[100dvh] rounded-none sm:inset-4 sm:w-[calc(100vw-32px)] sm:h-[calc(100dvh-32px)] sm:max-w-[460px] sm:ml-auto sm:rounded-3xl" : `w-[calc(100vw-24px)] sm:w-[410px] h-[580px] ${needsBottomClearance ? "max-h-[calc(100dvh-116px)]" : "max-h-[82vh]"} rounded-2xl sm:rounded-3xl`}`,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": trans("assistant_name"),
			children: [
				/* @__PURE__ */ jsx(ChatHeader, {
					trans,
					isRtl,
					isFullscreen,
					setIsFullscreen,
					resetChat,
					onClose: () => {
						setIsOpen(false);
						setIsFullscreen(false);
					}
				}),
				/* @__PURE__ */ jsx(MessageList, {
					messages,
					streamedMessageId,
					feedback,
					setReaction,
					handleSendMessage,
					isRtl,
					isLoading,
					typingStage,
					trans,
					onUnitClick: handleUnitLinkClick,
					messagesEndRef
				}),
				/* @__PURE__ */ jsx(QuickQuestionsChips, {
					show: showQuickQuestions,
					isRtl,
					quickQuestions,
					onSelectQuestion: handleSendMessage
				}),
				/* @__PURE__ */ jsx(ChatComposer, {
					inputRef,
					isLoading,
					isRtl,
					trans,
					onSendMessage: handleSendMessage
				})
			]
		})]
	});
}
export { HossamChatWidget as default };
