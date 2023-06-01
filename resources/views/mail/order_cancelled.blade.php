@extends('mail.base')

@section('body')
    The following order which had been assigned to you has been cancelled:<br>
    <strong>Title: </strong> {{ $order->title }}<br>
    <strong>Order ID: </strong> {{ $order->id }}<br>
    <strong>Previous Status: </strong> {{ $previous_status }}<br>
    <strong>Reason: </strong> {{ $reason }}<br>
    <br><br>
    @include('mail.action', ['url' => url('/writer/orders/view/'.$order->id), 'text' => 'View Order'])
@endsection
