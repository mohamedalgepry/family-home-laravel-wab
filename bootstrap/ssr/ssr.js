import { Head, createInertiaApp, createServer, useForm, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/Components/UI/InputField.jsx
function InputField({ name, label, type = "text", value, onChange, placeholder, required = false, autoComplete, dir }) {
	const { errors } = usePage().props;
	const error = errors[name];
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-4",
		children: [
			label && /* @__PURE__ */ jsxs("label", {
				htmlFor: name,
				className: "block text-sm font-medium text-secondary-950 mb-1",
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "text-primary-900 mr-1",
					children: "*"
				})]
			}),
			/* @__PURE__ */ jsx("input", {
				id: name,
				name,
				type,
				value,
				onChange,
				placeholder,
				autoComplete,
				dir: dir || (type === "email" || type === "password" ? "ltr" : void 0),
				className: `w-full px-4 py-2.5 border rounded-lg text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 ${error ? "border-error bg-error/5" : "border-secondary-200 bg-white hover:border-secondary-300"}`
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-error rtl:text-right",
				children: error
			})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/Button.jsx
function Button({ children, type = "submit", variant = "primary", disabled = false, className = "", onClick }) {
	return /* @__PURE__ */ jsx("button", {
		type,
		disabled,
		onClick,
		className: `w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${{
			primary: "bg-primary-900 text-white hover:bg-primary-950 focus:ring-primary-900",
			secondary: "bg-secondary-100 text-secondary-950 hover:bg-secondary-200 focus:ring-secondary-300",
			ghost: "bg-transparent text-primary-900 hover:bg-primary-50 focus:ring-primary-900"
		}[variant]} ${className}`,
		children
	});
}
//#endregion
//#region resources/js/Utils/trans.js
var translations = {
	ar: {
		login_title: "تسجيل الدخول",
		login_submit: "دخول",
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		remember_me: "تذكرني",
		forgot_password: "نسيت كلمة المرور؟",
		reset_password_title: "إعادة تعيين كلمة المرور",
		send_reset_link: "إرسال رابط إعادة التعيين",
		check_email: "تحقق من بريدك الإلكتروني",
		password_reset_success: "تم إعادة تعيين كلمة المرور",
		password_requirements: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
		back_to_login: "العودة إلى تسجيل الدخول",
		email_placeholder: "أدخل بريدك الإلكتروني",
		new_password: "كلمة المرور الجديدة",
		confirm_password: "تأكيد كلمة المرور",
		login_button: "تسجيل الدخول",
		reset_button: "إعادة تعيين",
		brand_name: "فاميلي هوم",
		brand_tagline: "منصة التسويق العقاري الأولى",
		profile_title: "الملف الشخصي",
		profile_info: "المعلومات الشخصية",
		contact_info: "معلومات التواصل",
		change_password: "تغيير كلمة المرور",
		current_password: "كلمة المرور الحالية",
		phone: "رقم الهاتف",
		whatsapp: "رقم الواتساب",
		facebook: "رابط فيسبوك",
		avatar: "الصورة الشخصية",
		upload_avatar: "رفع صورة",
		remove_avatar: "حذف الصورة",
		save: "حفظ",
		cancel: "إلغاء",
		name: "الاسم",
		confirm_password: "تأكيد كلمة المرور",
		profile_updated: "تم تحديث الملف الشخصي بنجاح",
		password_changed: "تم تغيير كلمة المرور بنجاح"
	},
	en: {
		login_title: "Sign In",
		login_submit: "Sign In",
		email: "Email",
		password: "Password",
		remember_me: "Remember Me",
		forgot_password: "Forgot Password?",
		reset_password_title: "Reset Password",
		send_reset_link: "Send Reset Link",
		check_email: "Check your email",
		password_reset_success: "Password reset successfully",
		password_requirements: "Password must be at least 8 characters",
		back_to_login: "Back to Login",
		email_placeholder: "Enter your email",
		new_password: "New Password",
		confirm_password: "Confirm Password",
		login_button: "Sign In",
		reset_button: "Reset",
		brand_name: "Family Home",
		brand_tagline: "The Premier Real Estate Platform",
		profile_title: "Profile",
		profile_info: "Personal Information",
		contact_info: "Contact Information",
		change_password: "Change Password",
		current_password: "Current Password",
		phone: "Phone Number",
		whatsapp: "WhatsApp Number",
		facebook: "Facebook Link",
		avatar: "Avatar",
		upload_avatar: "Upload Image",
		remove_avatar: "Remove Image",
		save: "Save",
		cancel: "Cancel",
		name: "Name",
		confirm_password: "Confirm Password",
		profile_updated: "Profile updated successfully",
		password_changed: "Password changed successfully"
	}
};
function useTrans(locale) {
	const lang = translations[locale] || translations.en;
	return (key, replacements = {}) => {
		let text = lang[key] || key;
		for (const [k, v] of Object.entries(replacements)) text = text.replace(`:${k}`, v);
		return text;
	};
}
//#endregion
//#region resources/js/Components/Layout/AuthLayout.jsx
function AuthLayout({ children, title }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	return /* @__PURE__ */ jsxs("div", {
		dir: locale === "ar" ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex-1 flex items-center justify-center px-4 py-12",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-md",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-secondary-950",
						children: trans("brand_name")
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted mt-1",
						children: trans("brand_tagline")
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-6 sm:p-8",
					children: [title && /* @__PURE__ */ jsx("h2", {
						className: "text-xl font-semibold text-secondary-950 mb-6 text-center",
						children: title
					}), children]
				})]
			})
		}), /* @__PURE__ */ jsxs("footer", {
			className: "text-center py-4 text-xs text-muted",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ",
				trans("brand_name")
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/Shared/ForgotPassword.jsx
var ForgotPassword_exports = /* @__PURE__ */ __exportAll({ default: () => ForgotPassword });
function ForgotPassword() {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const { data, setData, post, processing, errors } = useForm({ email: "" });
	function handleSubmit(e) {
		e.preventDefault();
		post("/forgot-password");
	}
	return /* @__PURE__ */ jsxs(AuthLayout, {
		title: trans("reset_password_title"),
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted mb-6 text-center",
				children: trans("forgot_password")
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				noValidate: true,
				children: [/* @__PURE__ */ jsx(InputField, {
					name: "email",
					label: trans("email"),
					type: "email",
					value: data.email,
					onChange: (e) => setData("email", e.target.value),
					placeholder: trans("email_placeholder"),
					required: true,
					autoComplete: "email"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: processing,
					children: processing ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "animate-spin h-4 w-4",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4",
								fill: "none"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							})]
						}), trans("send_reset_link")]
					}) : trans("send_reset_link")
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6 text-center",
				children: /* @__PURE__ */ jsx("a", {
					href: "/login",
					className: "text-sm text-primary-900 hover:text-primary-950 underline-offset-2 hover:underline",
					children: trans("back_to_login")
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Shared/Login.jsx
var Login_exports = /* @__PURE__ */ __exportAll({ default: () => Login });
function Login() {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false
	});
	function handleSubmit(e) {
		e.preventDefault();
		post("/login");
	}
	return /* @__PURE__ */ jsx(AuthLayout, {
		title: trans("login_title"),
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			children: [
				/* @__PURE__ */ jsx(InputField, {
					name: "email",
					label: trans("email"),
					type: "email",
					value: data.email,
					onChange: (e) => setData("email", e.target.value),
					placeholder: trans("email_placeholder"),
					required: true,
					autoComplete: "email"
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "password",
					label: trans("password"),
					type: "password",
					value: data.password,
					onChange: (e) => setData("password", e.target.value),
					placeholder: "••••••••",
					required: true,
					autoComplete: "current-password"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-sm text-secondary-700 cursor-pointer",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							name: "remember",
							checked: data.remember,
							onChange: (e) => setData("remember", e.target.checked),
							className: "rounded border-secondary-300 text-primary-900 focus:ring-primary-900/30"
						}), trans("remember_me")]
					}), /* @__PURE__ */ jsx("a", {
						href: "/forgot-password",
						className: "text-sm text-primary-900 hover:text-primary-950 underline-offset-2 hover:underline",
						children: trans("forgot_password")
					})]
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: processing,
					children: processing ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "animate-spin h-4 w-4",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4",
								fill: "none"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							})]
						}), trans("login_button")]
					}) : trans("login_button")
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/Shared/Profile.jsx
var Profile_exports = /* @__PURE__ */ __exportAll({ default: () => Profile });
function Profile() {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const user = auth.user;
	const profileForm = useForm({
		name: user?.name || "",
		phone: user?.phone || "",
		whatsapp: user?.whatsapp || "",
		facebook: user?.facebook || ""
	});
	const passwordForm = useForm({
		current_password: "",
		password: "",
		password_confirmation: ""
	});
	function handleProfileSubmit(e) {
		e.preventDefault();
		profileForm.put("/profile");
	}
	function handlePasswordSubmit(e) {
		e.preventDefault();
		passwordForm.put("/password");
	}
	function handleAvatarChange(e) {
		const file = e.target.files?.[0];
		if (file) {
			new FormData().append("avatar", file);
			profileForm.post("/profile/avatar", { forceFormData: true });
		}
	}
	return /* @__PURE__ */ jsx(AuthLayout, {
		title: trans("profile_title"),
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ jsxs("section", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-semibold text-secondary-950 mb-4",
						children: trans("profile_info")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 mb-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-20 h-20 rounded-full bg-surface overflow-hidden flex-shrink-0 border-2 border-secondary-200",
							children: user?.avatar ? /* @__PURE__ */ jsx("img", {
								src: user.avatar,
								alt: user.name,
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ jsx("div", {
								className: "w-full h-full flex items-center justify-center text-2xl font-bold text-secondary-400 bg-surface",
								children: user?.name?.charAt(0) || "?"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-secondary-950",
								children: user?.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted",
								children: user?.email
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "inline-block mt-2 text-xs text-primary-900 hover:text-primary-950 cursor-pointer underline-offset-2 hover:underline",
								children: [trans("upload_avatar"), /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: handleAvatarChange
								})]
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleProfileSubmit,
						noValidate: true,
						children: [
							/* @__PURE__ */ jsx(InputField, {
								name: "name",
								label: trans("name"),
								value: profileForm.data.name,
								onChange: (e) => profileForm.setData("name", e.target.value),
								required: true
							}),
							/* @__PURE__ */ jsx(InputField, {
								name: "phone",
								label: trans("phone"),
								type: "tel",
								value: profileForm.data.phone,
								onChange: (e) => profileForm.setData("phone", e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ jsx(InputField, {
								name: "whatsapp",
								label: trans("whatsapp"),
								type: "tel",
								value: profileForm.data.whatsapp,
								onChange: (e) => profileForm.setData("whatsapp", e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ jsx(InputField, {
								name: "facebook",
								label: trans("facebook"),
								type: "url",
								value: profileForm.data.facebook,
								onChange: (e) => profileForm.setData("facebook", e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: profileForm.processing,
								className: "mt-2",
								children: profileForm.processing ? trans("loading") : trans("save")
							})
						]
					})
				] }),
				/* @__PURE__ */ jsx("hr", { className: "border-secondary-200" }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-semibold text-secondary-950 mb-4",
					children: trans("change_password")
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handlePasswordSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ jsx(InputField, {
							name: "current_password",
							label: trans("current_password"),
							type: "password",
							value: passwordForm.data.current_password,
							onChange: (e) => passwordForm.setData("current_password", e.target.value),
							placeholder: "••••••••",
							required: true,
							autoComplete: "current-password"
						}),
						/* @__PURE__ */ jsx(InputField, {
							name: "password",
							label: trans("new_password"),
							type: "password",
							value: passwordForm.data.password,
							onChange: (e) => passwordForm.setData("password", e.target.value),
							placeholder: "••••••••",
							required: true,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ jsx(InputField, {
							name: "password_confirmation",
							label: trans("confirm_password"),
							type: "password",
							value: passwordForm.data.password_confirmation,
							onChange: (e) => passwordForm.setData("password_confirmation", e.target.value),
							placeholder: "••••••••",
							required: true,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: passwordForm.processing,
							className: "mt-2",
							children: passwordForm.processing ? trans("loading") : trans("change_password")
						})
					]
				})] })
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/Shared/ResetPassword.jsx
var ResetPassword_exports = /* @__PURE__ */ __exportAll({ default: () => ResetPassword });
function ResetPassword() {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const { data, setData, post, processing, errors } = useForm({
		token: "",
		email: "",
		password: "",
		password_confirmation: ""
	});
	function handleSubmit(e) {
		e.preventDefault();
		post("/reset-password");
	}
	return /* @__PURE__ */ jsxs(AuthLayout, {
		title: trans("reset_password_title"),
		children: [/* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			children: [
				/* @__PURE__ */ jsx("input", {
					type: "hidden",
					name: "token",
					value: data.token
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "email",
					label: trans("email"),
					type: "email",
					value: data.email,
					onChange: (e) => setData("email", e.target.value),
					placeholder: trans("email_placeholder"),
					required: true,
					autoComplete: "email"
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "password",
					label: trans("new_password"),
					type: "password",
					value: data.password,
					onChange: (e) => setData("password", e.target.value),
					placeholder: "••••••••",
					required: true,
					autoComplete: "new-password"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted mb-4 -mt-2",
					children: trans("password_requirements")
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "password_confirmation",
					label: trans("confirm_password"),
					type: "password",
					value: data.password_confirmation,
					onChange: (e) => setData("password_confirmation", e.target.value),
					placeholder: "••••••••",
					required: true,
					autoComplete: "new-password"
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: processing,
					children: processing ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "animate-spin h-4 w-4",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4",
								fill: "none"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							})]
						}), trans("reset_button")]
					}) : trans("reset_button")
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ jsx("a", {
				href: "/login",
				className: "text-sm text-primary-900 hover:text-primary-950 underline-offset-2 hover:underline",
				children: trans("back_to_login")
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/Shared/Welcome.jsx
var Welcome_exports = /* @__PURE__ */ __exportAll({ default: () => Welcome });
function Welcome({ auth, laravelVersion, phpVersion }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Family Home - منصة تسويق عقاري" }), /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-[#F5F5F5]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "text-center p-8",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold text-[#1A1A1A]",
					children: "Family Home"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-[#6B6B6B] mt-2",
					children: "منصة تسويق عقاري"
				}),
				auth.user && /* @__PURE__ */ jsxs("p", {
					className: "text-[#CC0000] mt-4 font-semibold",
					children: ["مرحباً ", auth.user.name]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-sm text-[#6B6B6B] mt-8",
					children: [
						"Laravel ",
						laravelVersion,
						" / PHP ",
						phpVersion
					]
				})
			]
		})
	})] });
}
//#endregion
//#region resources/js/ssr.jsx
createServer((page) => createInertiaApp({
	page,
	render: renderToString,
	resolve: (name) => {
		return (/* @__PURE__ */ Object.assign({
			"./Pages/Shared/ForgotPassword.jsx": ForgotPassword_exports,
			"./Pages/Shared/Login.jsx": Login_exports,
			"./Pages/Shared/Profile.jsx": Profile_exports,
			"./Pages/Shared/ResetPassword.jsx": ResetPassword_exports,
			"./Pages/Shared/Welcome.jsx": Welcome_exports
		}))[`./Pages/${name}.jsx`];
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export {};
