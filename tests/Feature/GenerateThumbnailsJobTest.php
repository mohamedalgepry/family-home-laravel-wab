<?php

use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use App\Domain\Listings\Models\Unit;
use Illuminate\Support\Facades\Storage;

test('thumbnail conversion failures escape the job so Laravel can retry them', function () {
    Storage::fake('public');
    Storage::disk('public')->put('units/not-an-image.jpg', 'this is not a decodable image');

    $job = new GenerateThumbnailsJob(Unit::class, 123, ['units/not-an-image.jpg']);

    expect(fn () => $job->handle())->toThrow(RuntimeException::class, 'Failed to generate image variants');
});
