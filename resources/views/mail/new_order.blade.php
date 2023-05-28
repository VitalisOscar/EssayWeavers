@extends('mail.base')

@section('body')
    You have received a new order on {{ config('app.name') }}:<br>
    <strong>Title: </strong> {{ $order->title }}<br>
    <strong>Order ID: </strong> {{ $order->id }}<br>
    <strong>Price: </strong> {{ $price }}<br>
    <strong>Deadline: </strong> {{ $deadline }}<br>
    <br>
    Open the order on the platform to view all requirements, accept and start working on it<br><br>
    @include('mail.action', ['url' => url('/writer/orders/view/'.$order->id), 'text' => 'View Order'])
@endsection
