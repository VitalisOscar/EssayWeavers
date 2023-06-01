@extends('mail.base')

@section('body')
    You have received an additional payment {{ '('.$type.')' }} of {{ $amount }} for the order <strong>{{ $order->title }}</strong>.
    {{
        $order->isSettled() ?
        'The payment has been added to your available balance' :
        'The payment will be cleared once the order is settled'
    }}
    <br>
    The total outstanding amount earned from this order is now {{ $total_writer_price }}
    <br><br>
    @include('mail.action', ['url' => url('/writer/orders/view/'.$order->id), 'text' => 'View Order'])
@endsection
