<x-emails.layout
    :subject="$isEnglish ? 'Email Address Verification Code - Family Home' : 'رمز تأكيد تغيير البريد الإلكتروني - Family Home'"
    :isEnglish="$isEnglish"
    :locale="$locale"
    :logoUrl="$logoUrl">

    <h1 class="fh-h1" style="margin:0 0 16px; font-size:26px; font-weight:900; color:#292524; line-height:1.5;">
        @if ($isEnglish)
            Confirm your new email
        @else
            تأكيد بريدك الإلكتروني الجديد
        @endif
    </h1>

    <p style="margin:0; font-size:15.5px; color:#6B6560; line-height:1.95;">
        @if ($isEnglish)
            Hello {{ $userName }}, you requested changing your account email to this address. Use the code below to confirm the change.
        @else
            مرحباً {{ $userName }}، طلبتَ تغيير البريد الإلكتروني لحسابك إلى هذا العنوان. استخدم الرمز أدناه لتأكيد التغيير.
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

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px dashed #E3DBCF; border-radius:12px; background-color:#FBF9F5; margin-top:22px;">
        <tr>
            <td style="padding:16px 20px; font-size:13.5px; color:#847C74; line-height:2.1;">
                @if ($isEnglish)
                    1️⃣ Copy the code above<br>
                    2️⃣ Paste it into the email change page in your profile
                @else
                    1️⃣ انسخ الرمز من الخانات أعلاه<br>
                    2️⃣ أدخله في صفحة تغيير البريد داخل ملفك الشخصي
                @endif
            </td>
        </tr>
    </table>

    <p style="margin:24px 0 0; font-size:14.5px; color:#847C74; line-height:1.9;">
        @if ($isEnglish)
            If you didn't request this change, please ignore this email — your current email will remain unchanged.
        @else
            إذا لم تطلب هذا التغيير بنفسك، تجاهل هذه الرسالة — سيبقى بريدك الحالي كما هو دون أي تعديل.
        @endif
    </p>

</x-emails.layout>
