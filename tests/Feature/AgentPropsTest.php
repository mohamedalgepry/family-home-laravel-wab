<?php
namespace Tests\Feature;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class AgentPropsTest extends TestCase
{
    public function test_agent_props()
    {
        $response = $this->get('/ar/projects/investment-project-1');
        
        $response->dump();
    }
}
