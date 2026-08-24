<x-emails.layout
    :subject="$isEnglish ? 'Password Reset Verification Code - Family Home' : 'رمز إعادة ضبط كلمة السر - Family Home'"
    :isEnglish="$isEnglish"
    :locale="$locale"
    :logoUrl="$logoUrl">

    <h1 class="fh-h1" style="margin:0 0 16px; font-size:26px; font-weight:900; color:#292524; line-height:1.5;">
        @if ($isEnglish)
            Password reset code
        @else
            رمز إعادة ضبط كلمة السر
        @endif
    </h1>

    <p style="margin:0; font-size:15.5px; color:#6B6560; line-height:1.95;">
        @if ($isEnglish)
            Hello {{ $userName }}, we received a request to reset the password of your Family Home account.
        @else
            مرحباً {{ $userName }}، تلقينا طلباً لإعادة ضبط كلمة السر الخاصة بحسابك في منصة Family Home.
        @endif
    </p>

    {{-- 🔐 العنصر المميز: لوحة أرقام الباب --}}
    <div style="background-color:#FAF7F2; border:1px solid #EBE4D9; border-radius:14px; padding:26px 20px; text-align:center; margin-top:24px;">
        <div style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px; margin-bottom:14px;">
            {{ $isEnglish ? 'YOUR VERIFICATION CODE' : 'رمز التحقق الخاص بك' }}
        </div>

        <x-emails.otp-display :code="$otpCode" :isEnglish="$isEnglish" />

        <div style="font-size:13px; font-weight:700; color:#9C403C; margin-top:16px;">
            ⏰ {{ $isEnglish ? 'Valid for 5 minutes only' : 'هذا الرمز صالح لمدة 5 دقائق فقط' }}
        </div>
    </div>

    {{-- خطوات النقل --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px dashed #E3DBCF; border-radius:12px; background-color:#FBF9F5; margin-top:22px;">
        <tr>
            <td style="padding:16px 20px; font-size:13.5px; color:#847C74; line-height:2.1;">
                @if ($isEnglish)
                    1️⃣ Copy the code above<br>
                    2️⃣ Paste it into the verification page that asked for it
                @else
                    1️⃣ انسخ الرمز من الخانات أعلاه<br>
                    2️⃣ أدخله في صفحة التحقق التي طلبت منه
                @endif
            </td>
        </tr>
    </table>

    <p style="margin:24px 0 0; font-size:14.5px; color:#847C74; line-height:1.9;">
        @if ($isEnglish)
            If you didn't request a password reset, you can safely ignore this email — your password won't change.
        @else
            إذا لم تطلب إعادة ضبط كلمة السر بنفسك، يمكنك تجاهل هذه الرسالة بأمان — لن تتغير كلمة السر.
        @endif
    </p>

</x-emails.layout>
