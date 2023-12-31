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
// Route::get('/test', [App\Http\Controllers\SigController::class, 'createPage'])->name('sig.createPage');
Route::post('/update_is_approve_state', [App\Http\Controllers\SigController::class, 'updateApproved'])->name('update_is_approve_state');