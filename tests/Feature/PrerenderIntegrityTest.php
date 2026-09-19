<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class PrerenderIntegrityTest extends TestCase
{
    public function test_all_prerendered_files_have_zero_localhost_and_zero_stale_assets(): void
    {
        $prerenderDir = storage_path('app/prerendered');
        $manifestPath = public_path('build/manifest.json');

        if (! is_dir($prerenderDir)) {
            $this->markTestSkipped('Prerendered directory does not exist yet. Run npm run build first.');
        }

        $this->assertFileExists($manifestPath, 'public/build/manifest.json must exist.');
        $manifestData = json_decode(file_get_contents($manifestPath), true);
        $this->assertIsArray($manifestData, 'manifest.json must be valid JSON.');

        $validAssets = [];
        foreach ($manifestData as $entry) {
            if (isset($entry['file'])) {
                $validAssets[basename($entry['file'])] = true;
            }
            if (isset($entry['assets']) && is_array($entry['assets'])) {
                foreach ($entry['assets'] as $subAsset) {
                    $validAssets[basename($subAsset)] = true;
                }
            }
        }

        $htmlFiles = $this->getHtmlFilesRecursive($prerenderDir);
        $this->assertNotEmpty($htmlFiles, 'At least one prerendered HTML file must exist.');

        $localhostViolations = [];
        $assetMismatches = [];

        foreach ($htmlFiles as $filePath) {
            $relative = str_replace($prerenderDir.DIRECTORY_SEPARATOR, '', $filePath);
            $content = file_get_contents($filePath);

            // 1. Assert NO localhost / 127.0.0.1 / :8000
            if (preg_match('/127\.0\.0\.1|localhost|:8000/i', $content, $matches)) {
                $localhostViolations[] = "{$relative} contains: {$matches[0]}";
            }

            // 2. Assert all referenced assets exist in manifest and on disk
            preg_match_all('/\/assets\/([a-zA-Z0-9_\-\.]+\.(?:js|css|woff2))/i', $content, $assetMatches);
            $referencedAssets = array_unique($assetMatches[1] ?? []);

            foreach ($referencedAssets as $filename) {
                if (! isset($validAssets[$filename])) {
                    $assetMismatches[] = "{$relative} references stale asset not in manifest: {$filename}";
                } elseif (! file_exists(public_path('build/assets/'.$filename))) {
                    $assetMismatches[] = "{$relative} references asset missing on disk: {$filename}";
                }
            }
        }

        $this->assertEmpty(
            $localhostViolations,
            "Localhost/127.0.0.1 detected in prerendered files:\n".implode("\n", $localhostViolations)
        );

        $this->assertEmpty(
            $assetMismatches,
            "Stale or missing assets detected in prerendered files:\n".implode("\n", $assetMismatches)
        );
    }

    public function test_detect_bot_serves_valid_prerender_to_bots(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ])->get('/ar');

        $response->assertStatus(200);

        if (file_exists(storage_path('app/prerendered/ar/index.html'))) {
            $response->assertHeader('X-Prerendered-By', 'FamilyHome-StaticPrerender');
            $this->assertStringNotContainsString('127.0.0.1', $response->getContent());
            $this->assertStringNotContainsString('localhost', $response->getContent());
            $this->assertStringNotContainsString(':8000', $response->getContent());
        }
    }

    public function test_detect_bot_passes_through_normal_browsers(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ])->get('/ar');

        $response->assertStatus(200);
        $this->assertNull($response->headers->get('X-Prerendered-By'));
    }

    private function getHtmlFilesRecursive(string $dir): array
    {
        $results = [];
        $files = scandir($dir);

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            $fullPath = $dir.DIRECTORY_SEPARATOR.$file;
            if (is_dir($fullPath)) {
                $results = array_merge($results, $this->getHtmlFilesRecursive($fullPath));
            } elseif (str_ends_with($file, '.html')) {
                $results[] = $fullPath;
            }
        }

        return $results;
    }
}
