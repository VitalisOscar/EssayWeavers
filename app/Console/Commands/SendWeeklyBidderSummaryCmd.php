<?php

namespace App\Console\Commands;

use App\Models\Bidder;
use App\Models\BidderPayment;
use App\Notifications\WeeklyBidderSummaryNotification;
use Illuminate\Console\Command;

class SendWeeklyBidderSummaryCmd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:weekly_bidder_summary';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'The command sends a weekly performance summary to each bidder';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $from = now()->endOfWeek()->subWeek();
        $from->setHour(21)->setMinute(1);
        $this->line("Sending summary from ".$from->toDayDateTimeString());

        $bidders = Bidder::with([
            'orders' => function($q) use($from){
                $q->whereDate('created_at', '>', $from->toDateTimeString());
            },
            'payouts' => function($q) use($from){
                $q->whereDate('created_at', '>', $from->toDateTimeString());
            },
            'payments' => function($q) use($from){
                $q->whereDate('created_at', '>', $from->toDateTimeString());
            }
        ])
        ->get();

        $bidders->each(function ($bidder){
            if(is_null($bidder->email)) return;

            $bidder->notify(new WeeklyBidderSummaryNotification($bidder->toArray()['performance']));
        });

        return 0;
    }
}
