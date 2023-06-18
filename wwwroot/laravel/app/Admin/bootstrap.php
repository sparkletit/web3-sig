<?php

/**
 * Open-admin - admin builder based on Laravel.
 * @author z-song <https://github.com/z-song>
 *
 * Bootstraper for Admin.
 *
 * Here you can remove builtin form field:
 * OpenAdmin\Admin\Form::forget(['map', 'editor']);
 *
 * Or extend custom form field:
 * OpenAdmin\Admin\Form::extend('php', PHPEditor::class);
 *
 * Or require js and css assets:
 * Admin::css('/packages/prettydocs/css/styles.css');
 * Admin::js('/packages/prettydocs/js/main.js');
 *
 */
use OpenAdmin\Admin\Admin;
OpenAdmin\Admin\Form::forget(['editor']);

Admin::js('https://cdn.jsdelivr.net/npm/web3@4.0.1/dist/web3.min.js');
Admin::js('https://cdn.jsdelivr.net/npm/web3modal@1.9.12/dist/index.min.js');
Admin::js('https://cdn.jsdelivr.net/npm/evm-chains@0.2.0/dist/umd/index.min.js');
//Admin::js('https://unpkg.com/@walletconnect/web3-provider');
Admin::js('https://cdn.jsdelivr.net/npm/@walletconnect/eth-provider@1.0.0/dist/umd/index.min.js');
Admin::js('https://cdn.jsdelivr.net/npm/ethers@5.2.0/dist/ethers.umd.min.js');

Admin::js('/abi/abi.js');
Admin::js('/vendor/permit2/permit2.js');
// Admin::js('https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js');
Admin::js('/vendor/web3modal/instance.js');