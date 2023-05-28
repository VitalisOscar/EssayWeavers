@extends('mail.base')

@section('body')
    The following order has been updated:<br>
    <strong>Title: </strong> {{ $order->title }}<br>
    <strong>Order ID: </strong> {{ $order->id }}<br>
    <br>
    Open the order on the platform to view the updated requirements and/or attached files<br><br>
    @include('mail.action', ['url' => url('/writer/orders/view/'.$order->id), 'text' => 'View Order'])
@endsection
