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
                
                // If not WebP or larger than 400KB
                if ($ext !== 'webp' || $size > 400 * 1024) {
                    $dir = dirname($path);
                    $filename = pathinfo($path, PATHINFO_FILENAME);
                    $newPath = $dir !== '.' ? $dir . '/' . $filename . '.webp' : $filename . '.webp';
                    
                    // Temp name to avoid read/write conflicts if the huge file is already named .webp
                    if ($path === $newPath) {
                        $newPath = $dir . '/' . $filename . '_' . Str::random(5) . '.webp';
                    }
                    
                    $absNewPath = $disk->path($newPath);
                    
                    if ($optimizer->convertToWebp($absPath, $absNewPath, 80)) {
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

        $this->info("Done! Checked: $totalChecked | Optimized: $totalOptimized | Failed: $totalFailed");
    }
}
