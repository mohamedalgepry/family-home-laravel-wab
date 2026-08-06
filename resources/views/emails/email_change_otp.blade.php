<!DOCTYPE html>
<html lang="{{ $locale ?? 'ar' }}" dir="{{ ($locale ?? 'ar') === 'en' ? 'ltr' : 'rtl' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $isEnglish ? 'Email Address Verification Code' : 'رمز تأكيد البريد الإلكتروني' }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 20px 0;
            -webkit-text-size-adjust: 100%;
        }
        .email-container {
            max-width: 560px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            padding: 32px 20px;
            text-align: center;
        }
        .logo-box {
            width: 80px;
            height: 80px;
            margin: 0 auto 16px auto;
            background-color: #ffffff;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: inline-block;
            box-sizing: border-box;
        }
        .logo-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .brand-name {
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            letter-spacing: 0.5px;
        }
        .body-content {
            padding: 32px 28px;
            line-height: 1.6;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            color: #475569;
            margin-bottom: 20px;
        }
        .otp-container {
            background-color: #fef2f2;
            border: 2px dashed #fca5a5;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 24px 0;
        }
        .otp-label {
            font-size: 12px;
            font-weight: 600;
            color: #991b1b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: 800;
            color: #dc2626;
            letter-spacing: 8px;
            margin: 0;
        }
        .expiry-note {
            font-size: 12px;
            color: #ef4444;
            font-weight: 600;
            margin-top: 8px;
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div style="text-align: center;">
                <div class="logo-box" style="width: 80px; height: 80px; margin: 0 auto 16px auto; background-color: #ffffff; border-radius: 50%; padding: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: inline-block; box-sizing: border-box;">
                    <img src="{{ $logoUrl }}" alt="Logo" class="logo-img" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
            </div>
            <h1 class="brand-name">Family Home</h1>
        </div>

        <div class="body-content">
            @if($isEnglish)
                <div class="greeting">Hello {{ $userName }}!</div>
                <p class="text">We received a request to verify this email address for your Family Home account.</p>

                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">{{ $otpCode }}</div>
                    <div class="expiry-note">⏰ Valid for 5 minutes only</div>
                </div>

                <p class="text">If you did not request to change your email address, no further action is required.</p>
            @else
                <div class="greeting">مرحباً {{ $userName }}!</div>
                <p class="text">لقد طلبنا التأكد من صحة هذا البريد الإلكتروني ليتم ربطه بحسابك في منصة Family Home.</p>

                <div class="otp-container">
                    <div class="otp-label">رمز تأكيد البريد الإلكتروني</div>
                    <div class="otp-code">{{ $otpCode }}</div>
                    <div class="expiry-note">⏰ هذا الرمز صالـح لمدة 5 دقائق فقط</div>
                </div>

                <p class="text">إذا لم تقم بطلب تغيير البريد الإلكتروني بنفسك، فيمكنك تجاهل هذه الرسالة بأمان.</p>
            @endif
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Family Home. All rights reserved.
        </div>
    </div>
</body>
</html>
