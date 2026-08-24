<x-emails.layout
    :subject="$subject"
    :isEnglish="$isEnglish"
    :locale="$locale"
    :logoUrl="$logoUrl">

    <div style="margin:0 0 18px;">
        <span style="display:inline-block; background-color:#FBF1EE; color:#9C403C; font-size:12px; font-weight:700; padding:5px 14px; border-radius:999px; letter-spacing:.4px;">
            🔔 {{ $isEnglish ? 'New inquiry' : 'استفسار جديد' }}
        </span>
    </div>

    <h1 class="fh-h1" style="margin:0 0 10px; font-size:26px; font-weight:900; color:#292524; line-height:1.5;">
        @if ($isEnglish)
            A new inquiry is addressed to you, {{ $recipientName }}
        @else
            وصل إليك استفسار جديد يا {{ $recipientName }}
        @endif
    </h1>

    {{-- سطر التوجيه: لمن وصل الاستفسار ولماذا --}}
    <p style="margin:0 0 24px; font-size:13.5px; color:#847C74; line-height:1.9;">
        📬 {{ $routingReason }}
    </p>

    {{-- بيانات العميل --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#FAF7F2; border:1px solid #EBE4D9; border-radius:14px;">
        <tr>
            <td style="padding:18px 24px 6px;">
                <span style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">{{ $isEnglish ? 'CLIENT NAME' : 'اسم العميل' }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding:0 24px 16px;">
                <span style="font-size:16px; font-weight:700; color:#292524;">{{ $clientName }}</span>
            </td>
        </tr>

        @if (! empty($clientPhone))
            <tr>
                <td style="padding:0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background-color:#EBE4D9; font-size:0; line-height:0;">&nbsp;</td></tr></table></td>
            </tr>
            <tr>
                <td style="padding:14px 24px 6px;">
                    <span style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">{{ $isEnglish ? 'PHONE NUMBER' : 'رقم الهاتف' }}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:0 24px 16px;" dir="ltr" align="{{ $isEnglish ? 'left' : 'right' }}">
                    <a href="tel:{{ $clientPhone }}" dir="ltr"
                       style="font-size:17px; font-weight:700; color:#7A3B36; letter-spacing:.5px;">{{ $clientPhone }}</a>
                    &nbsp;&nbsp;
                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $clientPhone) }}"
                       style="font-size:12.5px; font-weight:700; color:#128C7E;">WhatsApp ↗</a>
                </td>
            </tr>
        @endif

        @if (! empty($clientEmail))
            <tr>
                <td style="padding:0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background-color:#EBE4D9; font-size:0; line-height:0;">&nbsp;</td></tr></table></td>
            </tr>
            <tr>
                <td style="padding:14px 24px 6px;">
                    <span style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">{{ $isEnglish ? 'EMAIL' : 'البريد الإلكتروني' }}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:0 24px 16px;" dir="ltr" align="{{ $isEnglish ? 'left' : 'right' }}">
                    <span dir="ltr" style="font-size:15px; font-weight:600; color:#292524;">{{ $clientEmail }}</span>
                </td>
            </tr>
        @endif

        @if (! empty($unitName))
            <tr>
                <td style="padding:0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background-color:#EBE4D9; font-size:0; line-height:0;">&nbsp;</td></tr></table></td>
            </tr>
            <tr>
                <td style="padding:14px 24px 6px;">
                    <span style="font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">{{ $isEnglish ? 'PROPERTY INQUIRED ABOUT' : 'العقار المستفسر عنه' }}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:0 24px 18px;">
                    <span style="display:inline-block; background-color:#FBF1EE; color:#9C403C; font-size:13.5px; font-weight:700; padding:6px 14px; border-radius:8px;">🏠 {{ $unitName }}</span>
                </td>
            </tr>
        @endif
    </table>

    {{-- نص رسالة العميل --}}
    <p style="margin:24px 0 8px; font-size:11.5px; font-weight:700; color:#98908A; letter-spacing:1.2px;">
        {{ $isEnglish ? "CLIENT'S MESSAGE" : 'نص رسالة العميل' }}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border-right:3px solid #B3372F; background-color:#FBF9F5; border-radius:10px;">
        <tr>
            <td style="padding:18px 22px; font-size:15px; color:#44403C; line-height:2;">
                {{ $messageContent }}
            </td>
        </tr>
    </table>

    {{-- زر فتح الرسائل --}}
    <div style="text-align:center; margin-top:32px;">
        <a href="{{ $messagesUrl }}"
           style="display:inline-block; background-color:#B3372F; color:#FFFFFF !important; padding:15px 48px; border-radius:14px; font-size:15.5px; font-weight:700; letter-spacing:.4px;">
            {{ $isEnglish ? 'Open Messages →' : 'فتح الرسائل ←' }}
        </a>
    </div>

    {{-- تنبيه الرد السريع --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px dashed #E3DBCF; border-radius:12px; background-color:#FBF9F5; margin-top:22px;">
        <tr>
            <td style="padding:16px 20px; font-size:13.5px; color:#847C74; line-height:1.9;">
                💡 {{ $isEnglish
                    ? 'Clients who receive a quick reply are far more likely to complete the deal.'
                    : 'العملاء الذين يتلقون رداً سريعاً تزداد فرصة إتمام الصفقة كثيراً.' }}
            </td>
        </tr>
    </table>

</x-emails.layout>
