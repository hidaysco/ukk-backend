import { Router } from 'express';

export interface IHandler{
    path: String,
    router: Router
}