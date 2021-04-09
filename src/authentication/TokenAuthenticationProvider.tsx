import {postAndReturnToken} from "util/AxiosSimulator"
import {Permission} from "authentication/Permission"

export interface AuthenticationToken {
	token: string,
	issued: number,
	expires: number,
	permissions: Permission[]
}

/**
 * Class handling token issuing and verification. Communicates with backend when token expires or user requests new token
 * when login page form is issued
 */
export default class TokenAuthenticationProvider {
	// name of the key that will be used for local storage
	public authenticationTokenName: string = "authenticationToken"
	private loginUrl: string
	private renewTokenUrl: string

	constructor(loginUrl: string, renewTokenUrl: string) {
		this.loginUrl = loginUrl
		this.renewTokenUrl = renewTokenUrl
	}

	/**
	 * Checks token validity. Token is valid if it is set to the class and expiration date is in the future
	 * Returns true if token is valid
	 * @private
	 */
	private static checkTokenValidity(token: AuthenticationToken | null): boolean {
		if (token?.expires) {
			console.log("Token will expire in: " + (token.expires - Date.now() / 1000) + " s")
		}
		return token !== undefined
			&& token !== null
			&& token.expires !== undefined
			&& token.expires > Date.now()
			&& token.issued !== undefined
			&& token.issued < Date.now()
	}

	public logout() {
		localStorage.removeItem(this.authenticationTokenName)
	}

	/**
	 * Method returns valid authentication token or null.
	 * Uses fallback options as follows:
	 *  1) get token from local storage
	 *  2) issue new token on backend (this is saved to localstorage upon verification)
	 *  3) fail to retrieve token results in null
	 */
	public async getAuthenticationToken(): Promise<AuthenticationToken | null> {
		console.group("Get authentication token")
		console.time()

		const tokenFromStorage: AuthenticationToken | null = this.loadAuthenticationTokenFromStorage()
		if (TokenAuthenticationProvider.checkTokenValidity(tokenFromStorage)) {
			console.debug("Token was retrieved from local storage")
			console.timeEnd()
			console.groupEnd()
			return tokenFromStorage
		}

		const token = await this.requestTokenRenewal()
		console.groupEnd()
		return await this.checkBackendRenewedToken(token)
	}

	public async requestTokenRenewal(): Promise<AuthenticationToken | null> {
		const authenticationToken = localStorage.getItem(this.authenticationTokenName)
		if (authenticationToken == null) {
			return null
		}
		localStorage.removeItem(this.authenticationTokenName)

		console.debug("Requesting token renewal with data " + JSON.stringify(authenticationToken))
		return postAndReturnToken(this.renewTokenUrl, JSON.stringify(authenticationToken), {headers: {"Content-Type": "application/json"}}).then(response => {
			console.debug("Returning response of renewal " + response)
			return response
		})
	}

	/**
	 * Used for login page
	 * @param authentication
	 */
	public async requestNewTokenFromBackend(authentication: { username: string, password: string }): Promise<AuthenticationToken | null> {
		return postAndReturnToken(this.loginUrl, authentication)
			.then(res => {
				const authenticationToken = res
				localStorage.setItem(this.authenticationTokenName, JSON.stringify(authenticationToken))
				console.debug("Authentication is set to " + JSON.stringify(authenticationToken))
				return authenticationToken
			})
			.catch(error => {
				console.error("Failed to retrieve login details from backend. " + error)
				return null
			})
	}

	/**
	 * Checks that token received from backend, because previous token expired, is valid. If yes, saves it to local storage
	 * @param token
	 * @private
	 */
	private async checkBackendRenewedToken(token: AuthenticationToken | null): Promise<AuthenticationToken | null> {
		if (TokenAuthenticationProvider.checkTokenValidity(token)) {
			localStorage.setItem(this.authenticationTokenName, JSON.stringify(token))
			console.debug("Token was renewed from backend")
			console.timeEnd()
			console.groupEnd()
			return token
		}
		return null
	}

	/**
	 * Tries to load existing authentication from storage. If that fails, returs null
	 * @private
	 */
	private loadAuthenticationTokenFromStorage(): AuthenticationToken | null {
		console.group("Load authentication token from storage")
		const tokenString = localStorage.getItem(this.authenticationTokenName)

		if (tokenString) {
			const token: AuthenticationToken = JSON.parse(tokenString)
			console.groupEnd()
			return token
		}
		console.groupEnd()
		return null
	}
}


/**
 * Initialized instance of authentication provider, handling token
 */
export var tokenAuthenticationProvider: TokenAuthenticationProvider = new TokenAuthenticationProvider(
	"authentication/login",
	`authentication/renew`
)
