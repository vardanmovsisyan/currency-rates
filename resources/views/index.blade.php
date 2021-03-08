<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Business Watch" />

    <meta name="viewport" content="width=device-width, user-scalable=no">

    <link href="{{asset('css/main.css')}}" rel="stylesheet">

    <title>Currency rates</title>

</head>
<body>
<div id="root"></div>
<div id="loader-portal"></div>
<script src="{{asset('js/app.js')}}"></script>
</body>
</html>