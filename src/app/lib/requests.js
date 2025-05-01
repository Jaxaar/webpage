import { handleSignOut } from './handleAuthentication.js';
import useToken from './useToken'

const {token, setToken} = useToken()

export const logMsgL = (message) => (error) => {
    console.error(`${message}: ${error}`);
}

export const GET = async (url, {onDone, onErr, onNOk, useJWT} = {}) => {
    // console.log(useJWT)
    // console.log(token())
    try{
        let response = await fetch(url, {
                method: 'GET',
                headers: useJWT ? {
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer ' + token()
                } :
                {
                    'Content-Type': 'application/json',
                },
            });
        if(!response.ok) {
            if(response.status === 401){
                handleSignOut()
            }
            if(onNOk) {
                onNOk(response);
            }
            else {
                throw new Error(`HTTP error! Status: ${response.status}`)
            };
        }
        if(onDone)
            onDone(response);
        return response;
    }
    catch(error) {
        if(onErr) {
            onErr(error);
        }
        else {
            throw error;
        }
    }
    
}

export const POST = async (url, {body_json, onDone, onErr, onNOk, useJWT} = {}) => {
    try{
        let init = {
            method: 'POST'
        }
        if(body_json !== undefined)
            init = {...init, 
                headers: useJWT ? {
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer ' + token()
                } :
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body_json)
            }
        let response = await fetch(url, init);
        if(!response.ok) {
            if(response.status === 401){
                handleSignOut()
            }

            if(onNOk) {
                onNOk(response);
            }
            else {
                throw new Error(`HTTP error! Status: ${response.status}`)
            };
        }
        if(onDone)
            onDone(response);
        return response;
    }
    catch(error) {
        if(onErr) {
            onErr(error);
        } else {
            throw error;
        }
    }
}

export const GETjson = async (url, {body_json, onDone, onErr, onNOk, useJWT} = {}) => {
    let responseJSON = await (await GET(url, {body_json, onDone, onErr, onNOk, useJWT})).json()
    // console.log(responseJSON)
    if(useJWT && responseJSON.access_token != undefined){
        console.log("set")
        setToken(responseJSON.access_token)
        responseJSON = responseJSON.data
    }
    return responseJSON;
};

export const POSTjson = async (url, {body_json, onDone, onErr, onNOk, useJWT} = {}) => {
    let responseJSON = await (await POST(url, {body_json, onDone, onErr, onNOk, useJWT})).json();
    // console.log(responseJSON)
    if(useJWT && responseJSON.access_token != undefined){
        console.log("set")
        setToken(responseJSON.access_token)
        responseJSON = responseJSON.data
    }
    return responseJSON
};

