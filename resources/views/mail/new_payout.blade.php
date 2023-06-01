@extends('mail.base')

@section('body')
    A new payout of {{ $amount }} has disbursed in your favour.
    Your new account status is as follows:<br>
    <strong>Total Pending: </strong> {{ $account['pending_formatted'] }}<br>
    <strong>Total Cleared: </strong> {{ $account['cleared_formatted'] }}<br>
    <strong>Total Disbursed: </strong> {{ $account['paid_out_formatted'] }}<br>
    <strong>Available: </strong> {{ $account['available_formatted'] }}<br>
    <br><br>
    @include('mail.action', ['url' => url('/writer'), 'text' => 'View Account'])
@endsection
