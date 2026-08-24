<x-emails.layout
    :subject="$isEnglish ? 'Reset Your Password - Family Home' : 'إعادة ضبط كلمة السر - Family Home'"
    :isEnglish="$isEnglish"
    :locale="$locale"
    :logoUrl="$logoUrl">

    <div style="margin:0 0 18px;">
        <span style="display:inline-block; background-color:#FBF1EE; color:#9C403C; font-size:12px; font-weight:700; padding:5px 14px; border-radius:999px; letter-spacing:.4px;">
            {{ $isEnglish ? 'Password reset request' : 'طلب إعادة ضبط كلمة السر' }}
        </span>
    </div>

    <h1 class="fh-h1" style="margin:0 0 16px; font-size:26px; font-weight:900; color:#292524; line-height:1.5;">
        @if ($isEnglish)
            Reset your password
        @else
            إعادة ضبط كلمة السر
        @endif
    </h1>

    <p style="margin:0; font-size:15.5px; color:#6B6560; line-height:1.95;">
        @if ($isEnglish)
            Hello {{ $userName }}, we received a request to reset the password of your Family Home account. Click the button below to choose a new password.
        @else
            مرحباً {{ $userName }}، تلقينا طلباً لإعادة ضبط كلمة السر الخاصة بحسابك. اضغط الزر أدناه لاختيار كلمة مرور جديدة.
        @endif
    </p>

    {{-- زر إعادة الضبط --}}
    <div style="text-align:center; margin-top:32px;">
        <a href="{{ $resetUrl }}"
           style="display:inline-block; background-color:#B3372F; color:#FFFFFF !important; padding:15px 48px; border-radius:14px; font-size:15.5px; font-weight:700; letter-spacing:.4px;">
            {{ $isEnglish ? 'Reset Your Password Now →' : 'إعادة ضبط كلمة السر الآن ←' }}
        </a>
    </div>

    {{-- صلاحية الرابط --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px dashed #E3DBCF; border-radius:12px; background-color:#FBF9F5; margin-top:22px;">
        <tr>
            <td style="padding:16px 20px; font-size:13.5px; color:#847C74; line-height:1.9;">
                ⏰ {{ $isEnglish ? 'This link is valid for '.$expireMinutes.' minutes only.' : 'هذا الرابط صالح لمدة '.$expireMinutes.' دقيقة فقط.' }}
            </td>
        </tr>
    </table>

    {{-- رابط احتياطي نصي --}}
    <p style="margin:24px 0 6px; font-size:13.5px; color:#847C74; line-height:1.9;">
        {{ $isEnglish ? 'Button not working? Copy the link below into your browser:' : 'الزر لا يعمل؟ انسخ الرابط التالي والصقه في المتصفح:' }}
    </p>
    <p dir="ltr" align="{{ $isEnglish ? 'left' : 'right' }}" style="margin:0; font-size:12px; color:#A39B90; word-break:break-all; line-height:1.8;">
        {{ $resetUrl }}
    </p>

    <p style="margin:22px 0 0; font-size:14.5px; color:#847C74; line-height:1.9;">
        @if ($isEnglish)
            If you didn't request this, you can safely ignore this email — your password won't change.
        @else
            إذا لم تطلب هذا بنفسك، يمكنك تجاهل هذه الرسالة بأمان — لن تتغير كلمة السر.
        @endif
    </p>

</x-emails.layout>
