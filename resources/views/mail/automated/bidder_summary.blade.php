@extends('mail.base')

@section('body')
    Here is your last week summary on {{ config('app.name') }}<br><br>
    <table>
        <tr style="padding: 10px">
            <td><strong>Total Orders: </strong></td>
            <td>{{ $summary['total_orders_formatted'] }}</td>
        </tr>
        <tr style="padding: 10px">
            <td><strong>Total Order Value: </strong></td>
            <td>{{ $summary['total_order_value_formatted'] }}</td>
        </tr>
        <tr style="padding: 10px">
            <td><strong>Total Commission: </strong></td>
            <td>{{ $summary['total_commission_formatted'] }}</td>
        </tr>
        <tr style="padding: 10px">
            <td><strong>Payouts: </strong></td>
            <td>{{ $summary['total_commission_paid_formatted'] }}</td>
        </tr>
        <tr style="padding: 10px">
            <td><strong>Current Balance: </strong></td>
            <td>{{ $summary['total_commission_available_formatted'] }}</td>
        </tr>
    </table>

@endsection
