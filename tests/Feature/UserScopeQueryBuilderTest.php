<?php

use App\Domain\Common\QueryBuilders\UserScopeQueryBuilder;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;

beforeEach(function () {
    $this->admin = createUser('Admin', 'admin', null);
    $this->manager = createUser('Manager', 'manager', null);
    $this->otherManager = createUser('Other Manager', 'manager', null);
    $this->agentA = createUser('Agent A', 'agent', $this->manager->id);
    $this->agentB = createUser('Agent B', 'agent', $this->manager->id);
    $this->lonelyAgent = createUser('Lonely Agent', 'agent', null);

    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $unitAttributes = ['type_id' => $type->id, 'area_id' => $area->id, 'transaction' => 'sale', 'price' => 1000];

    $this->managerUnit = Unit::create([...$unitAttributes, 'name' => 'Manager Unit', 'name_ar' => 'وحدة المدير', 'name_en' => 'Manager Unit', 'user_id' => $this->manager->id]);
    $this->agentAUnit = Unit::create([...$unitAttributes, 'name' => 'Agent A Unit', 'name_ar' => 'وحدة الوكيل أ', 'name_en' => 'Agent A Unit', 'user_id' => $this->agentA->id]);
    $this->agentBUnit = Unit::create([...$unitAttributes, 'name' => 'Agent B Unit', 'name_ar' => 'وحدة الوكيل ب', 'name_en' => 'Agent B Unit', 'user_id' => $this->agentB->id]);
    $this->lonelyUnit = Unit::create([...$unitAttributes, 'name' => 'Lonely Agent Unit', 'name_ar' => 'وحدة الوكيل الوحيد', 'name_en' => 'Lonely Agent Unit', 'user_id' => $this->lonelyAgent->id]);

    $this->managerProject = Project::create(['name' => 'Manager Project', 'name_ar' => 'مشروع المدير', 'name_en' => 'Manager Project', 'user_id' => $this->manager->id]);
    $this->otherManagerProject = Project::create(['name' => 'Other Manager Project', 'name_ar' => 'مشروع المدير الآخر', 'name_en' => 'Other Manager Project', 'user_id' => $this->otherManager->id]);
    $this->lonelyProject = Project::create(['name' => 'Lonely Agent Project', 'name_ar' => 'مشروع الوكيل الوحيد', 'name_en' => 'Lonely Agent Project', 'user_id' => $this->lonelyAgent->id]);
});

it('lets admins see every unit', function () {
    $units = UserScopeQueryBuilder::applyListingsScope(Unit::query(), $this->admin)->pluck('id');

    expect($units)->toHaveCount(4);
});

it('lets a manager see only their own and their agents units', function () {
    $units = UserScopeQueryBuilder::applyListingsScope(Unit::query(), $this->manager)->pluck('id');

    expect($units->all())->toEqualCanonicalizing([$this->managerUnit->id, $this->agentAUnit->id, $this->agentBUnit->id]);
});

it('lets an agent see the whole team units', function () {
    $units = UserScopeQueryBuilder::applyListingsScope(Unit::query(), $this->agentA)->pluck('id');

    expect($units->all())->toEqualCanonicalizing([$this->managerUnit->id, $this->agentAUnit->id, $this->agentBUnit->id]);
});

it('lets an agent without a manager see only their own units', function () {
    $units = UserScopeQueryBuilder::applyListingsScope(Unit::query(), $this->lonelyAgent)->pluck('id');

    expect($units->all())->toBe([$this->lonelyUnit->id]);
});

it('does not filter when no user is given', function () {
    $units = UserScopeQueryBuilder::applyListingsScope(Unit::query(), null)->pluck('id');

    expect($units)->toHaveCount(4);
});

it('lets admins see every project', function () {
    $projects = UserScopeQueryBuilder::applyOwnershipScope(Project::query(), $this->admin)->pluck('id');

    expect($projects)->toHaveCount(3);
});

it('lets a manager see only their own projects', function () {
    $projects = UserScopeQueryBuilder::applyOwnershipScope(Project::query(), $this->manager)->pluck('id');

    expect($projects->all())->toBe([$this->managerProject->id]);
});

it('lets an agent see only their manager projects', function () {
    $projects = UserScopeQueryBuilder::applyOwnershipScope(Project::query(), $this->agentA)->pluck('id');

    expect($projects->all())->toBe([$this->managerProject->id]);
});

it('lets an agent without a manager see all projects', function () {
    $projects = UserScopeQueryBuilder::applyOwnershipScope(Project::query(), $this->lonelyAgent)->pluck('id');

    expect($projects)->toHaveCount(3);
});

it('returns team user ids for manager and agents', function () {
    $managerTeam = UserScopeQueryBuilder::getTeamUserIds($this->manager);
    $agentTeam = UserScopeQueryBuilder::getTeamUserIds($this->agentA);

    expect($managerTeam)->toEqualCanonicalizing([$this->manager->id, $this->agentA->id, $this->agentB->id])
        ->and($agentTeam)->toEqualCanonicalizing([$this->manager->id, $this->agentA->id, $this->agentB->id]);
});
