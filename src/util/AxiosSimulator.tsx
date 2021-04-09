import {AuthenticationToken} from "authentication/TokenAuthenticationProvider"
import {Permission} from "authentication/Permission"

export async function postAndReturnToken(url: string, body: string | { username: string, password: string }, headers?: {}): Promise<AuthenticationToken> {
	console.debug("Post request to url " + url)
	let value = standardToken

	return new Promise(resolve => setTimeout(resolve, 500, value))
}


const adminToken: AuthenticationToken = {
	token: "Admin token",
	issued: Date.now(),
	expires: Date.now() + 100000,
	permissions: [Permission.ADMIN, Permission.ONLY_WITH_TOKEN, Permission.LOGIN_REQUIRED]
}

const standardToken: AuthenticationToken = {
	token: "Standard token",
	issued: Date.now(),
	expires: Date.now() + 100000,
	permissions: [Permission.ONLY_WITH_TOKEN, Permission.LOGIN_REQUIRED]
}
