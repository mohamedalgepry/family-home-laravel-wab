<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Project;

class DeleteProjectAction
{
    public function execute(int $projectId): void
    {
        $project = Project::findOrFail($projectId);
        $project->delete();
    }
}
