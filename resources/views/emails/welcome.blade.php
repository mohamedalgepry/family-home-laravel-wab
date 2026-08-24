<x-emails.layout
    :subject="$isEnglish ? 'Welcome to Family Home - Your Account Details' : 'مرحباً بك في Family Home - بيانات حسابك'"
    :isEnglish="$isEnglish"
    :locale="$locale"
    :logoUrl="$logoUrl">

    {{-- شارة صغيرة هادئة --}}
    <div style="margin:0 0 18px;">
        <span style="display:inline-block; background-color:#FBF1EE; color:#9C403C; font-size:12px; font-weight:700; padding:5px 14px; border-radius:999px; letter-spacing:.4px;">
            {{ $isEnglish ? 'Your account is ready ✓' : 'تم إنشاء حسابك بنجاح ✓' }}
        </span>
    </div>

    <h1 class="fh-h1" style="margin:0 0 16px; font-size:28px; font-weight:900; color:#292524; line-height:1.5;">
        @if ($isEnglish)
            Welcome to the Family Home<br>family, {{ $userName }} 👋
        @else
            أهلاً بك في عائلة<br>Family Home، {{ $userName }} 👋
        @endif
    </h1>

    <p style="margin:0; font-size:15.5px; color:#6B6560; line-height:1.95;">
        @if ($isEnglish)
            We're glad to have you on board. Below are your login credentials for the admin dashboard — keep them private.
        @else
            يسعدنا انضمامك إلى فريق العمل. تجد في الأسفل بيانات الدخول إلى لوحة التحكم — احتفظ بها ولا تشاركها مع أحد.
        @endif
    </p>

    {{-- صندوق بيانات الدخول --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#FAF7F2; border:1px solid #EBE4D9; border-radius:14px; margin:26px 0 0;">
        <tr>
            <td style="padding:20px 24px 5px;">
                <span style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">{{ $isEnglish ? 'EMAIL' : 'البريد الإلكتروني' }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding:0 24px 18px;" dir="ltr" align="{{ $isEnglish ? 'left' : 'right' }}">
                <span dir="ltr" style="font-size:17px; font-weight:700; color:#292524; letter-spacing:.3px;">{{ $userEmail }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding:0 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td height="1" style="background-color:#EBE4D9; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding:18px 24px 5px;">
                <span style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">{{ $isEnglish ? 'TEMPORARY PASSWORD' : 'كلمة المرور المؤقتة' }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding:0 24px 22px;" dir="ltr" align="{{ $isEnglish ? 'left' : 'right' }}">
                <span dir="ltr" style="font-family:'Courier New',monospace; font-size:19px; font-weight:700; color:#7A3B36; letter-spacing:3px;">{{ $plainPassword }}</span>
            </td>
        </tr>
    </table>

    {{-- زر تسجيل الدخول --}}
    <div style="text-align:center; margin-top:32px;">
        <a href="{{ $loginUrl }}"
           style="display:inline-block; background-color:#B3372F; color:#FFFFFF !important; padding:15px 52px; border-radius:14px; font-size:15.5px; font-weight:700; letter-spacing:.4px;">
            {{ $isEnglish ? 'Sign In Now →' : 'تسجيل الدخول الآن ←' }}
        </a>
    </div>

    {{-- تنبيه الأمان --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px dashed #E3DBCF; border-radius:12px; background-color:#FBF9F5; margin-top:22px;">
        <tr>
            <td style="padding:16px 20px; font-size:13.5px; color:#847C74; line-height:1.9;">
                🔐 <strong style="color:#4B4642;">{{ $isEnglish ? 'For your security:' : 'لحمايتك:' }}</strong>
                @if ($isEnglish)
                    The password above is temporary. Please change it after your first sign-in from your profile page.
                @else
                    كلمة المرور أعلاه مؤقتة. يُرجى تغييرها بعد أول تسجيل دخول من صفحة «الملف الشخصي».
                @endif
            </td>
        </tr>
    </table>

    {{-- سطر ختامي --}}
    <p style="margin:26px 0 0; font-size:14.5px; color:#847C74; line-height:1.9;">
        @if ($isEnglish)
            If you weren't expecting this email, you can safely ignore it or <a href="{{ url('/contact') }}" style="color:#B3372F; font-weight:600;">contact the administration</a>.
        @else
            إذا لم تتوقع هذه الرسالة، يمكنك تجاهلها بأمان أو <a href="{{ url('/contact') }}" style="color:#B3372F; font-weight:600;">التواصل مع الإدارة</a>.
        @endif
    </p>
    <p style="margin:14px 0 0; font-size:15px; font-weight:700; color:#292524;">
        {{ $isEnglish ? 'Best regards, the Family Home team 🤝' : 'تحياتنا، فريق Family Home 🤝' }}
    </p>

</x-emails.layout>
