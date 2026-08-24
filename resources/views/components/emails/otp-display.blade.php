@props([
    'code',
    'isEnglish' => false,
])

@php($digits = str_split((string) $code))
{{-- العنصر المميز 🔐: كود OTP في خانات منفصلة مثل لوحة قفل الباب --}}
<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" dir="ltr"
       style="margin:6px auto 0;">
<tr>
    @foreach ($digits as $index => $digit)
        <td width="48" height="62" align="center" valign="middle"
            style="width:48px; height:62px; background-color:#FFFFFF; border:2px solid #E7DED6; border-radius:12px; font-family:'Courier New',monospace; font-size:27px; font-weight:700; color:#7A3B36;">
            {{ $digit }}
        </td>
        @if (! $loop->last)
            <td width="10" style="font-size:0; line-height:0;">&nbsp;</td>
        @endif
    @endforeach
</tr>
</table>
