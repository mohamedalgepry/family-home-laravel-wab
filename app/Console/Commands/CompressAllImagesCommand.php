<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Media\Services\ImageOptimizerService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompressAllImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:compress-all-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compress all old listing images and convert them to WebP';

    /**
     * Execute the console command.
     */
    public function handle(ImageOptimizerService $optimizer)
    {
        $this->info('Starting global image compression...');

        $disk = Storage::disk('public');
        $models = [
            'Units' => UnitImage::class,
            'Projects' => ProjectImage::class,
        ];

        $totalChecked = 0;
        $totalOptimized = 0;
        $totalFailed = 0;

        foreach ($models as $name => $modelClass) {
            $this->info("Scanning $name images...");
            $images = $modelClass::all();
            
            $bar = $this->output->createProgressBar(count($images));
            $bar->start();

            foreach ($images as $image) {
                $totalChecked++;
                $path = $image->path;
                
                if (!$path) {
                    $bar->advance();
                    continue;
                }
                
                $absPath = $disk->path($path);
                if (!file_exists($absPath)) {
                    $bar->advance();
                    continue;
                }
                
                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                $size = filesize($absPath);
                
                $dir = dirname($path);
                $filename = pathinfo($path, PATHINFO_FILENAME);
                
                $hasMissingVariants = false;
                if ($ext === 'webp') {
                    $variants = ['thumb', 'medium', 'large'];
                    foreach ($variants as $prefix) {
                        $variantPath = $dir !== '.' ? "$dir/{$prefix}_{$filename}.webp" : "{$prefix}_{$filename}.webp";
                        if (!file_exists($disk->path($variantPath))) {
                            $hasMissingVariants = true;
                            break;
                        }
                    }
                }
                
                // If not WebP or larger than 400KB, or missing responsive variants
                if ($ext !== 'webp' || $size > 400 * 1024 || $hasMissingVariants) {
                    $newPath = $dir !== '.' ? $dir . '/' . $filename . '.webp' : $filename . '.webp';
                    
                    // Temp name to avoid read/write conflicts if the huge file is already named .webp
                    if ($path === $newPath) {
                        $newPath = $dir . '/' . $filename . '_' . Str::random(5) . '.webp';
                    }
                    
                    $absNewPath = $disk->path($newPath);
                    
                    if ($optimizer->convertToWebp($absPath, $absNewPath, 85)) {
                        // Clean up old file if name changed
                        if ($path !== $newPath && file_exists($absPath)) {
                            @unlink($absPath);
                        }
                        
                        $image->path = $newPath;
                        $image->save();
                        $totalOptimized++;
                    } else {
                        $totalFailed++;
                    }
                }
                
                $bar->advance();
            }
            
            $bar->finish();
            $this->newLine(2);
        }

        $this->compressDirectory('settings', $optimizer, $disk);
        $this->compressDirectory('areas', $optimizer, $disk);

        $this->info("Done! Checked: $totalChecked | Optimized: $totalOptimized | Failed: $totalFailed");
    }

    private function compressDirectory(string $directory, ImageOptimizerService $optimizer, \Illuminate\Contracts\Filesystem\Filesystem $disk)
    {
        $this->info("Scanning directory: $directory...");
        if (!$disk->exists($directory)) return;

        $files = $disk->allFiles($directory);
        foreach ($files as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

            $absPath = $disk->path($file);
            $size = filesize($absPath);

            $dir = dirname($file);
            $filename = pathinfo($file, PATHINFO_FILENAME);
            $newPath = $dir !== '.' ? $dir . '/' . $filename . '.webp' : $filename . '.webp';

            if ($ext !== 'webp' || $size > 400 * 1024) {
                // Temp name to avoid read/write conflicts if the huge file is already named .webp
                if ($file === $newPath) {
                    $newPath = $dir . '/' . $filename . '_' . Str::random(5) . '.webp';
                }

                $absNewPath = $disk->path($newPath);
                
                if ($optimizer->convertToWebp($absPath, $absNewPath, 85)) {
                    if ($file !== $newPath && file_exists($absPath)) {
                        @unlink($absPath);
                        // Update settings DB if it's a setting
                        if ($directory === 'settings') {
                            \Illuminate\Support\Facades\DB::table('settings')
                                ->where('value', $file)
                                ->update(['value' => $newPath]);
                        }
                    }
                    $this->line("Optimized: $file -> $newPath");
                }
            }
        }
    }
}
