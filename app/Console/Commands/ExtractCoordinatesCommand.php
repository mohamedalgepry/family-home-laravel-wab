<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Services\GoogleMapsUrlResolverService;

class ExtractCoordinatesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:extract-coordinates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Extract latitude and longitude from existing map URLs for projects, units, and areas';

    /**
     * Execute the console command.
     */
    public function handle(GoogleMapsUrlResolverService $resolver)
    {
        $this->info('Starting coordinate extraction...');

        $projectCount = 0;
        $unitCount = 0;
        $areaCount = 0;

        // Process Projects
        $projects = Project::whereNotNull('map_embed_url')
                           ->where(function($q) {
                               $q->whereNull('latitude')->orWhere('latitude', '0');
                           })->get();

        foreach ($projects as $project) {
            $coords = $resolver->resolveAndExtract($project->map_embed_url);
            if ($coords) {
                $project->latitude = $coords['latitude'];
                $project->longitude = $coords['longitude'];
                $project->save();
                $projectCount++;
                $this->line("Updated Project ID {$project->id}");
            }
        }

        // Process Units
        $units = Unit::whereNotNull('map_embed_url')
                     ->where(function($q) {
                         $q->whereNull('latitude')->orWhere('latitude', '0');
                     })->get();

        foreach ($units as $unit) {
            $coords = $resolver->resolveAndExtract($unit->map_embed_url);
            if ($coords) {
                $unit->latitude = $coords['latitude'];
                $unit->longitude = $coords['longitude'];
                $unit->save();
                $unitCount++;
                $this->line("Updated Unit ID {$unit->id}");
            }
        }

        // Process Areas
        $areas = Area::whereNotNull('map_url')
                     ->where(function($q) {
                         $q->whereNull('latitude')->orWhere('latitude', '0');
                     })->get();

        foreach ($areas as $area) {
            $coords = $resolver->resolveAndExtract($area->map_url);
            if ($coords) {
                $area->latitude = $coords['latitude'];
                $area->longitude = $coords['longitude'];
                $area->save();
                $areaCount++;
                $this->line("Updated Area ID {$area->id}");
            }
        }

        $this->info("Extraction complete. Updated $projectCount Projects, $unitCount Units, $areaCount Areas.");
    }
}

