<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixDoubleEncodingCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-double-encoding 
                            {--dry-run : Preview changes without writing to database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean and normalize multi-level HTML entity encoding (&amp;amp;) across listing and content tables';

    /**
     * Target tables and their textual columns.
     */
    protected array $targets = [
        'units' => [
            'name_ar', 'name_en', 'description_ar', 'description_en', 
            'meta_description', 'meta_description_ar', 'meta_description_en',
            'location_address_ar', 'location_address_en', 'location_address',
        ],
        'projects' => [
            'name', 'name_ar', 'name_en', 'description', 'description_ar', 'description_en', 
            'meta_description', 'meta_description_ar', 'meta_description_en',
            'location_address_ar', 'location_address_en', 'location_address',
        ],
        'articles' => [
            'title', 'title_ar', 'title_en', 'content', 'content_ar', 'content_en', 
            'excerpt', 'excerpt_ar', 'excerpt_en', 
            'meta_description', 'meta_description_ar', 'meta_description_en',
        ],
        'areas' => [
            'name', 'name_ar', 'name_en', 'description', 'description_ar', 'description_en', 
            'meta_description', 'meta_description_ar', 'meta_description_en',
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        $this->info('======================================================');
        $this->info('  Family Home - Fix HTML Entity Double Encoding');
        $this->info('  Mode: ' . ($isDryRun ? 'DRY-RUN (Preview Only)' : 'LIVE (Applying Fixes)'));
        $this->info('======================================================');

        $totalFixed = 0;
        $summary = [];

        foreach ($this->targets as $table => $columns) {
            if (!Schema::hasTable($table)) {
                $this->warn("Table '{$table}' does not exist, skipping.");
                continue;
            }

            // Filter columns that actually exist in the table
            $existingColumns = array_filter($columns, fn ($col) => Schema::hasColumn($table, $col));
            if (empty($existingColumns)) {
                continue;
            }

            $tableFixed = 0;

            if (!$isDryRun) {
                DB::beginTransaction();
            }

            try {
                // Fetch only rows where any target column contains '&'
                $query = DB::table($table);
                $query->where(function ($q) use ($existingColumns) {
                    foreach ($existingColumns as $col) {
                        $q->orWhere($col, 'LIKE', '%&%');
                    }
                });

                $rows = $query->get();

                foreach ($rows as $row) {
                    $updates = [];

                    foreach ($existingColumns as $col) {
                        $val = $row->$col;
                        if (!is_string($val) || !str_contains($val, '&')) {
                            continue;
                        }

                        $decoded = $this->decodeEntitiesRecursively($val);

                        if ($decoded !== $val) {
                            // Security guard: ensure decoding didn't inject executable script tags
                            if ($this->hasDangerousPayload($decoded)) {
                                $this->warn("Skipping potentially unsafe HTML pattern in {$table}.{$col} (ID: {$row->id})");
                                continue;
                            }

                            $updates[$col] = $decoded;
                        }
                    }

                    if (!empty($updates)) {
                        $tableFixed++;
                        if ($isDryRun) {
                            $sampleCol = array_key_first($updates);
                            $before = mb_substr($row->$sampleCol, 0, 50);
                            $after = mb_substr($updates[$sampleCol], 0, 50);
                            $this->line(" [Dry-run] {$table} #{$row->id} ({$sampleCol}): '{$before}' -> '{$after}'");
                        } else {
                            DB::table($table)->where('id', $row->id)->update($updates);
                        }
                    }
                }

                if (!$isDryRun) {
                    DB::commit();
                }

                $summary[] = [
                    'table' => $table,
                    'checked_records' => $rows->count(),
                    'fixed_records' => $tableFixed,
                    'status' => $isDryRun ? 'Previewed' : 'Fixed',
                ];
                $totalFixed += $tableFixed;

            } catch (\Throwable $e) {
                if (!$isDryRun) {
                    DB::rollBack();
                }
                $this->error("Error processing table '{$table}': " . $e->getMessage());
                return Command::FAILURE;
            }
        }

        $this->newLine();
        $this->table(['Table', 'Matching Rows with &', 'Fixed Rows', 'Status'], $summary);
        $this->newLine();

        if ($isDryRun) {
            $this->info("Dry-run complete: {$totalFixed} record(s) contain multi-level encoded entities. Run without --dry-run to apply fixes.");
        } else {
            $this->info("Successfully normalized {$totalFixed} record(s) across all tables.");
        }

        return Command::SUCCESS;
    }

    /**
     * Iteratively decode HTML entities until stable.
     */
    private function decodeEntitiesRecursively(string $value): string
    {
        $current = $value;
        for ($i = 0; $i < 5; $i++) {
            // Decode standard quotes and XML entities in UTF-8
            $next = html_entity_decode($current, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            if ($next === $current) {
                break;
            }
            $current = $next;
        }

        return $current;
    }

    /**
     * Check if decoded content contains malicious script tags.
     */
    private function hasDangerousPayload(string $content): bool
    {
        $lower = strtolower($content);
        return str_contains($lower, '<script') 
            || str_contains($lower, '<iframe') 
            || str_contains($lower, 'javascript:') 
            || str_contains($lower, 'onerror=') 
            || str_contains($lower, 'onload=');
    }
}
