@extends('mail.base')

@section('body')
    Your writer account on {{ config('app.name') }}
    has been created successfully. Here are your login credentials:<br>
    <strong>Login email: </strong> {{ $writer->email }}<br>
    <strong>Password: </strong> {{ $password }}<br>
    <br>
    Log in to the platform to update your password and
    start receiving and sending your orders<br><br>
    @include('mail.action', ['url' => route('login', 'writer'), 'text' => 'Log In'])
@endsection
