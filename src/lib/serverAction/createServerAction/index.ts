import { ExpandObject } from "@/types"
import { createServerActionResponse } from "../response"
import { Status500 } from "../response/types"
import { Controller, Middleware, ParamsType, Request, Stack, StackUnion } from "./types"


/*
    Függvények láncolása rekurzív módon
*/

export const usingMiddlewares = (stack: Stack, req: Request, index: number = 0): () => any => {

    const current = stack[index]

    if (index < stack.length - 1) {
        const next = usingMiddlewares(stack, req, index + 1)
        return () => (current as Middleware)(next, req)
    }

    return () => (current as Controller)(req)
}

/*
    Burkoló a láncoláshoz.
*/

export const createServerAction = <Args extends Stack>(...stack: Args) => {
    return async (...ServerActionParams: ParamsType<Args>): Promise<StackUnion<Args> | ExpandObject<Status500>> => {
        try {
            const chain = usingMiddlewares(stack, ({ params: ServerActionParams }))
            const result = await chain()
            return result
        } catch (error) {
            console.error(error)
            return createServerActionResponse({ status: 500, error: "Server error" })
        }
    }
}



