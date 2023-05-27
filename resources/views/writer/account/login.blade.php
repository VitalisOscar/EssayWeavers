<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Writer Login - {{ config('app.name') }}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/main.css') }}">

</head>
<body>
    <div class="alert-area px-0 col-lg-4 col-xl-5 col-md-6 mx-auto">
        @if (session()->has('status'))
        <div class="alert alert-info mt-3">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            {{ session()->get('status') }}
        </div>
        @endif

        @if ($errors->has('status'))
        <div class="alert alert-danger mt-3">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            {{ $errors->get('status')[0] }}
        </div>
        @endif

        {{-- Auto dismiss the alert --}}
        <script>
            if(document.querySelector('.alert-area .alert') != null){
                setTimeout(function(){
                    document.querySelector('.alert-area .alert .close').click();
                }, 4000);
            }
        </script>
    </div>

    <div class="d-flex align-items-center justify-content-center h-100vh">

        <div class="has-loader card shadow-sm rounded" style="width: 100%, max-width: 350px; min-width: 350px">

            <form method="post">
                @csrf

                <div class="card-body">

                    <div class="py-4 mb-3 text-center">
                        <img src="{{ asset('img/logo.png') }}" alt="Logo" class="d-block mb-3 mx-auto" style="height: 70px" />
                        <h4 class="font-weight-600">Writer Login</h4>
                        <span class="d-inline-block px-4 rounded bg-primary" style="height: 3px"></span>
                    </div>

                    <div class="form-group">
                        <strong>Email:</strong>
                        <input type="email" name="email" value="{{ old('username') }}" class="form-control mt-1" required />

                        <small>Enter your email address</small>

                        @error('email')
                        <br><small class="text-danger">{{ $message }}</small>
                        @enderror
                    </div>

                    <div class="form-group mb-4">
                        <strong>Password:</strong>

                        <input type="password" name="password" value="{{ old('password') }}" class="form-control mt-1" required />
                        @error('password')
                        <small class="text-danger">{{ $message }}</small>
                        @enderror
                    </div>

                    <div class="form-group mb-4">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" id="remember" name="remember_me" class="custom-control-input" />
                            <label for="remember" class="custom-control-label">
                                <span>Remember me</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <button class="btn btn-block btn-default">Log In</button>
                    </div>

                </div>

            </form>
        </div>

    </div>

    <script src="{{ asset('vendor/jquery/dist/jquery.min.js') }}"></script>
    <script src="{{ asset('vendor/bootstrap/dist/js/bootstrap.min.js') }}"></script>
</body>
</html>
