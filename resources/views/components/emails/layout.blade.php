@props([
    'subject' => 'Family Home',
    'isEnglish' => false,
    'locale' => 'ar',
    'logoUrl' => '',
])

@php($htmlDir = $isEnglish ? 'ltr' : 'rtl')
<!DOCTYPE html>
<html lang="{{ $locale }}" dir="{{ $htmlDir }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
    <title>{{ $subject }}</title>
    <style>
        body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
            background-color: #F5F2ED;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
        }
        table { border-collapse: collapse; }
        a { text-decoration: none; }
        @media only screen and (max-width: 620px) {
            .fh-card { width: 100% !important; border-radius: 0 !important; }
            .fh-px { padding-left: 24px !important; padding-right: 24px !important; }
            .fh-h1 { font-size: 23px !important; }
            .fh-logo-cell { display: block !important; text-align: center !important; padding-bottom: 12px !important; }
            .fh-brand-cell { display: block !important; text-align: center !important; width: 100% !important; }
        }
    </style>
</head>
<body style="background-color:#F5F2ED;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F2ED;">
<tr>
<td align="center" style="padding:40px 16px;">

{{-- ══════════════ البطاقة ══════════════ --}}
<table role="presentation" class="fh-card" width="600" cellpadding="0" cellspacing="0" border="0"
       style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:20px; overflow:hidden; border:1px solid #ECE6DD;">

    {{-- الترويسة الهادئة مع اللوجو المدمج --}}
    <tr>
        <td class="fh-px" style="background-color:#FBF9F6; padding:34px 48px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td class="fh-logo-cell" width="64" style="padding-{{ $isEnglish ? 'right' : 'left' }}:16px;">
                        <img src="{{ $logoUrl }}" alt="Family Home" width="60" height="60"
                             style="display:inline-block; width:60px; height:60px; border-radius:14px; border:1px solid #EDE5DB;">
                    </td>
                    <td class="fh-brand-cell" valign="middle">
                        <div style="font-weight:900; font-size:19px; color:#292524; letter-spacing:.3px;">Family Home</div>
                        <div style="font-size:12.5px; font-weight:600; color:#A39B90; letter-spacing:.6px;">
                            {{ $isEnglish ? 'Trusted Real Estate Platform' : 'منصة العقارات الموثوقة' }}
                        </div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    {{-- فاصل رملي رفيع --}}
    <tr><td height="1" style="background-color:#EDE6DC; font-size:0; line-height:0;">&nbsp;</td></tr>

    {{-- المحتوى --}}
    <tr>
        <td class="fh-px" style="padding:40px 48px 46px; font-family:'Cairo','Segoe UI',Tahoma,sans-serif;">
            {{ $slot }}
        </td>
    </tr>

    {{-- التذييل --}}
    <tr>
        <td class="fh-px" style="background-color:#FBF9F6; border-top:1px solid #EFE9E0; padding:24px 48px; text-align:center;">
            <p style="margin:0 0 6px; font-size:12.5px; color:#ABA39A; line-height:1.9;">
                {{ $isEnglish
                    ? 'You received this email because you have an account on the Family Home real estate platform.'
                    : 'استلمتَ هذه الرسالة لأن لديك حساباً على منصة Family Home العقارية.' }}
            </p>
            <p dir="ltr" style="margin:0; font-size:12.5px; color:#ABA39A;">
                &copy; {{ date('Y') }} Family Home · familyhome-co.com
            </p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>
</body>
</html>
