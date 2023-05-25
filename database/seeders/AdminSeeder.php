<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => 'password'
            ]
        ];

        foreach($data as $datum){
            if(!Admin::where('email', $datum['email'])->exists()){
                $datum['password'] = Hash::make($datum['password']);
                Admin::create($datum);
            }
        }
    }
}
