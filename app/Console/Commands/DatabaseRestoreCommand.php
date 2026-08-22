<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PDO;

class DatabaseRestoreCommand extends Command
{
    protected $signature = 'app:restore-db 
                            {file : Path or filename of the backup file (.sql or .sql.gz)} 
                            {--disk=local : Storage disk where backup file is located}
                            {--database= : Specify target database connection to restore into}
                            {--force : Force execution without confirmation}';

    protected $description = 'Restore a database backup (.sql or .sql.gz) into the specified database connection';

    public function handle(): int
    {
        $fileInput = $this->argument('file');
        $diskName = $this->option('disk') ?: 'local';
        $connectionName = $this->option('database') ?: null;

        $connection = DB::connection($connectionName);
        $targetDbName = $connection->getDatabaseName();

        if (! $this->option('force') && ! $this->confirm("Are you sure you want to restore into database '{$targetDbName}'? All existing data in it will be overwritten!")) {
            $this->warn('Restore cancelled.');

            return self::SUCCESS;
        }

        $this->info("Starting restore into database: `{$targetDbName}`...");
        $startTime = microtime(true);

        try {
            $storage = Storage::disk($diskName);

            // Locate file
            $fullPath = null;
            if (file_exists($fileInput)) {
                $fullPath = $fileInput;
            } elseif ($storage->exists($fileInput)) {
                $fullPath = $storage->path($fileInput);
            } elseif ($storage->exists("backups/{$fileInput}")) {
                $fullPath = $storage->path("backups/{$fileInput}");
            } else {
                throw new \RuntimeException("Backup file not found: {$fileInput}");
            }

            $isGzip = str_ends_with($fullPath, '.gz');
            $pdo = $connection->getPdo();

            // Configure PDO for raw multi-query script execution
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
            $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);

            $handle = $isGzip ? gzopen($fullPath, 'rb') : fopen($fullPath, 'rb');
            if (! $handle) {
                throw new \RuntimeException("Cannot open backup file: {$fullPath}");
            }

            $currentQuery = '';
            $executedQueries = 0;

            while (($isGzip ? ! gzeof($handle) : ! feof($handle))) {
                $line = $isGzip ? gzgets($handle, 1048576) : fgets($handle, 1048576);
                if ($line === false) {
                    break;
                }

                $trimmed = trim($line);
                if ($trimmed === '' || str_starts_with($trimmed, '--') || str_starts_with($trimmed, '/*')) {
                    continue;
                }

                $currentQuery .= $line;

                // Check if statement ended with semicolon
                if (str_ends_with(rtrim($line), ';')) {
                    $pdo->exec($currentQuery);
                    $currentQuery = '';
                    $executedQueries++;
                }
            }

            if ($isGzip) {
                gzclose($handle);
            } else {
                fclose($handle);
            }

            $elapsed = round(microtime(true) - $startTime, 2);
            $this->info("Restore completed successfully in {$elapsed}s! Executed {$executedQueries} SQL statements into `{$targetDbName}`.");
            Log::info("Database restore executed on `{$targetDbName}` from `{$fullPath}` in {$elapsed}s");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Restore failed: '.$e->getMessage());
            Log::error('Restore error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return self::FAILURE;
        }
    }
}
