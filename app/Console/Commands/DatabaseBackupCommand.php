<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PDO;

class DatabaseBackupCommand extends Command
{
    protected $signature = 'app:backup-db 
                            {--disk=local : Storage disk to save backup to} 
                            {--keep=7 : Number of days to retain backups}
                            {--database= : Specify database connection to backup}';

    protected $description = 'Perform a streamed, atomic, memory-safe pure-PHP database backup with UTF-8mb4 preservation';

    public function handle(): int
    {
        $this->info('Starting database backup (Streamed PDO engine)...');
        $startTime = microtime(true);

        $diskName = $this->option('disk') ?: 'local';
        $keepDays = (int) ($this->option('keep') ?: 7);
        $connectionName = $this->option('database') ?: null;

        $tempPath = null;

        try {
            $connection = DB::connection($connectionName);
            $pdo = $connection->getPdo();
            $database = $connection->getDatabaseName();

            // Check base tables
            $tables = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'")->fetchAll(PDO::FETCH_NUM);
            if (empty($tables)) {
                $this->warn('No tables found to backup.');

                return self::SUCCESS;
            }

            // Ensure backups directory exists
            $storage = Storage::disk($diskName);
            if (! $storage->exists('backups')) {
                $storage->makeDirectory('backups');
            }

            $dateSuffix = date('Y-m-d-His');
            $randomSuffix = bin2hex(random_bytes(4));
            $useGzip = function_exists('gzopen');

            $finalFilename = "backups/db-backup-{$dateSuffix}.".($useGzip ? 'sql.gz' : 'sql');
            $tempRelativePath = "backups/tmp-backup-{$dateSuffix}-{$randomSuffix}.".($useGzip ? 'sql.gz' : 'sql');
            $tempFullPath = $storage->path($tempRelativePath);
            $tempPath = $tempFullPath;

            // Open stream (either gzip or raw file)
            $handle = $useGzip ? gzopen($tempFullPath, 'wb9') : fopen($tempFullPath, 'wb');
            if (! $handle) {
                throw new \RuntimeException("Unable to open temporary backup file for writing: {$tempFullPath}");
            }

            $write = function (string $text) use ($handle, $useGzip) {
                if ($useGzip) {
                    gzwrite($handle, $text);
                } else {
                    fwrite($handle, $text);
                }
            };

            // 1. Header with explicit UTF-8mb4 charset and SQL mode setup
            $write("-- ========================================================\n");
            $write("-- Family Home Database Backup (Streamed PDO Engine)\n");
            $write('-- Generated: '.date('Y-m-d H:i:s')." UTC\n");
            $write("-- Database: `{$database}`\n");
            $write("-- ========================================================\n\n");

            $write("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;\n");
            $write("SET CHARACTER SET utf8mb4;\n");
            $write("SET FOREIGN_KEY_CHECKS = 0;\n");
            $write("SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n");
            $write("SET time_zone = \"+00:00\";\n\n");

            // 2. Stream Each Table Schema and Data in small chunks (Memory Safe)
            foreach ($tables as $tableRow) {
                $table = $tableRow[0];
                $this->line("Dumping table: `{$table}`...");

                $write("-- --------------------------------------------------------\n");
                $write("-- Table structure for `{$table}`\n");
                $write("-- --------------------------------------------------------\n");
                $write("DROP TABLE IF EXISTS `{$table}`;\n");

                $createTableStmt = $pdo->query("SHOW CREATE TABLE `{$table}`")->fetch(PDO::FETCH_ASSOC);
                $createSql = $createTableStmt['Create Table'] ?? '';
                $write($createSql.";\n\n");

                // Data extraction
                $count = (int) $pdo->query("SELECT COUNT(*) FROM `{$table}`")->fetchColumn();
                if ($count > 0) {
                    $write("-- Dumping data for table `{$table}` ({$count} rows)\n");

                    $offset = 0;
                    $chunkSize = 250; // Small chunk to avoid RAM spikes

                    while ($offset < $count) {
                        $stmt = $pdo->query("SELECT * FROM `{$table}` LIMIT {$chunkSize} OFFSET {$offset}");
                        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        if (empty($rows)) {
                            break;
                        }

                        $columns = array_keys($rows[0]);
                        $escapedColumns = array_map(fn ($c) => "`{$c}`", $columns);
                        $columnList = implode(', ', $escapedColumns);

                        $valuesList = [];
                        foreach ($rows as $row) {
                            $rowValues = [];
                            foreach ($row as $val) {
                                if ($val === null) {
                                    $rowValues[] = 'NULL';
                                } else {
                                    $rowValues[] = $pdo->quote($val);
                                }
                            }
                            $valuesList[] = '('.implode(', ', $rowValues).')';
                        }

                        $write("INSERT INTO `{$table}` ({$columnList}) VALUES\n".implode(",\n", $valuesList).";\n");
                        $offset += $chunkSize;
                    }
                    $write("\n");
                }
            }

            // 3. Footer
            $write("SET FOREIGN_KEY_CHECKS = 1;\n");
            $write("-- Dump completed on ".date('Y-m-d H:i:s')."\n");

            // Close stream safely
            if ($useGzip) {
                gzclose($handle);
            } else {
                fclose($handle);
            }

            // 4. Verify Integrity before renaming (Atomicity)
            if (! file_exists($tempFullPath) || filesize($tempFullPath) === 0) {
                throw new \RuntimeException('Backup failed: temporary backup file is empty or missing.');
            }

            if ($useGzip) {
                // Test gzip readability
                $testGz = gzopen($tempFullPath, 'rb');
                if (! $testGz) {
                    throw new \RuntimeException('Backup verification failed: Gzip archive cannot be read.');
                }
                $headerChunk = gzread($testGz, 256);
                gzclose($testGz);
                if (empty($headerChunk) || ! str_contains($headerChunk, 'Family Home Database Backup')) {
                    throw new \RuntimeException('Backup verification failed: Gzip header validation failed.');
                }
            }

            // 5. Atomic rename to final destination
            $finalFullPath = $storage->path($finalFilename);
            if (! rename($tempFullPath, $finalFullPath)) {
                // Fallback copy + unlink if cross-device rename
                if (! copy($tempFullPath, $finalFullPath)) {
                    throw new \RuntimeException("Failed to move temporary backup to final location: {$finalFilename}");
                }
                @unlink($tempFullPath);
            }

            $fileSize = filesize($finalFullPath);
            $formattedSize = round($fileSize / (1024 * 1024), 2).' MB ('.number_format($fileSize).' bytes)';
            $elapsed = round(microtime(true) - $startTime, 2);

            $this->info("Backup completed successfully in {$elapsed}s!");
            $this->info("Destination: [{$diskName}:{$finalFilename}] ({$formattedSize})");
            Log::info("Database backup created successfully: {$finalFilename} ({$formattedSize}) in {$elapsed}s");

            // 6. Rotate Old Backups ONLY AFTER success
            $this->cleanupOldBackups($storage, $keepDays);

            return self::SUCCESS;
        } catch (\Throwable $e) {
            // Clean up temporary file on failure
            if ($tempPath && file_exists($tempPath)) {
                @unlink($tempPath);
            }

            $this->error('Database backup failed: '.$e->getMessage());
            Log::error('Database backup error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return self::FAILURE;
        }
    }

    private function cleanupOldBackups(\Illuminate\Contracts\Filesystem\Filesystem $storage, int $keepDays): void
    {
        try {
            $files = $storage->files('backups');
            $threshold = now()->subDays($keepDays)->timestamp;

            foreach ($files as $file) {
                if (str_starts_with(basename($file), 'db-backup-')) {
                    $lastModified = $storage->lastModified($file);
                    if ($lastModified < $threshold) {
                        $storage->delete($file);
                        $this->line('Removed rotated old backup: '.basename($file));
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Backup cleanup warning: '.$e->getMessage());
        }
    }
}
