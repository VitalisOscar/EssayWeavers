@extends('mail.base')

@section('body')
    The following order which had been assigned to you has been settled:<br>
    <strong>Title: </strong> {{ $order->title }}<br>
    <strong>Order ID: </strong> {{ $order->id }}<br><br>
    {{ $cleared_amount }} has been cleared and added to your available balance.
    <br><br>
    @include('mail.action', ['url' => url('/writer/orders/view/'.$order->id), 'text' => 'View Order'])
@endsection
