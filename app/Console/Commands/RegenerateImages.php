<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class RegenerateImages extends Command
{
    protected $signature = 'images:regenerate';

    protected $description = 'Generate missing WebP thumbnails (and WebP originals) for all existing listing/article images';

    public function handle(): int
    {
        $disk = Storage::disk('public');

        $units = Unit::with('images')->get();
        $projects = Project::with('images')->get();
        $articles = Article::with('images')->get();

        $paths = [];

        foreach ($units as $unit) {
            foreach ($unit->images as $image) {
                $paths[] = ['modelType' => 'unit', 'modelId' => $unit->id, 'paths' => [$image->path]];
            }
        }

        foreach ($projects as $project) {
            foreach ($project->images as $image) {
                $paths[] = ['modelType' => 'project', 'modelId' => $project->id, 'paths' => [$image->path]];
            }
        }

        foreach ($articles as $article) {
            foreach ($article->images as $image) {
                $paths[] = ['modelType' => 'article', 'modelId' => $article->id, 'paths' => [$image->path]];
            }
        }

        if (empty($paths)) {
            $this->info('No images found to process.');

            return Command::SUCCESS;
        }

        $processed = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($paths as $item) {
            $relativePath = $item['paths'][0];

            if (! $disk->exists($relativePath)) {
                $skipped++;
                continue;
            }

            try {
                $job = new \App\Domain\Media\Jobs\GenerateThumbnailsJob(
                    $item['modelType'],
                    $item['modelId'],
                    $item['paths'],
                );

                $job->handle();

                $processed++;
                $this->line("  ✓ {$relativePath}");
            } catch (\Throwable $e) {
                $failed++;
                $this->error("  ✗ {$relativePath} — {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("Done: {$processed} processed, {$skipped} skipped (missing), {$failed} failed.");

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
