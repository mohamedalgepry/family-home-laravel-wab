<!DOCTYPE html>
<html lang="{{ $locale ?? 'ar' }}" dir="{{ ($locale ?? 'ar') === 'en' ? 'ltr' : 'rtl' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $isEnglish ? 'Welcome to Family Home' : 'مرحباً بك في Family Home' }}</title>
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
            background: linear-gradient(135deg, #991b1b 0%, #450a0a 100%);
            padding: 32px 20px;
            text-align: center;
        }
        .logo-box {
            width: 72px;
            height: 72px;
            margin: 0 auto 12px auto;
            background: #ffffff;
            border-radius: 50%;
            padding: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: inline-block;
        }
        .logo-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 50%;
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
        .credentials-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
        }
        .credential-row {
            margin-bottom: 12px;
        }
        .credential-row:last-child {
            margin-bottom: 0;
        }
        .credential-label {
            font-size: 12px;
            font-weight: 600;
            color: #991b1b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .credential-value {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            word-break: break-all;
        }
        .login-btn {
            display: inline-block;
            background: #991b1b;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14px;
            margin-top: 8px;
        }
        .security-note {
            font-size: 12px;
            color: #ef4444;
            font-weight: 600;
            margin-top: 16px;
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
            <div class="logo-box" style="width: 72px; height: 72px; margin: 0 auto 12px auto; background-color: #ffffff !important; background: #ffffff !important; border-radius: 50%; padding: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: inline-block;">
                <img src="{{ $logoUrl }}" alt="Logo" class="logo-img" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; background-color: #ffffff !important; background: #ffffff !important;">
            </div>
            <h1 class="brand-name">Family Home</h1>
        </div>

        <div class="body-content">
            @if($isEnglish)
                <div class="greeting">Welcome, {{ $userName }}!</div>
                <p class="text">Your account has been created on the Family Home platform. Below are your login credentials:</p>

                <div class="credentials-box">
                    <div class="credential-row">
                        <div class="credential-label">Email</div>
                        <div class="credential-value">{{ $userEmail }}</div>
                    </div>
                    <div class="credential-row">
                        <div class="credential-label">Password</div>
                        <div class="credential-value">{{ $plainPassword }}</div>
                    </div>
                </div>

                <a href="{{ $loginUrl }}" class="login-btn">Sign In Now</a>

                <p class="security-note">⚠️ For your security, please change your password after your first login.</p>
            @else
                <div class="greeting">مرحباً {{ $userName }}!</div>
                <p class="text">تم إنشاء حسابك بنجاح على منصة Family Home. فيما يلي بيانات تسجيل الدخول الخاصة بك:</p>

                <div class="credentials-box">
                    <div class="credential-row">
                        <div class="credential-label">البريد الإلكتروني</div>
                        <div class="credential-value">{{ $userEmail }}</div>
                    </div>
                    <div class="credential-row">
                        <div class="credential-label">كلمة المرور</div>
                        <div class="credential-value">{{ $plainPassword }}</div>
                    </div>
                </div>

                <a href="{{ $loginUrl }}" class="login-btn">تسجيل الدخول الآن</a>

                <p class="security-note">⚠️ لأمان حسابك، يرجى تغيير كلمة المرور بعد أول تسجيل دخول.</p>
            @endif
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Family Home. All rights reserved.
        </div>
    </div>
</body>
</html>
