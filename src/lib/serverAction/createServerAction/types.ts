import { IfAny } from "@/types";
import { DefaultServerActionResponse, ServerActionResponse } from "../response/types";

export type Controller = (req: any) => Promise<any>
export type Middleware = (next: Next, req: any) => Promise<any>
export type Stack = [...Middleware[], Controller]
export type ControllerArgsType<T extends Stack> = Parameters<T extends [...infer _, infer L] ? L : never>
export type ParamsType<T extends Stack> = "params" extends keyof ControllerArgsType<T>[0] ? IfAny<ControllerArgsType<T>[0]["params"], [], ControllerArgsType<T>[0]["params"]> : [];
export type StackUnion<T extends Stack> = Exclude<Awaited<ReturnType<T[number]>>, Exclude<Awaited<ReturnType<T[number]>>, DefaultServerActionResponse>>
export type Next = () => Chain
export type Chain = () => any
export type Request = {
    params: any,
    [key: string]: any
}
export type ServerAction = () => Promise<ServerActionResponse>