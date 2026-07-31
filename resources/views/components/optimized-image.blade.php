@props([
    'src',
    'alt' => '',
    'width' => null,
    'height' => null,
    'class' => '',
    'lazy' => true,
    'fallback' => null,
    'role' => null,
])

@php
    $fallbackUrl = $fallback ?? asset('images/fallback.jpg');
    $altText = $alt !== '' ? $alt : config('app.name') . ' - موقع عقارات عائلية';
@endphp

<img 
    src="{{ $src }}" 
    alt="{{ $altText }}" 
    @if($lazy) loading="lazy" decoding="async" @endif
    @if($width) width="{{ $width }}" @endif
    @if($height) height="{{ $height }}" @endif
    @if($role) role="{{ $role }}" @endif
    class="{{ $class }}"
    onerror="this.onerror=null;this.src='{{ $fallbackUrl }}';"
>
