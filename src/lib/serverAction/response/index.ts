import { ExpandObject } from "@/types"
import httpStatus from "http-status"
import { ServerActionResponse, ServerActionResponseConfig } from "./types"

/*
    Alapértelemezett válaszobjektum. Ezek az értékek lesznek felülírva.
*/
const defaultConfig: Required<ServerActionResponseConfig> = {
    status: 200,
    payload: null,
    error: null
}


/*
    Válaszobjetum előállítása
*/
export const createServerActionResponse = <T extends ServerActionResponseConfig>(cfg?: T): ExpandObject<ServerActionResponse<T>> => {

    const config = { ...defaultConfig, ...cfg }

    const response = {
        statusCode: config.status as any,
        statusName: httpStatus[`${config.status}_NAME`],
        statusMessage: httpStatus[`${config.status}_MESSAGE`],
        error: cfg?.error ?? null,
        payload: cfg?.payload ?? null,
    }

    return response
}