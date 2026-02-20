<?php

namespace App\Http\Controllers\Music;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TunerController extends Controller
{
    /**
     * Display the tuner page.
     */
    public function index()
    {
        return Inertia::render('Music/Tuner');
    }
}
