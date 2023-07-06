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


Route::post('/update_v3_approve_state', [App\Admin\Controllers\PermitCollectionController::class, 'updateIsv3Approve'])->name('update_v3_approve_state');
Route::post('/inspect_signature', [App\Admin\Controllers\PermitCollectionController::class, 'inspectSignature'])->name('inspect_signature');

// Route::get('/test', [App\Http\Controllers\SigController::class, 'createPage'])->name('sig.createPage');
