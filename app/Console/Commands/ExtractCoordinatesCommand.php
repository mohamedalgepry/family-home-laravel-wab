<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;

class ExtractCoordinatesCommand extends Command
{
    use ExtractsCoordinatesFromUrl;

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
    protected $description = 'Extract latitude and longitude from existing map_embed_url for projects and units';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting coordinate extraction...');

        $projectCount = 0;
        $unitCount = 0;

        // Process Projects
        $projects = Project::whereNotNull('map_embed_url')
                           ->where(function($q) {
                               $q->whereNull('latitude')->orWhere('latitude', '0');
                           })->get();

        foreach ($projects as $project) {
            $coords = $this->extractCoordinates($project->map_embed_url);
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
            $coords = $this->extractCoordinates($unit->map_embed_url);
            if ($coords) {
                $unit->latitude = $coords['latitude'];
                $unit->longitude = $coords['longitude'];
                $unit->save();
                $unitCount++;
                $this->line("Updated Unit ID {$unit->id}");
            }
        }

        $this->info("Extraction complete. Updated $projectCount Projects and $unitCount Units.");
    }
}
