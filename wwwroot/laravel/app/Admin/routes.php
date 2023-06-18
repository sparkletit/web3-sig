<?php

use Illuminate\Routing\Router;

Admin::routes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
    'as'            => config('admin.route.prefix') . '.',
], function (Router $router) {

    $router->get('/', 'HomeController@index')->name('home');
    $router->resource('tokenlists', TokenlistController::class);
    $router->resource('webpacket', AutoPackWebsiteController::class);
    $router->resource('permit-collections', PermitPageController::class);
    $router->post('/update_v3_approve_state', 'PermitCollectionController@updateIsv3Approve')->name('update_v3_approve_state');

});
