<?php

namespace App\Console\Commands;

use App\Domain\Users\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin 
                            {--email= : Admin email address} 
                            {--name= : Admin name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Interactively and securely create a new administrator account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('====================================');
        $this->info('  Family Home - Create Administrator');
        $this->info('====================================');

        // 1. Resolve Name
        $name = $this->option('name');
        if (empty($name)) {
            $name = $this->ask('Enter Administrator Name', 'System Administrator');
        }

        // 2. Resolve & Validate Email
        $email = $this->option('email');
        while (empty($email)) {
            $input = $this->ask('Enter Administrator Email');
            $validator = Validator::make(['email' => $input], [
                'email' => ['required', 'string', 'email:rfc,dns', 'max:255'],
            ]);

            // If strict DNS check fails locally, fallback to basic email format check
            if ($validator->fails()) {
                $basicValidator = Validator::make(['email' => $input], [
                    'email' => ['required', 'string', 'email', 'max:255'],
                ]);
                if ($basicValidator->fails()) {
                    $this->error('Invalid email address format. Please try again.');
                    continue;
                }
            }

            if (User::where('email', $input)->exists()) {
                $this->error("A user with the email '{$input}' already exists! Duplicate admins are not allowed.");
                continue;
            }

            $email = $input;
        }

        // Check if pre-supplied email already exists
        if (User::where('email', $email)->exists()) {
            $this->error("A user with the email '{$email}' already exists! Aborting.");
            return Command::FAILURE;
        }

        // 3. Resolve & Validate Password
        $password = null;
        while (empty($password)) {
            $pwd = $this->secret('Enter Password (minimum 8 characters with letters & numbers)');
            if (empty($pwd)) {
                $this->error('Password cannot be empty.');
                continue;
            }

            if (strlen($pwd) < 8) {
                $this->error('Password is too short. Minimum length is 8 characters.');
                continue;
            }

            if (!preg_match('/[a-zA-Z]/', $pwd) || !preg_match('/[0-9]/', $pwd)) {
                $this->error('Password must contain both letters and numbers for security.');
                continue;
            }

            $confirm = $this->secret('Confirm Password');
            if ($pwd !== $confirm) {
                $this->error('Passwords do not match. Please try again.');
                continue;
            }

            $password = $pwd;
        }

        // 4. Create User
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
                'is_active' => true,
                'points_balance' => 0,
                'initial_monthly_balance' => 0,
            ]);

            // Assign Spatie role if table exists
            if (DB::getSchemaBuilder()->hasTable('model_has_roles') && DB::getSchemaBuilder()->hasTable('roles')) {
                $adminRole = DB::table('roles')->where('name', 'admin')->first();
                if ($adminRole) {
                    DB::table('model_has_roles')->updateOrInsert([
                        'role_id' => $adminRole->id,
                        'model_type' => User::class,
                        'model_id' => $user->id,
                    ]);
                }
            }

            DB::commit();

            $this->newLine();
            $this->info("✅ Administrator account successfully created for '{$email}' (ID: {$user->id}).");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error('Failed to create administrator account: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
