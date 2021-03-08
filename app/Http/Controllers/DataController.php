<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Currency;
use App\Models\FromConversion;
use App\Models\ToConversion;

class DataController extends Controller
{

    /**
     * Display currency rates
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $data = new \stdClass();
        $data->currencies = Currency::all();
        $data->conversions = DB::table("from_conversions")
            ->join("to_conversions", "from_conversions.id", "=", "to_conversions.from_conversion_id")
            ->join("users", "from_conversions.user_id", "=", "users.id")
            ->join("currencies as from_currencies", "from_conversions.currency_id", "=", "from_currencies.id")
            ->join("currencies as to_currencies", "to_conversions.currency_id", "=", "to_currencies.id")
            ->select(
                "from_conversions.id as id",
                "from_conversions.created_at as date",
                "users.name as user",
                "from_conversions.amount as from_amount",
                "from_currencies.name as from_currency",
                "to_currencies.name as to_currency",
                "to_conversions.amount as to_amount"
            )->orderBy("id", "desc")
            ->get();
        return response()->json($data);
    }

    /**
     * Display currency rates
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function conversion(Request $request)
    {
        $data = new \stdClass();

        $amount_from = $request->input("amount_from");
        $currency_from = $request->input("currency_from");
        $currency_to = $request->input("currency_to");

        $today = Carbon::today();
        $currency_from_rec = Currency::where("id", $currency_from)->whereDate('updated_at', ">=", $today->toDateString()." 00:00:00")->first();
        $currency_to_rec = Currency::where("id", $currency_to)->whereDate('updated_at', ">=", $today->toDateString()." 00:00:00")->first();
        if (!$currency_from_rec || !$currency_to_rec) {
            $xml = simplexml_load_file(config("app.currency_rates_url"));
            $currency_data = $xml->Cube->Cube;
            $currency_rates = $currency_data->Cube;
            foreach ($currency_rates as $currency_rate) {
                $currency = Currency::where("name", (string)$currency_rate["currency"][0])->first();
                $currency->update(['rate' => floatval($currency_rate["rate"][0])]);
            }

            $currency_from_rec = Currency::where("id", $currency_from)->where('updated_at', ">=", $today->toDateString()." 00:00:00")->first();
            $currency_to_rec = Currency::where("id", $currency_to)->where('updated_at', ">=", $today->toDateString()." 00:00:00")->first();
        }

        $new_from_conversion = new FromConversion();
        $new_from_conversion->currency_id = $currency_from;
        $new_from_conversion->amount = $amount_from;
        $new_from_conversion->user_id = Auth::id();
        $new_from_conversion->save();

        $amount_to = $amount_from / $currency_from_rec->rate * $currency_to_rec->rate;
        $amount_to = round($amount_to, 3);

        $new_to_conversion = new ToConversion();
        $new_to_conversion->currency_id = $currency_to;
        $new_to_conversion->from_conversion_id = $new_from_conversion->id;
        $new_to_conversion->amount = $amount_to;
        $new_to_conversion->save();

        $data->conversions = DB::table("from_conversions")
            ->join("to_conversions", "from_conversions.id", "=", "to_conversions.from_conversion_id")
            ->join("users", "from_conversions.user_id", "=", "users.id")
            ->join("currencies as from_currencies", "from_conversions.currency_id", "=", "from_currencies.id")
            ->join("currencies as to_currencies", "to_conversions.currency_id", "=", "to_currencies.id")
            ->select(
                "from_conversions.id as id",
                "from_conversions.created_at as date",
                "users.name as user",
                "from_conversions.amount as from_amount",
                "from_currencies.name as from_currency",
                "to_currencies.name as to_currency",
                "to_conversions.amount as to_amount"
            )->orderBy("id", "desc")
            ->get();

        $data->amount = $amount_to;

        return response()->json($data);
    }
}
