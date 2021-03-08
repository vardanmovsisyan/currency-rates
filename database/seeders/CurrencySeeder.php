<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $xml = simplexml_load_file(config("app.currency_rates_url"));
        $currency_data = $xml->Cube->Cube;
        $currency_rates = $currency_data->Cube;
        foreach ($currency_rates as $currency_rate) {
            DB::table("currencies")->insert([
                'name' => (string)$currency_rate["currency"][0],
                'rate' => floatval($currency_rate["rate"][0]),
            ]);
        }
    }
}
