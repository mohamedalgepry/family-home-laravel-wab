<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Policies\ProjectPolicy;
use App\Domain\Listings\Policies\UnitPolicy;

beforeEach(function () {
    $this->admin = createUser('Admin', 'admin', null);
    $this->manager = createUser('Manager', 'manager', null);
    $this->otherManager = createUser('Other Manager', 'manager', null);
    $this->agent = createUser('Agent', 'agent', $this->manager->id);
    $this->teammate = createUser('Teammate', 'agent', $this->manager->id);
    $this->lonelyAgent = createUser('Lonely Agent', 'agent', null);

    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $unitAttributes = ['type_id' => $type->id, 'area_id' => $area->id, 'transaction' => 'sale', 'price' => 1000];

    $this->managersUnit = createPolicyUnit('Managers Unit', $this->manager->id, $unitAttributes);
    $this->agentsUnit = createPolicyUnit('Agents Unit', $this->agent->id, $unitAttributes);
    $this->teammatesUnit = createPolicyUnit('Teammates Unit', $this->teammate->id, $unitAttributes);
    $this->outsiderUnit = createPolicyUnit('Outsider Unit', $this->otherManager->id, $unitAttributes);
    $this->lonelyUnit = createPolicyUnit('Lonely Unit', $this->lonelyAgent->id, $unitAttributes);

    $this->policy = app(UnitPolicy::class);
});

function createPolicyUnit(string $name, ?int $userId, array $attributes): Unit
{
    $unit = new Unit(array_merge($attributes, [
        'user_id' => $userId,
        'name' => $name,
        'name_ar' => $name,
        'name_en' => $name,
    ]));
    $unit->save();

    return $unit;
}

it('lets admins do everything', function () {
    expect($this->policy->view($this->admin, $this->outsiderUnit))->toBeTrue()
        ->and($this->policy->update($this->admin, $this->outsiderUnit))->toBeTrue()
        ->and($this->policy->delete($this->admin, $this->outsiderUnit))->toBeTrue()
        ->and($this->policy->togglePin($this->admin, $this->outsiderUnit))->toBeTrue()
        ->and($this->policy->toggleDeal($this->admin, $this->outsiderUnit))->toBeTrue()
        ->and($this->policy->toggleActive($this->admin, $this->outsiderUnit))->toBeTrue();
});

it('lets a manager view and update their own and their agents units', function () {
    expect($this->policy->view($this->manager, $this->managersUnit))->toBeTrue()
        ->and($this->policy->view($this->manager, $this->agentsUnit))->toBeTrue()
        ->and($this->policy->view($this->manager, $this->outsiderUnit))->toBeFalse()
        ->and($this->policy->update($this->manager, $this->agentsUnit))->toBeTrue()
        ->and($this->policy->update($this->manager, $this->outsiderUnit))->toBeFalse();
});

it('lets a manager delete and toggle only their own and their agents units', function () {
    expect($this->policy->delete($this->manager, $this->managersUnit))->toBeTrue()
        ->and($this->policy->delete($this->manager, $this->agentsUnit))->toBeTrue()
        ->and($this->policy->delete($this->manager, $this->outsiderUnit))->toBeFalse()
        ->and($this->policy->togglePin($this->manager, $this->agentsUnit))->toBeTrue()
        ->and($this->policy->toggleActive($this->manager, $this->outsiderUnit))->toBeFalse();
});

it('lets an agent with a manager view the whole team units', function () {
    expect($this->policy->view($this->agent, $this->agentsUnit))->toBeTrue()
        ->and($this->policy->view($this->agent, $this->managersUnit))->toBeTrue()
        ->and($this->policy->view($this->agent, $this->teammatesUnit))->toBeTrue()
        ->and($this->policy->view($this->agent, $this->outsiderUnit))->toBeFalse()
        ->and($this->policy->update($this->agent, $this->agentsUnit))->toBeTrue()
        ->and($this->policy->update($this->agent, $this->managersUnit))->toBeFalse()
        ->and($this->policy->delete($this->agent, $this->agentsUnit))->toBeFalse();
});

it('lets an agent without a manager view only their own units', function () {
    expect($this->policy->view($this->lonelyAgent, $this->lonelyUnit))->toBeTrue()
        ->and($this->policy->view($this->lonelyAgent, $this->managersUnit))->toBeFalse()
        ->and($this->policy->update($this->lonelyAgent, $this->lonelyUnit))->toBeTrue()
        ->and($this->policy->delete($this->lonelyAgent, $this->lonelyUnit))->toBeFalse();
});

it('lets managers and agents see only their own projects', function () {
    $project = new Project(['user_id' => $this->manager->id, 'name' => 'Project', 'name_ar' => 'مشروع', 'name_en' => 'Project']);
    $project->save();

    $otherProject = new Project(['user_id' => $this->otherManager->id, 'name' => 'Other', 'name_ar' => 'آخر', 'name_en' => 'Other']);
    $otherProject->save();

    $policy = app(ProjectPolicy::class);

    expect($policy->view($this->manager, $project))->toBeTrue()
        ->and($policy->view($this->manager, $otherProject))->toBeFalse()
        ->and($policy->view($this->agent, $project))->toBeFalse()
        ->and($policy->view($this->admin, $otherProject))->toBeTrue()
        ->and($policy->create($this->manager))->toBeTrue()
        ->and($policy->create($this->agent))->toBeFalse()
        ->and($policy->update($this->manager, $project))->toBeTrue()
        ->and($policy->update($this->manager, $otherProject))->toBeFalse()
        ->and($policy->delete($this->admin, $otherProject))->toBeTrue()
        ->and($policy->delete($this->manager, $project))->toBeFalse();
});
