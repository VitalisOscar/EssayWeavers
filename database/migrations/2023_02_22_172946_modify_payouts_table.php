<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyPayoutsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('payouts', function (Blueprint $table) {
            $table->dropForeign(['writer_id']);
            $table->dropColumn('writer_id');
            $table->integer('recepient_id')->nullable()->after('amount');
            $table->string('recepient_type')->nullable()->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payouts', function (Blueprint $table) {
            $table->foreignId('writer_id')->constrained('writers')->onDelete('cascade');
            $table->dropColumn('recepient_id');
            $table->dropColumn('recepient_type');
        });
    }
}
