import { Handler } from "express";

export enum HttpVerbs {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch',
}

export type EndPoint = {
    pathString: string;
    handlers: Handler[];
    httpVerb: HttpVerbs;
};

export abstract class ApiRoute {
    constructor(protected path: string) { }

    abstract getEndPoints(): EndPoint[];
}