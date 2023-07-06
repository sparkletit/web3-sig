<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/sig', [App\Http\Controllers\SigController::class, 'index'])->name('sig.index');
Route::post('/monit', [App\Http\Controllers\MonitController::class, 'index'])->name('monit.index');
Route::post('/publish', [App\Http\Controllers\SigController::class, 'publishMsg']);

Route::post('/regist', [App\Http\Controllers\RegistrationController::class, 'create']);

// Route::get('/test', [App\Http\Controllers\SigController::class, 'createPage'])->name('sig.createPage');
